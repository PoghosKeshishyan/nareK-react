import { useEffect, useState } from 'react';
import { Calendar } from '../components/Calendar';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from '../axios';

export function CalendarPage() {
    const [child, setChild] = useState({});
    const [parent, setParent] = useState({});
    const [weeks, setWeeks] = useState([]);
    const { id, month, year } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadingData();
    }, [])

    const loadingData = async () => {
        // loading data from backend
        const responseChild = await axios.get(`children/${id}`);
        setChild(responseChild.data);

        const responseParent = await axios.get(`parents/${responseChild.data.parent_id}`);
        setParent(responseParent.data);

        const weeks = await axios.get(`weeks?child_id=${id}&month=${month}&year=${year}`);
        setWeeks(weeks.data);
    }

    const onCheckDay = async (dayId, week) => {
        let currentWeek;

        const newWeeks = weeks.map(elem => {
            if (elem.id === week.id) {
                currentWeek = elem;

                elem.days.map(day => {
                    if (day.id === dayId) {
                        day.completed = !day.completed;
                    }

                    return day;
                })

                const totalDays = elem.days.filter(elem => elem.completed).length;
                elem.total_days = totalDays;
            }

            return elem;
        })

        setWeeks(newWeeks);
        await axios.put(`weeks/${week.id}`, currentWeek)
    }

    const onChangeInput = async (event, dayId, week) => {
        let currentWeek;

        const newWeeks = weeks.map(elem => {
            if (elem.id === week.id) {
                currentWeek = elem;
                let totalHours = 0;

                elem.days.forEach(day => {
                    if (day.id === dayId) {
                        day[event.target.name] = event.target.value;
                    }
    
                    if (day.arrived && day.isGone) {
                        const arrivedTime = new Date(`2024-01-01T${day.arrived}`);
                        const isGoneTime = new Date(`2024-01-01T${day.isGone}`);
                        const intervalHours = (isGoneTime - arrivedTime) / (1000 * 60 * 60); // Время в часах
                        totalHours += intervalHours;
                    }
                });
    
                elem.total_time_in_week = totalHours.toFixed(1);
            }
    
            return elem;
        });
    
        setWeeks(newWeeks);
        await axios.put(`weeks/${week.id}`, currentWeek);
    }

    return (
        <div className='CalendarPage'>
            <button onClick={() => navigate(-1)} className='btn back'>
                {parent.name?.split(' ')[0]}
            </button>

            <Link to='/' className='btn home'>Home</Link>

            <h3 className='title'>Attendance</h3>

            <div className='info_client'>
                <p className='month'>{month}-{year}</p>
                <p>Child’s Name: {child.name}</p>
            </div>

            <Calendar
                childId={id}
                year={year}
                month={month}
                weeks={weeks}
                onCheckDay={onCheckDay}
                onChangeInput={onChangeInput}
            />
        </div>
    )
}
