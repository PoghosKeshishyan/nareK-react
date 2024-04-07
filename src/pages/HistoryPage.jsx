import { useEffect } from 'react';
import { useState } from 'react';
import axios from '../axios';

export function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [showYearsContainer, setShowYearsContainer] = useState(false);

  useEffect(() => {
    loadingData();
  }, [])

  const loadingData = async () => {
    // selected year
    let year = sessionStorage.getItem('Year');

    if (!year) {
      year = new Date().getFullYear();
    }

    setSelectedYear(year);


    const responseHistory = await axios.get(`history?year=${year}`);
    setHistory(responseHistory.data);

    const responseYears = await axios.get('years');
    setYears(responseYears.data);
  }

  const calculateTotalAmount = () => {
    let sum = 0;

    for (let i = 0; i < history.length; i++) {
      sum += +history[i].amount.slice(1);
    }

    return `$${sum.toFixed(2)}`;
  }

  const onChangeYear = (event) => {
    setSelectedYear(event.target.textContent);
    sessionStorage.setItem('Year', event.target.textContent);
    setShowYearsContainer(false);
    loadingData();
  }

  return (
    <div className='HistoryPage'>
      <table>
        <thead>
          <tr>
            <th>N</th>
            <th>Client name</th>
            <th>Payment date</th>
            <th>Payment amount</th>
          </tr>

          {
            history.map((elem, index) => (
              <tr key={elem.id}>
                <td>{index + 1}</td>
                <td>{elem.parent_name}</td>
                <td>{elem.payment_date}</td>
                <td>{elem.amount}</td>
              </tr>
            ))
          }

          <tr>
            <td className='total' colSpan={3}>Total amount:</td>
            <td className='total_amount'>{calculateTotalAmount()}</td>
          </tr>
        </thead>
      </table>

      <div className='years'>
        <button 
          className='years_title btn' 
          onClick={() => setShowYearsContainer(!showYearsContainer)}
        >
          {selectedYear}
        </button>

        {
          showYearsContainer && <div className='years_container'>
            {
              years.map(item => (
                <p key={item.id} onClick={onChangeYear}>
                  {item.year}
                </p>
              ))
            }
          </div>
        }
      </div>

    </div>
  )
}
