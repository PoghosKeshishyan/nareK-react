import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MessageBox } from '../components/MessageBox';
import { Loading } from '../components/Loading';
import { ModalPaymentConfirm } from '../components/ModalPaymentConfirm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCircleLeft, faPaperPlane, faDownload, faCheck } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from "../config";
import html2pdf from 'html2pdf.js';
import axios from '../axios';

export function SendEmailPage() {
  const [formData, setFormData] = useState({
    parent_email: '',
    message: '',
    dates_interval: '',
    subject: '',
    children: []
  });

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id, week, month, year } = useParams();

  useEffect(() => {
    loadingData();
  }, [])

  const squareNumbers = (num1, num2) => {
    if (num2 === 0) {
      return (num1 * 1).toFixed(2);
    }

    return (num1 * num2).toFixed(2);
  }

  const calculateTotalExtendedDays = async (child_id, number_of_hours) => {
    try {
      const response = (await axios.get(`week/child/${child_id}?month=${month}&year=${year}`)).data;
      const result = response.filter(el => el.week === parseInt(week))[0];
      let countExtendedDays = 0;
      let interval = 0;

      result.days.forEach(day => {
        if (day.arrived && day.isGone) {
          const arrivedTime = new Date(`2024-01-01T${day.arrived}`);
          const isGoneTime = new Date(`2024-01-01T${day.isGone}`);
          const intervalHours = (isGoneTime - arrivedTime) / (1000 * 60 * 60);
          interval += intervalHours;

          if (interval.toFixed(2) > number_of_hours) {
            countExtendedDays++;
          }
        }
      });
      
      return countExtendedDays;
    } catch (error) {
      console.error('Error calculating extended days:', error);
      return 0;
    }
  };

  const loadingData = async () => {
    try {
      const responseHeader = await axios.get('header');
      const responseSingleChild = await axios.get(`children/${id}`);
      const parentId = responseSingleChild.data.parent_id;
      const responseProvider = await axios.get('provider');
      const responseParent = await axios.get(`parent/${parentId}`);
      const allChildrenParent = await axios.get(
        `week/parent/${parentId}?week=${week}&month=${month}&year=${year}`
      );

      // filter childs which did not come during the week
      const arr = allChildrenParent.data.filter(el => el.total_days && el.total_time_in_week);

      // the clicked child is placed at the beginning of the array
      const foundIndex = arr.findIndex(item => item.child_id === responseSingleChild.data.id);

      let result;

      if (foundIndex !== -1) {
        const foundElement = arr[foundIndex];
        result = [foundElement, ...arr.slice(0, foundIndex), ...arr.slice(foundIndex + 1)];
      } else {
        result = arr;
      }

      const childrenData = await Promise.all(result.map(async child => {
        const response = await axios.get(`children/${child.child_id}`);
        const currentChild = response.data;

        const numberOfHours = currentChild.number_of_hours;
        let hours_count = child.total_time_in_week;
        let hours_count_extended = 0;
        let number_of_weeks_extended = 0;
        let total_days_extended = 0;

        if (hours_count > numberOfHours) {
          hours_count_extended = hours_count - numberOfHours;
          hours_count = numberOfHours;
          number_of_weeks_extended = 1;
          total_days_extended = await calculateTotalExtendedDays(child.child_id, currentChild.number_of_hours);
        }

        let amount = squareNumbers(hours_count, currentChild.cost_for_per_hour.slice(1));
        let amountExtended = squareNumbers(hours_count_extended, currentChild.cost_for_extended_minutes.slice(1));

        const cost_for_per_hour_extended = hours_count_extended > 0 ? currentChild.cost_for_extended_minutes : '$0';

        const objData = {
          number_of_weeks: '1',
          number_of_weeks_extended,
          amount: `$${amount}`,
          amount_extended: `$${amountExtended}`,
          total_days_extended,
          cost_for_per_hour_extended,
          hours_count,
          hours_count_extended: hours_count_extended.toFixed(1),
        };

        return { ...child, ...objData, ...currentChild };
      }));

      const message1 = 'Dear parent, we kindly request that you make a payment in accordance with the details provided in this bill.';
      const message2 = `Kind regards, \n${responseProvider.data[0].name}`;

      setFormData({
        title: responseHeader.data[0].title,
        logo: responseHeader.data[0].logo,
        dates_interval: allChildrenParent.data[0].dates,
        parent_email: responseParent.data.email,
        parent_name: responseParent.data.name,
        parent_id: responseParent.data.id,
        proveider_email: responseProvider.data[0].email,
        children: childrenData,
        message1,
        message2,
        subject: `${allChildrenParent.data[0].dates} Mrs. N's Child Care/Preschool Weekly Bill for ${responseParent.data.name}`,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onChangeEmailBox = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const calculateTotalAmount = () => {
    let sum = 0;

    formData.children.forEach(elem => {
      let sum1 = +elem.amount?.slice(1);
      let sum2 = +elem.amount_extended?.slice(1);
      sum += sum1 + sum2;
    });

    return `$${sum.toFixed(2)}`;
  }

  const convertToPdfAndDownload = async () => {
    try {
      const actions = document.querySelector('.SendEmailPage form .actions');
      actions.style.display = 'none';

      const messageBox = document.querySelector('.SendEmailPage');

      const response = await fetch(`${API_URL}${formData.logo}`);
      const blob = await response.blob();

      const imgURL = URL.createObjectURL(blob);

      html2pdf()
        .from(messageBox)
        .set({
          filename: `${formData.subject}.pdf`,
          pagebreak: { mode: 'avoid-all' },
          margin: [-65, 0, 0, -25],
          html2canvas: { scale: 2 },
          jsPDF: { format: 'a4', orientation: 'landscape' }
        })
        .toPdf()
        .get('pdf')
        .then(pdf => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;      // 883
            canvas.height = img.height;    // 837
            ctx.drawImage(img, 0, 0);
            const imgData = canvas.toDataURL('image/jpeg');

            // Adjust coordinates and dimensions as needed
            pdf.addImage(imgData, 'JPEG', 249, 17, 30, 30);
            pdf.save(`${formData.subject}.pdf`);

            actions.style.display = 'flex';
          };

          // Set the image source after the onload event to load it
          img.src = imgURL;
        });
    } catch (error) {
      console.error('Ошибка при преобразовании в PDF:', error);
    }
  };

  const formSubmitHandler = async () => {
    setLoading(true);

    try {
      await axios.post('send-email/coupon', formData)
        .then(res => {
          setLoading(false);
          alert(res.data.message);
        });
    } catch (error) {
      alert(error.message);
    }
  }

  const handlerConfirmPayment = async () => {
    const payment_date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');

    const data = {
      year,
      payment_date,
      amount: calculateTotalAmount(),
      parent_id: formData.parent_id,
    };

    await axios.post('story/add', data);
  }

  return (
    <div className='SendEmailPage'>
      <Link to='/' className='btn home'>
        <FontAwesomeIcon icon={faHouse} />
      </Link>
      
      {console.log(formData)}
      
      <Link to={-1} className='btn back'>
        <FontAwesomeIcon icon={faCircleLeft} />
      </Link>

      {
        loading && <Loading loadingMessage={'Sending message'} />
      }

      <form onSubmit={e => e.preventDefault()}>
        <MessageBox
          formData={formData}
          squareNumbers={squareNumbers}
          onChangeEmailBox={onChangeEmailBox}
          calculateTotalAmount={calculateTotalAmount}
        />

        <div className="actions">
          <button className='btn' onClick={formSubmitHandler}>
            <FontAwesomeIcon icon={faPaperPlane} />
            Send to email
          </button>

          <button className='btn' onClick={convertToPdfAndDownload}>
            <FontAwesomeIcon icon={faDownload} />
            Download to pdf
          </button>

          <button className='btn' onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faCheck} />
            Payment Confirmation
          </button>
        </div>
      </form>

      {
        showModal && (
          <ModalPaymentConfirm
            setShowModal={setShowModal}
            parentId={formData.parent_id}
            totalAmount={calculateTotalAmount}
            handlerConfirmPayment={handlerConfirmPayment}
          />
        )
      }
    </div>
  )
}
