import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MessageBox } from '../components/MessageBox';
import { Loading } from '../components/Loading';
import { ModalPaymentConfirm } from '../components/ModalPaymentConfirm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCircleLeft, faPaperPlane, faDownload, faCheck } from '@fortawesome/free-solid-svg-icons';
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

        if (hours_count > numberOfHours) {
          hours_count_extended = hours_count - numberOfHours;
          hours_count = numberOfHours;
        }

        let amount = squareNumbers(hours_count, currentChild.cost_for_per_hour.slice(1));
        let amountExtended = squareNumbers(hours_count_extended, currentChild.cost_for_per_hour.slice(1));

        const cost_for_per_hour_extended = hours_count_extended > 0 ? currentChild.cost_for_per_hour : '$0';

        const objData = {
          number_of_weeks: '1',
          number_of_weeks_extended: '0',
          amount: `$${amount}`,
          amount_extended: `$${amountExtended}`,
          total_days_extended: '0',
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

  const onChangeInput = (event, id) => {
    const { name, value } = event.target;
    let current_id;

    const newFormData = formData.children.map(elem => {
      if (elem.id === id) {
        current_id = elem.id;
        elem = { ...elem, [name]: value };
      }

      return elem;
    })

    const children = newFormData.map(elem => {
      if (current_id === elem.id) {
        let sum1 = +elem.cost_for_per_hour.slice(1);
        let sum2 = +elem.total_time_in_week;

        let sum3 = +elem.cost_for_per_hour_extended.slice(1);
        let sum4 = +elem.hours_count_extended;

        return {
          ...elem,
          amount: `$${(sum1 * sum2).toFixed(2)}`,
          amount_extended: `$${(sum3 * sum4).toFixed(2)}`
        }
      }
    })

    setFormData({ ...formData, children });
  }

  const calculateTotalAmount = () => {
    let sum = 0;

    formData.children.forEach(elem => {
      let sum1 = +elem.amount?.slice(1);
      let sum2 = +elem.amount_extended?.slice(1);

      if (sum2 === 0) {
        sum += sum1;
      } else {
        sum += sum1 + sum2;
      }
    });

    return `$${sum.toFixed(2)}`;
  }

  const convertToPdfAndDownload = async () => {
    // Hide the button before creating the PDF
    const actions = document.querySelector('.SendEmailPage form .actions');
    actions.style.display = 'none';

    // Then create the PDF
    const messageBox = document.querySelector('.SendEmailPage');

    html2pdf()
      .from(messageBox)
      .set({
        filename: `${formData.subject}.pdf`,
        pagebreak: { mode: 'avoid-all' },
        margin: [-64, 0, 0, -25],
        html2canvas: { scale: 2 },
        jsPDF: { format: 'a4', orientation: 'landscape' }
      })
      .save();

    // Restore the visibility of the button after creating the PDF
    setTimeout(() => {
      actions.style.display = 'flex';
    }) 
  };

  const formSubmitHandler = async () => {
    setLoading(true);

    await axios.post('send-email/coupon', formData)
      .then(res => {
        setLoading(false);
        alert(res.data.message);
      });
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
          onChangeInput={onChangeInput}
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
            Download to pdf nkar
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
