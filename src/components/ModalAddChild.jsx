import { useEffect, useState, useRef } from 'react';
import { Loading } from './Loading';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import axios from '../axios';

export function ModalAddChild({ id, setShowModal, loadingData }) {
    const [loading, setLoading] = useState(false);
    const birthPickerRef = useRef(null);
    const enrollmentPickerRef = useRef(null);

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-');

    useEffect(() => {
        const birthPicker = flatpickr(birthPickerRef.current, {
            dateFormat: 'm-d-Y'
        });

        const enrollmentPicker = flatpickr(enrollmentPickerRef.current, {
            dateFormat: 'm-d-Y'
        });

        return () => {
            birthPicker.destroy();
            enrollmentPicker.destroy();
        };
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        birth: '',
        parent_id: id,
        discharge: '-',
        number_of_hours: '',
        enrollment: today,
    });

    const onChangeInput = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const submitHandler = async (event) => {
        event.preventDefault();

        if (formData.number_of_hours === '0') {
            return alert('Number of hours must be a number greater than 0.');
        }

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
                        type="text"
                        ref={birthPickerRef}
                        placeholder='mm-dd-yyyy'
                        name='birth'
                        value={formData.birth}
                        onInput={onChangeInput}
                        required
                    />
                </div>

                <div className='form_item'>
                    <p>Date of enrollment:</p>

                    <input
                        type='text'
                        name='enrollment'
                        ref={enrollmentPickerRef}
                        required
                        placeholder='mm-dd-yyyy'
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
