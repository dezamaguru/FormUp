import './AdeverintePage.css';
import { useState } from 'react';
import AddAdeverinta from './AddAdeverinta';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import  useAxiosPrivate  from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';

function AdeverintePage() {
    const [showDropDown, setShowDropDown] = useState(false);
    const [adeverinte, setAdeverinte] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();

    const getAdeverinte = async (controller = new AbortController(), isMounted = true) => {
        try {
            const response = await axiosPrivate.get('/adeverinte', {
                signal: controller.signal,
            });
            if (isMounted) {
                setAdeverinte(response.data);
            }
        } catch (error) {
            if (error.name === 'CanceledError') {
                console.log('Request canceled:', error.message);
            } else {
                console.error(error.response?.data);
                navigate('/', { state: { from: location }, replace: true });
            }
        }
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
    
        getAdeverinte(controller, isMounted);
    
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate, navigate, location]);
    

    const handleClick = (id) => {
        navigate(`/adeverinte/${id}`); // navigheaza catre adeverinta solicitata
    }

    return (

        <div>
            {auth?.type === 'student' && (
                    <div>
                        <p>Aici sunt adeverintele</p>
                <br/>
                <br/>

                <button onClick={ () => setShowDropDown( ((prev) => !prev))}>Adauga cerere</button>
                { showDropDown && <AddAdeverinta onAdd={getAdeverinte} />  }

                <br/>
                <br/>
                <p>Istoric solicitari</p>
                <article>
                    { Array.isArray(adeverinte) &&  adeverinte.length > 0
                    ? (
                        <ul>
                            {adeverinte.map(adeverinta => (
                                <li key={adeverinta.id_adeverinta} onClick={() => handleClick(adeverinta.id_adeverinta)}>
                                    Solicitare adeverinta {adeverinta.tip_adeverinta} - {adeverinta.nume_student} - {adeverinta.status}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nu exista solicitari pentru adeverinte.</p>
                    )}
                </article>
                </div>
            )}
            
            {auth?.type === 'secretar' && (
                <div>
                    <p>Aici sunt adeverintele</p>
                    <br/>
                    <br/>

                    { Array.isArray(adeverinte) &&  adeverinte.length > 0
                    ? (
                        <ul>
                            {adeverinte.map(adeverinta => (
                                <li key={adeverinta.id_adeverinta} onClick={() => handleClick(adeverinta.id_adeverinta)}>
                                    Solicitare adeverinta {adeverinta.tip_adeverinta} - {adeverinta.nume_student}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nu exista solicitari pentru adeverinte.</p>
                    )}

                </div>
            )}

        </div>
    );
}

export default AdeverintePage;

