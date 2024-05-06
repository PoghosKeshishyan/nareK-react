export function SendEmailTable({ child, isLastIteration, calculateTotalAmount }) {
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
                    <td>{child.number_of_weeks}</td>
                    <td>{child.total_days}</td>
                    <td>{child.total_time_in_week}</td>
                    <td>{child.cost_for_per_hour}</td>
                    <td>{child.amount}</td>
                </tr>

                <tr>
                    <th>Extended minutes</th>
                    <td>{child.number_of_weeks_extended}</td>
                    <td>{child.total_days_extended}</td>
                    <td>{child.hours_count_extended}</td>
                    <td>{child.cost_for_per_hour_extended} (Per minute)</td>
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
