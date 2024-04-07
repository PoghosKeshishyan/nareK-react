import { useEffect, useState } from "react"
import axios from "../axios";

export function ModalPaymentConfirm({ setShowModal, parentId, totalAmount }) {
    const [formData, setFormData] = useState({ parent_email: '', subject: '', message: '' });

    const onChangeInput = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    useEffect(() => {
        loadingData();
    }, [])

    const loadingData = async () => {
        const response = (await axios.get(`parents/${parentId}`)).data;

        setFormData({
            parent_id: response.id,
            parent_email: response.email,
            subject: `Payment Confirmation for ${response.name} for Mrs. N's Child Care/Preschool`,
            message: `Mrs. N’s Fireflies Child Care/Preschool \nLic. 343625479 \n\nThank you for your payment! \nYour bill payment has been successfully received. \n\nName: ${response.name} \nPayment Date: ${new Date().toISOString().split('T')[0]} \nPayment Amount: ${totalAmount()}`,
        })
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        console.log(formData);
        setShowModal(false);
    }

    return (
        <div className="ModalPaymentConfirm">
            <div className='dark_bg' onClick={() => setShowModal(false)}></div>

            <form onSubmit={submitHandler}>
                <h2 className='title'>
                    Payment Confirmation

                    <span className='close_modal' onClick={() => setShowModal(false)}>
                        &times;
                    </span>
                </h2>

                <label htmlFor="parent_email">
                    <p>Email:</p>
                    <input
                        type="email"
                        id="parent_email"
                        name="parent_email"
                        placeholder="parent email"
                        value={formData.parent_email}
                        onChange={onChangeInput}
                    />
                </label>

                <label htmlFor="subject">
                    <p>Subject:</p>
                    <textarea
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="subject"
                        value={formData.subject}
                        onChange={onChangeInput}
                    />
                </label>

                <label htmlFor="message">
                    <p>Message:</p>
                    <textarea
                        id="message"
                        name="message"
                        placeholder="message"
                        value={formData.message}
                        onChange={onChangeInput}
                    />
                </label>

                <input type="submit" value="Send to email" className="btn" />
            </form>
        </div>
    )
}
