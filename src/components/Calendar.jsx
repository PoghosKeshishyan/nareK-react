import { Link } from 'react-router-dom';
import { faAt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Calendar({ childId, month, year, weeks, onCheckDay, onChangeInput }) {
    return (
        <div className='Calendar'>
            {
                weeks.map((elem, index) => <div className='week' key={index}>
                    <div className='content'>
                        {
                            elem.days.map(day => day.title && (
                                <div className={`sub_item ${day.disabled ? 'active' : ''}`} key={day.id}>
                                    <h3>
                                        {day.title.split('/')[0]}
                                        {day.title.split('/')[1] !== month && ` (${day.title.split('/')[1].slice(0, 3)})`}
                                    </h3>

                                    <form>
                                        <input
                                            type='checkbox'
                                            name='completed'
                                            checked={day.completed}
                                            onChange={() => onCheckDay(day.id, elem.id)}
                                        />

                                        <input
                                            type='time'
                                            name='arrived'
                                            className='arrived'
                                            value={day.arrived}
                                            onChange={e => onChangeInput(e, day.id, elem.id)}
                                        />

                                        <input
                                            type='time'
                                            name='isGone'
                                            className='isGone'
                                            value={day.isGone}
                                            onChange={e => onChangeInput(e, day.id, elem.id)}
                                        />
                                    </form>
                                </div>
                            ))
                        }
                    </div>

                    <div className='actions'>
                        <div className='action_content'>
                            <p>Total time in week: <b>{elem.total_time_in_week}</b> hours</p>
                            <p className='dates'>{weeks[index].dates}</p>
                        </div>

                        <Link
                            className='btn'
                            disabled={true}
                            to={`/child/${childId}/${elem.week}/${month}/${year}/feedback`}
                        >
                            <FontAwesomeIcon icon={faAt} />
                            Email
                        </Link>
                    </div>
                </div>)
            }
        </div>
    )
}
