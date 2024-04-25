import { useEffect, useState } from 'react';
import { Calendar } from '../components/Calendar';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCircleLeft } from '@fortawesome/free-solid-svg-icons';
import axios from '../axios';

export function CalendarPage() {
    const [child, setChild] = useState({});
    const [weeks, setWeeks] = useState([]);
    const { id, month, year } = useParams();

    useEffect(() => {
        loadingData();
    }, [])

    const loadingData = async () => {
        const responseChild = await axios.get(`children/${id}`);
        setChild(responseChild.data);

        const weeksResponse = await axios.get(`week/child/${id}?month=${month}&year=${year}`);
        setWeeks(weeksResponse.data);
    }

    const onCheckDay = async (dayId, weekId) => {
        const newWeeks = weeks.map(elem => {
            if (elem.id === weekId) {
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
        const currentWeek = newWeeks.filter(week => week.id === weekId)[0];
        await axios.put(`week/edit/${weekId}`, currentWeek);
    }

    const onChangeInput = async (event, dayId, weekId) => {
        const newWeeks = weeks.map(elem => {
            if (elem.id === weekId) {
                let totalHours = 0;

                elem.days.forEach(day => {
                    if (day.id === dayId) {
                        day[event.target.name] = event.target.value;
                    }

                    if (day.arrived && day.isGone) {
                        const arrivedTime = new Date(`2024-01-01T${day.arrived}`);
                        const isGoneTime = new Date(`2024-01-01T${day.isGone}`);
                        const intervalHours = (isGoneTime - arrivedTime) / (1000 * 60 * 60);
                        totalHours += intervalHours;
                    }
                });

                elem.total_time_in_week = totalHours.toFixed(1);
            }

            return elem;
        });

        setWeeks(newWeeks);
        const currentWeek = newWeeks.filter(week => week.id === weekId)[0];
        await axios.put(`week/edit/${weekId}`, currentWeek);
    }

    return (
        <div className='CalendarPage'>
            <Link to='/' className='btn home'>
                <FontAwesomeIcon icon={faHouse} />
            </Link>

            <Link to={-1} className='btn back'>
                <FontAwesomeIcon icon={faCircleLeft} />
            </Link>

            <div className='info_client'>
                <p>Child’s Name: <b>{child.name}</b></p>
                <p>Attendance</p>
                <p>{month} {year}</p>
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
