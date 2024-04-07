import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MessageBox } from '../components/MessageBox';
import axios from '../axios';
import { ModalPaymentConfirm } from '../components/ModalPaymentConfirm';

export function SendEmailPage() {
  const [formData, setFormData] = useState({
    parent_email: '',
    message: '',
    dates_interval: '',
    subject: '',
    children: []
  });

  const [showModal, setShowModal] = useState(false);
  const { id, week, month, year } = useParams();

  useEffect(() => {
    loadingData();
  }, [])

  const loadingData = async () => {
    const responseHeader = await axios.get('header');

    const responseSingleChild = await axios.get(`children/${id}`);
    const parentId = responseSingleChild.data.parent_id;

    const responseParent = await axios.get(`parents/${parentId}`);
    const responseProvider = await axios.get('provider');

    const allChildrenParent = await axios.get(
      `weeks?parent_id=${parentId}&week=${week}&month=${month}&year=${year}`
    );

    // filter childs which did not come during the week
    const arr = allChildrenParent.data.filter(el => el.total_days || el.total_time_in_week);

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
    const message2 = `Kind regards: \n${responseProvider.data.name}`;

    setFormData({
      title: responseHeader.data.title,
      logo: responseHeader.data.logo,
      dates_interval: allChildrenParent.data[0].dates,
      parent_email: responseParent.data.email,
      parent_name: responseParent.data.name,
      parent_id: responseParent.data.id,
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

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(formData);
  }

  const handlerConfirmPayment = async () => {
    const confirm = window.confirm('Are you sure?');

    if (confirm) {
      const data = {
        year,
        amount: calculateTotalAmount(),
        parent_name: formData.parent_name,
        payment_date: new Date().toISOString().split('T')[0]
      };

      await axios.post('history', data);
    }
  }

  return (
    <div className='SendEmailPage'>
      <Link to={-1} className='btn back'>{month}_{year}</Link>
      <Link to='/' className='btn home'>Home</Link>

      <form onSubmit={submitHandler}>
        <MessageBox
          formData={formData}
          squareNumbers={squareNumbers}
          onChangeInput={onChangeInput}
          onChangeEmailBox={onChangeEmailBox}
          calculateTotalAmount={calculateTotalAmount}
        />

        {/* <div className='container'>
            <div className='title'>
              <h3>{formData.title} Weekly Bill <br /> Lic. 343625479</h3>

              <div className='logo'>
                <img src={formData.logo} alt='logo' />
              </div>
            </div>

            <div className='client_info'>
              <p>Parent’s name: <b>{formData.parent_name}</b></p>
            </div>

            {
              formData.children.map((child, index) => (
                <div className='child' key={index}>
                  <div className='client_info'>
                    <p>Child's name: <b>{child.child_name}</b></p>
                  </div>

                  <SendEmailTable
                    child={child}
                    onChangeInput={onChangeInput}
                    squareNumbers={squareNumbers}
                  />
                </div>
              ))
            }

            <div className='total'>
              <p>Total Due for Week:</p>
              <p>{formData.dates_interval}</p>
              <p>{calculateTotalAmount()}</p>
            </div>
          </div> */}

        <input type='submit' value='Submit' className='btn email' />
      </form>

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
          />
        )
      }
    </div>
  )
}
