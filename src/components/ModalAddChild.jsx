import { useState } from 'react';
import { Loading } from './Loading';
import axios from '../axios';

export function ModalAddChild({ id, setShowModal, loadingData }) {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        birth: '',
        parent_id: id,
        discharge: '-',
        number_of_hours: '',
        enrollment: new Date().toISOString().split('T')[0],
    });

    const onChangeInput = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const submitHandler = async (event) => {
        event.preventDefault();

        setLoading(true);

        await axios.post('children/add', formData)
            .then(() => {
                loadingData();
                setShowModal();
                setLoading(false);
            });
    }

    return (
        <div className='ModalAddChild'>
            <div className='dark_bg' onClick={() => setShowModal(false)}></div>

            {
                loading && <Loading loadingMessage={'Creating new child...'} />
            }

            <form onSubmit={submitHandler}>
                <h2 className='title'>
                    Add child

                    <span className='close_modal' onClick={() => setShowModal(false)}>
                        &times;
                    </span>
                </h2>

                <div className='form_item'>
                    <p>Child's name:</p>

                    <input
                        required
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={onChangeInput}
                    />
                </div>

                <div className='form_item'>
                    <p>Total week hours based on the contract/agreement:</p>

                    <input
                        type='number'
                        name='number_of_hours'
                        required
                        value={formData.number_of_hours}
                        onChange={onChangeInput}
                    />
                </div>

                <div className='form_item'>
                    <p>Date of birth:</p>

                    <input
                        type='date'
                        name='birth'
                        required
                        value={formData.birth}
                        onChange={onChangeInput}
                    />
                </div>

                <div className='form_item'>
                    <p>Date of enrollment:</p>

                    <input
                        type='date'
                        name='enrollment'
                        required
                        value={formData.enrollment}
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
