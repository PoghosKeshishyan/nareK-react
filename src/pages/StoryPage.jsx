import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCircleLeft } from '@fortawesome/free-solid-svg-icons';
import axios from '../axios';

export function StoryPage() {
  const [story, setStory] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [showYearsContainer, setShowYearsContainer] = useState(false);

  useEffect(() => {
    loadingData();
  }, [])

  const loadingData = async () => {
    // loading selected year
    let year = sessionStorage.getItem('Year');

    if (!year) {
      year = new Date().getFullYear();
    }

    setSelectedYear(year);

    // years
    const responseYears = await axios.get('year');
    setYears(responseYears.data);

    // stories 
    const responseStory = (await axios.get(`story/${year}`)).data;
    const mixedResponseStory = [];

    for (const elem of responseStory) {
      const responseParent = (await axios.get(`parent/${elem.parent_id}`)).data;
      mixedResponseStory.push({ ...elem, parent_name: responseParent.name });
    }

    setStory(mixedResponseStory);
  }

  const calculateTotalAmount = () => {
    let sum = 0;

    for (let i = 0; i < story.length; i++) {
      sum += +story[i].amount.slice(1);
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
    <div className='StoryPage'>
      <Link to='/' className='btn home'>
        <FontAwesomeIcon icon={faHouse} />
      </Link>

      <Link to={-1} className='btn back'>
        <FontAwesomeIcon icon={faCircleLeft} />
      </Link>

      <table>
        <thead>
          <tr>
            <th>N</th>
            <th>Client name</th>
            <th>Payment date</th>
            <th>Payment amount</th>
          </tr>
        </thead>

        <tbody>
          {
            story.map((elem, index) => (
              <tr key={elem.id}>
                <td>{index + 1}</td>
                <td>{elem.parent_name}</td>
                <td>{elem.payment_date}</td>
                <td>{elem.amount}</td>
              </tr>
            ))
          }

          <tr className='total'>
            <td colSpan={3}>Total amount:</td>
            <td className='total_amount'>{calculateTotalAmount()}</td>
          </tr>
        </tbody>
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
