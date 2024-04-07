import { Link } from 'react-router-dom';

export function Calendar({ childId, month, year, showBtn, weeks, onCheckDay, onChangeInput }) {
    return (
        <div className='Calendar'>
            {
                weeks.map((elem, index) => <div className='week' key={index}>
                    <div className='content'>
                        {
                            elem.days.map(day => (
                                <div className={`sub_item ${day.disabled ? 'active' : ''}`} key={day.id}>
                                    <h3>{day.title}</h3>

                                    <form>
                                        <input
                                            type='checkbox'
                                            name='completed'
                                            checked={day.completed}
                                            onChange={() => onCheckDay(day.id, elem)}
                                        />

                                        <input
                                            type='time'
                                            name='arrived'
                                            className='arrived'
                                            value={day.arrived}
                                            onChange={e => onChangeInput(e, day.id, elem)}
                                        />

                                        <input
                                            type='time'
                                            name='isGone'
                                            className='isGone'
                                            value={day.isGone}
                                            onChange={e => onChangeInput(e, day.id, elem)}
                                        />
                                    </form>
                                </div>
                            ))
                        }
                    </div>

                    <div className='actions'>
                        <div className='action_content'>
                            <p>Total time in week: {elem.total_time_in_week} Hours</p>
                            <p className='dates'>{weeks[index].dates}</p>
                        </div>

                        <Link 
                          className='btn'
                          disabled={true}
                          to={`/child/${childId}/${elem.week}/${month}/${year}/feedback`} 
                        >
                            Email
                        </Link>
                    </div>
                </div>)
            }
        </div>
    )
}
