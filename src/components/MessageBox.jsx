import { SendEmailTable } from "./SendEmailTable";
import { API_URL } from "../config";

export function MessageBox({ formData, onChangeEmailBox, squareNumbers, onChangeInput, calculateTotalAmount }) {
    return (
        <div className="MessageBox">
            <div className="form_item">
                <input
                    required
                    type="text"
                    name='parent_email'
                    value={formData.parent_email}
                    placeholder='Email'
                    onChange={onChangeEmailBox}
                />

                <input
                    required
                    type="text"
                    name='subject'
                    value={formData.subject}
                    placeholder='Subject'
                    onChange={onChangeEmailBox}
                />

                <textarea
                    required
                    placeholder='Message...'
                    value={formData.message1}
                    name='message'
                    className="message"
                    onChange={onChangeEmailBox}
                />
            </div>

            <div className='container'>
                <div className='title'>
                    <h3>{formData.title} Weekly Bill <br /> Lic. 343625479</h3>

                    <div className='logo'>
                        <img src={`${API_URL}${formData.logo}`} alt='logo' />
                    </div>
                </div>

                <div className='client_info'>
                    <p>Parent’s name: <b>{formData.parent_name}</b></p>
                </div>

                {
                    formData.children.map((child, index, array) => {
                        const isLastIteration = index === array.length - 1;
                        
                        return (
                            <div className="child" key={index}>
                                <div className='client_info'>
                                    <p>Child's name: <b>{child.child_name}</b></p>
                                </div>

                                <SendEmailTable
                                    child={child}
                                    onChangeInput={onChangeInput}
                                    squareNumbers={squareNumbers}
                                    isLastIteration={isLastIteration}
                                    calculateTotalAmount={calculateTotalAmount}
                                />
                            </div>
                        )
                    })
                }
            </div>

            <textarea
                required
                placeholder='Message...'
                value={formData.message2}
                name='message'
                className="message regards"
                onChange={onChangeEmailBox}
            />
        </div>
    )
}
