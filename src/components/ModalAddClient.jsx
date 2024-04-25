import { useState } from 'react';
import axios from '../axios';

export function ModalAddClient({ setShowModal, loadingClients }) {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        telephone: '',
        email: '',
    });

    const onChangeInput = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        await axios.post('parent/add', formData);
        loadingClients();
        setShowModal();
    }

    return (
        <div className='ModalAddClient'>
            <div className='dark_bg' onClick={() => setShowModal(false)}></div>

            <form onSubmit={submitHandler}>
                <h2 className='title'>
                    Add client

                    <span className='close_modal' onClick={() => setShowModal(false)}>
                        &times;
                    </span>
                </h2>

                <div className='form_item'>
                    <p>Parent's name:</p>

                    <input
                        type='text'
                        name='name'
                        required
                        value={formData.name}
                        onChange={onChangeInput}
                    />
                </div>

                <div className='form_item'>
                    <p>Address:</p>

                    <input
                        type='text'
                        name='address'
                        required
                        value={formData.address}
                        onChange={onChangeInput}
                    />
                </div>

                <div className='form_item'>
                    <p>Telephone:</p>

                    <input
                        type='tel'
                        name='telephone'
                        required
                        value={formData.telephone}
                        onChange={onChangeInput}
                    />
                </div>

                <div className='form_item'>
                    <p>E-mail:</p>

                    <input
                        type='email'
                        name='email'
                        required
                        value={formData.email}
                        onChange={onChangeInput}
                    />
                </div>

                <div className='form_item'>
                    <input type='submit' value='Submit' className='btn' />
                </div>
            </form>
        </div>
    )
}
