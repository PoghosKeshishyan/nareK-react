import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ModalAddClient } from '../components/ModalAddClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGear, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import axios from '../axios';

export function HomePage() {
    const [client, setClient] = useState([]);
    const [provider, setProvider] = useState({});
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadingClients();
    }, [])

    const loadingClients = async () => {
        const responseParents = await axios.get('parent');
        const parentsData = responseParents.data;

        const responseChildren = await axios.get('children');
        const childrenData = responseChildren.data;

        const responseProvider = await axios.get('provider');
        setProvider(responseProvider.data[0]);

        const combinedData = parentsData.map(parent => {
            const children = childrenData.filter(child => child.parent_id === parent.id);
            return { ...parent, children };
        });

        setClient(combinedData);
    }

    return (
        <div className='HomePage'>
            <div className='client'>
                <h2>Clients</h2>

                <table className='clientTable'>
                    <thead>
                        <tr>
                            <th>N</th>
                            <th>Parent</th>
                            <th>Child</th>
                            <th>Date of enrollment</th>
                            <th>Date of discharge</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            client.map((parent, index) => {
                                const childrenCount = parent.children.length;

                                return (
                                    <React.Fragment key={index}>
                                        <tr onClick={() => navigate(`/client/${parent.id}`)}>
                                            <td rowSpan={childrenCount}>{index + 1}</td>

                                            <td rowSpan={childrenCount}>{parent.name}</td>

                                            {
                                                childrenCount > 0 ? (
                                                    <>
                                                        <td>{parent.children[0].name}</td>
                                                        <td>{parent.children[0].enrollment}</td>
                                                        <td>{parent.children[0].discharge}</td>
                                                    </>
                                                ) : (
                                                    <td colSpan='3'>No children</td>
                                                )
                                            }
                                        </tr>

                                        {
                                            parent.children.slice(1).map((child, i) => (
                                                <tr key={i} onClick={() => navigate(`/client/${parent.id}`)}>
                                                    <td>{child.name}</td>
                                                    <td>{child.enrollment}</td>
                                                    <td>{child.discharge}</td>
                                                </tr>
                                            ))
                                        } 
                                    </React.Fragment>
                                );
                            })
                        }
                    </tbody>
                </table>

                <button className='btn client' onClick={() => setShowModal(true)}>
                    <FontAwesomeIcon icon={faCirclePlus} />
                    Add client
                </button>
            </div>

            <div className='provider'>
                <h2>
                    <FontAwesomeIcon icon={faUser} />
                    Provider
                </h2>

                <table className='providerTable'>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <td>{provider.name}</td>
                        </tr>
                        <tr>
                            <th>Telephone</th>
                            <td>{provider.address}</td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td>{provider.telephone}</td>
                        </tr>
                        <tr>
                            <th>E-mail</th>
                            <td>{provider.email}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {
                showModal && <ModalAddClient
                    setShowModal={setShowModal}
                    loadingClients={loadingClients}
                />
            }

            <Link to='/profile' className='btn provider'>
                <FontAwesomeIcon icon={faGear} />
                Profile page
            </Link>
        </div>
    )
}
