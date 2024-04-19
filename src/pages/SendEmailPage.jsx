import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MessageBox } from '../components/MessageBox';
import { Loading } from '../components/Loading';
import { ModalPaymentConfirm } from '../components/ModalPaymentConfirm';
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

  const loadingData = async () => {
    const responseHeader = await axios.get('header');

    const responseSingleChild = await axios.get(`children/${id}`);
    const parentId = responseSingleChild.data.parent_id;

    const responseParent = await axios.get(`parent/${parentId}`);
    const responseProvider = await axios.get('provider');

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

    const children = result?.map(child => {
      const objData = { costHour: '$8.00', numberWeeksExt: '-', hoursExt: '-', daysExt: '-', costHourExt: '-', amountExt: '$0', numberWeeks: '1' };
      const newChild = { ...child, ...objData };
      return newChild;
    })

    const message1 = 'Dear valued parent, we kindly request that you make a payment in accordance with the details provided in this bill.';
    const message2 = `Kind regards: \n${responseProvider.data[0].name}`;

    setFormData({
      title: responseHeader.data[0].title,
      logo: responseHeader.data[0].logo,
      dates_interval: allChildrenParent.data[0].dates,
      parent_email: responseParent.data.email,
      parent_name: responseParent.data.name,
      parent_id: responseParent.data.id,
      proveider_email: responseProvider.data[0].email,
      children,
      message1,
      message2,
      subject: `${allChildrenParent.data[0].dates} Mrs. N's Child Care/Preschool Weekly Bill for ${responseParent.data.name}`,
    });
  }

  const squareNumbers = (num1, num2) => {
    if (num2 === 0) {
      return (num1 * 1).toFixed(2);
    }

    return (num1 * num2).toFixed(2);
  }

  const onChangeEmailBox = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const onChangeInput = (event, id) => {
    const newFormData = formData.children.map(elem => {
      if (elem.id === id) {
        elem = { ...elem, [event.target.name]: event.target.value };
      }

      return elem;
    })

    const result = { ...formData, children: newFormData };

    setFormData(result);
  }

  const calculateTotalAmount = () => {
    let sum = 0;

    formData.children.forEach(elem => {
      if (elem.costHourExt === '-' || elem.hoursExt === '-') {
        elem.costHourExt = '$0';
        elem.hoursExt = 0;
      }

      let sum1 = +elem.costHour.slice(1) * +elem.total_time_in_week;
      let sum2 = +elem.costHourExt.slice(1) * +elem.hoursExt;

      sum += sum1 + sum2;
    });

    return `$${sum.toFixed(2)}`;
  }

  const handleConvertToPDF = () => {
    // Hide the button before creating the PDF
    const downloadPdfButton = document.querySelector('.SendEmailPage .btn.download_pdf');
    if (downloadPdfButton) {
      downloadPdfButton.style.display = 'none';
    }

    // Then create the PDF
    const sendEmailPageDiv = document.querySelector('.SendEmailPage');

    html2pdf().from(sendEmailPageDiv).set({
      filename: 'SendEmailPage.pdf',
      pagebreak: { mode: 'avoid-all' },
      margin: [-75, 5, 0, 0],
      html2canvas: { scale: 2 },
      jsPDF: { format: 'a4', orientation: 'landscape' }
    }).save();

    // Restore the visibility of the button after creating the PDF (if necessary)
    if (downloadPdfButton) {
      setTimeout(() => {
        downloadPdfButton.style.display = 'block'; // Or 'inline-block', depending on the original button style
      }) 
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    console.log(formData);
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
      parent_name: formData.parent_name,
    };

    await axios.post('story/add', data);
  }

  return (
    <div className='SendEmailPage'>
      <Link to={-1} className='btn back'>{month}_{year}</Link>
      <Link to='/' className='btn home'>Home</Link>

      {
        loading && <Loading loadingMessage={'Sending message'} />
      }

      <form onSubmit={submitHandler}>
        <MessageBox
          formData={formData}
          squareNumbers={squareNumbers}
          onChangeInput={onChangeInput}
          onChangeEmailBox={onChangeEmailBox}
          calculateTotalAmount={calculateTotalAmount}
        />

        <input type='submit' value='Submit' className='btn email' />
      </form>

      <button className='btn download_pdf' onClick={handleConvertToPDF}>
        <i className="fa-solid fa-download"></i>
        Download to pdf
      </button>

      <div className='confirm'>
        <p>Payment Confirmation</p>

        <button className='btn' onClick={() => setShowModal(true)}>
          Confirm
        </button>
      </div>

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
