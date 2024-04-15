import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ModalAddChild } from '../components/ModalAddChild';
import axios from '../axios';

export function ClientPage() {
    const [parent, setParent] = useState({ name: '', address: '', telephone: '', email: '' });
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState({name: ''});
    const [months, setMonths] = useState([]);
    const [years, setYears] = useState([]);
    const [showChildContainer, setShowChildContainer] = useState(false);
    const [showYearsContainer, setShowYearsContainer] = useState(false);
    const [selectedYear, setSelectedYear] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showSubmitBtnParent, setShowSubmitBtnParent] = useState(false);
    const [showSubmitBtnChild, setShowSubmitBtnChild] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        loadingData();
    }, [])

    const loadingData = async () => {
        const responseParent = await axios.get(`parent/${id}`);
        setParent(responseParent.data);

        const responseChildren = await axios.get(`children/by_parent_id?parent_id=${id}`);
        setChildren(responseChildren.data);

        if (sessionStorage.getItem('Child')) {
            setSelectedChild(JSON.parse(sessionStorage.getItem('Child')))
        } else {
            setSelectedChild(responseChildren.data[0]);
        }

        const responseMonths = await axios.get('month');
        setMonths(responseMonths.data);

        const responseYears = await axios.get('year');
        setYears(responseYears.data);

        // selected year
        if (sessionStorage.getItem('Year')) {
            setSelectedYear(sessionStorage.getItem('Year'))
        } else {
            setSelectedYear(new Date().getFullYear());
        }
    }

    const onChangeYear = (event) => {
        setSelectedYear(event.target.textContent);
        sessionStorage.setItem('Year', event.target.textContent);
        setShowYearsContainer(false);
    }

    const onChangeChild = (child) => {
        setSelectedChild(child);
        sessionStorage.setItem('Child', JSON.stringify(child));
        setShowChildContainer(false);
    }

    const onChangeParentsInput = (event) => {
        setShowSubmitBtnParent(true);

        const { name, value } = event.target;

        setParent((prevClient) => ({
            ...prevClient,
            [name]: value
        }));
    }

    const onChangeChildrenInput = (event, id) => {
        setShowSubmitBtnChild(true);

        const { name, value } = event.target;

        const newChildren = children.map(el => {
            if (el.id === id) {
                el[name] = value;
            }

            return el;
        })

        setChildren(newChildren);
    }

    const parentSubmitHandler = async (event) => {
        event.preventDefault();
        await axios.put(`parent/edit/${id}`, parent);
        setShowSubmitBtnParent(false);
    }

    const childrenSubmitHandler = async (event) => {
        event.preventDefault();

        children.forEach(async child => {
            await axios.put(`children/edit/${child.id}`, child);
        })

        setShowSubmitBtnChild(false);
    }

    return (
        <div className='ClientPage'>
            <Link to='/' className='btn home'>Home</Link>

            <div className='info'>
                <form onSubmit={parentSubmitHandler} className='parentsForm'>
                    <table>
                        <tbody>
                            <tr>
                                <td>Parent's name:</td>
                                <td>
                                    <input
                                        type='text'
                                        name='name'
                                        value={parent.name}
                                        onChange={onChangeParentsInput}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Address:</td>
                                <td>
                                    <input
                                        type='text'
                                        name='address'
                                        value={parent.address}
                                        onChange={onChangeParentsInput}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Tel.</td>
                                <td>
                                    <input
                                        type='text'
                                        name='telephone'
                                        value={parent.telephone}
                                        onChange={onChangeParentsInput}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>E-mail:</td>
                                <td>
                                    <input
                                        type='text'
                                        name='email'
                                        value={parent.email}
                                        onChange={onChangeParentsInput}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {
                        showSubmitBtnParent && <input type='submit' value='Update' className='btn' />
                    }
                </form>

                <form onSubmit={childrenSubmitHandler} className='childrenForm'>
                    {
                        children.map((child, index) => (
                            <table key={index}>
                                <tbody>
                                    <tr>
                                        <td>Child's name:</td>
                                        <td>
                                            <input
                                                type='text'
                                                name='name'
                                                value={child.name}
                                                onChange={e => onChangeChildrenInput(e, child.id)}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Date of birth:</td>
                                        <td>
                                            <input
                                                type='date'
                                                name='birth'
                                                value={child.birth}
                                                onChange={e => onChangeChildrenInput(e, child.id)}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Date of enrollment:</td>
                                        <td>
                                            <input
                                                type='date'
                                                name='enrollment'
                                                value={child.enrollment}
                                                onChange={e => onChangeChildrenInput(e, child.id)}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Date of discharge:</td>
                                        <td>
                                            <input
                                                type='text'
                                                name='discharge'
                                                value={child.discharge}
                                                onChange={e => onChangeChildrenInput(e, child.id)}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        ))
                    }

                    {
                        showSubmitBtnChild && <input type='submit' value='Update' className='btn' />
                    }
                </form>

                <button className='btn' onClick={() => setShowModal(true)}>
                    + Add child
                </button>
            </div>

            {
                showModal && <ModalAddChild
                    id={id}
                    setShowModal={setShowModal}
                    loadingData={loadingData}
                />
            }

            <div className='months'>
                <div className='title'>
                    <p 
                      className='child_name'
                      onClick={() => setShowChildContainer(!showChildContainer)}
                    >
                        {selectedChild?.name}
                    </p>

                    <h3>Attendance</h3>

                    <p className='years_title' onClick={() => setShowYearsContainer(!showYearsContainer)}>
                        {selectedYear}
                    </p>

                    {
                        showChildContainer && children.length > 1 && <div className='child_container'>
                            {
                                children.map(child => (
                                    <p 
                                      key={child.id}
                                      onClick={() => onChangeChild(child)}
                                    >
                                        {child.name}
                                    </p>
                                ))
                            }
                        </div>
                    }

                    {
                        showYearsContainer && <div className='years_container'>
                            {
                                years.map(item => (
                                    <p key={item.id} onClick={onChangeYear}>
                                        {item.year}
                                    </p>
                                ))
                            }
                        </div>
                    }
                </div>

                <div className='months_container'>
                    {
                        months.map((item, index) => (
                            <Link 
                              key={index}
                              className='btn month'
                              to={`/child/${selectedChild?.id}/${item.month}/${selectedYear}`}
                            >
                                {item.month}
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
