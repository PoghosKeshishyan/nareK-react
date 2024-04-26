export function SendEmailTable({ child, isLastIteration, calculateTotalAmount, onChangeInput }) {
    return (
        <table className="SendEmailTable">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Number of weeks</th>
                    <th>Days</th>
                    <th>Hours</th>
                    <th>Cost for Per Hour</th>
                    <th>Amount</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>Weekly Attendance</th>
                    <td>
                        <input
                            type='text'
                            name='number_of_weeks'
                            value={child.number_of_weeks}
                            onChange={(e) => onChangeInput(e, child.id)}
                        />
                    </td>
                    <td>{child.total_days}</td>
                    <td>{child.total_time_in_week}</td>
                    <td>
                        <input
                            type='text'
                            name='cost_for_per_hour'
                            value={child.cost_for_per_hour}
                            onChange={(e) => onChangeInput(e, child.id)}
                        />
                    </td>
                    <td>{child.amount}</td>
                </tr>

                <tr>
                    <th>Extended Hours</th>
                    <td>
                        <input
                            type='text'
                            name='number_of_weeks_extended'
                            value={child.number_of_weeks_extended}
                            onChange={(e) => onChangeInput(e, child.id)}
                        />
                    </td>
                    <td>
                        <input
                            type='text'
                            name='total_days_extended'
                            value={child.total_days_extended}
                            onChange={(e) => onChangeInput(e, child.id)}
                        />
                    </td>
                    <td>{child.hours_count_extended}</td>
                    <td>
                        <input
                            type='text'
                            name='cost_for_per_hour_extended'
                            value={child.cost_for_per_hour_extended}
                            onChange={(e) => onChangeInput(e, child.id)}
                        />
                    </td>
                    <td>{child.amount_extended}</td>
                </tr>

                {
                    isLastIteration && <tr className="total">
                        <th className="total_head">Total Due for Week:</th>
                        <td colSpan={4}>{child.dates}</td>
                        <td>{calculateTotalAmount()}</td>
                    </tr>
                }
            </tbody>
        </table>
    )
}
