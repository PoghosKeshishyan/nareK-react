export function SendEmailTable({ child, squareNumbers, onChangeInput}) {
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
                            name='numberWeeks'
                            value={child.numberWeeks}
                            onChange={(e) => onChangeInput(e, child.id)}
                        />
                    </td>
                    <td>{child.total_days}</td>
                    <td>{child.total_time_in_week}</td>
                    <td>
                        <input
                            type='text'
                            name='costHour'
                            value={child.costHour}
                            onChange={(e) => onChangeInput(e, child.id)}
                        />
                    </td>
                    <td>${squareNumbers(Number(child.total_time_in_week), Number(child.costHour.slice(1))).toString()}</td>
                </tr>

                <tr>
                    <th>Extended Hours</th>
                    <td>
                        <input
                            type='text'
                            name='numberWeeksExt'
                            value={child.numberWeeksExt}
                            onChange={(e) => onChangeInput(e, child.id)}
                        />
                    </td>
                    <td>
                        <input
                            type='text'
                            name='hoursExt'
                            value={child.hoursExt}
                            onChange={(e) => onChangeInput(e, child.id)}
                        />
                    </td>
                    <td>
                        <input
                            type='text'
                            name='daysExt'
                            value={child.daysExt}
                            onChange={(e) => onChangeInput(e, child.id)}
                        />
                    </td>
                    <td>
                        <input
                            type='text'
                            name='costHourExt'
                            value={child.costHourExt}
                            onChange={(e) => onChangeInput(e, child.id)}
                        />
                    </td>
                    <td>
                        <input
                            type='text'
                            name='amountExt'
                            value={child.amountExt}
                            onChange={(e) => onChangeInput(e, child.id)}
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
