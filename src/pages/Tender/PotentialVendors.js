import React, { useState, useRef, useLayoutEffect, useCallback } from 'react'
import Pagination from '../../components/Misc/Pagination';
import { workSectors } from '../../data/data'
import { FaPlus, FaCheck } from 'react-icons/fa'
import OperationResult from '../../components/Misc/OperationResult'
import ExpressVendorInfo from '../../components/modal content/ExpressVendorInfo'
import PotentialVendor from './PotentialVendor'
import Modal from '../../components/Misc/Modal'
import useFetch from '../../hooks/useFetch';
const PotentialVendors = (props) => {
    const [potentialVendors, setPotentialVendors] = useState({ count: 0, content: [] });
    const activePageRef = useRef(0);
    const [operationResult, setOperationResult] = useState({ visible: false, desc: '', icon: null })
    const searchStateRef = useRef({
        name: '',
        voen: '',
        sphere: ''
    });
    const fetchGet = useFetch("GET");
    const makeExpressVendor = useCallback((id, name) => {
        const onFinish = () => {
            fetchGet('http://192.168.0.182:54321/api/potential-vendors?from=0')
                .then(respJ => {
                    const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                    setPotentialVendors({ count: totalCount, content: respJ });
                    setModalState({ visible: false, content: null })
                })
                .catch(ex => console.log(ex))
        }
        setModalState({
            visible: true,
            title: name,
            content: (props) =>
                <ExpressVendorInfo
                    vendorid={id}
                    disabled={false}
                    onFinish={onFinish}
                    {...props}
                />
        })
    }, [fetchGet])
    const [modalState, setModalState] = useState({
        visible: false,
        content: null
    });
    const closeModal = () => {
        setModalState({ visible: false, content: null })
    }
    const updateList = (from) => {
        fetchGet(`http://192.168.0.182:54321/api/potential-vendors?from=${from}&name=${searchStateRef.current.name}&voen=${searchStateRef.current.voen}&sphere=${searchStateRef.current.sphere}`)
            .then(respJ => {
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                setPotentialVendors({ count: totalCount, content: respJ });
            })
    }
    useLayoutEffect(() => {
        fetchGet('http://192.168.0.182:54321/api/potential-vendors?from=0')
            .then(respJ => {
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                setPotentialVendors({ count: totalCount, content: respJ });
            })
            .catch(ex => console.log(ex))
    }, [fetchGet]);
    return (
        <div className="dashboard" style={{ paddingTop: '56px' }}>
            {
                modalState.visible &&
                <Modal title={modalState.title} changeModalState={closeModal}>
                    {modalState.content}
                </Modal>
            }
            <div>
                <Search
                    searchStateRef={searchStateRef}
                    updateList={updateList}
                />
                <ul className="potential-vendors">
                    <li>
                        <div style={{ textAlign: 'center' }}>#</div>
                        <div>Ad</div>
                        <div>VÖEN</div>
                        <div style={{ width: '100px' }}>Xidmət sahəsi</div>
                        <div></div>
                        <div></div>
                    </li>
                    <NewVendor
                        setPotentialVendors={setPotentialVendors}
                        setOperationResult={setOperationResult}
                    />
                    {
                        potentialVendors.content.map((potentialVendor, index) =>
                            <PotentialVendor
                                key={potentialVendor.id}
                                index={index}
                                setOperationResult={setOperationResult}
                                id={potentialVendor.id}
                                sphere={potentialVendor.sphere}
                                name={potentialVendor.name}
                                voen={potentialVendor.voen}
                                makeExpressVendor={makeExpressVendor}
                                can_be_express={potentialVendor.can_be_express}
                            />
                        )
                    }
                </ul>
                {
                    operationResult.visible &&
                    <OperationResult
                        setOperationResult={setOperationResult}
                        operationDesc={operationResult.desc}
                        backgroundColor={'white'}
                        iconColor={'rgb(15, 157, 88)'}
                        icon={operationResult.icon}
                    />
                }
            </div>
            <div className="my-orders-footer">
                <Pagination
                    count={potentialVendors.count}
                    activePageRef={activePageRef}
                    updateList={updateList}
                />
            </div>
        </div >
    )
}
export default PotentialVendors
const Search = (props) => {
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        props.searchStateRef.current[name] = value;
    }
    return (
        <div className="potential-vendors-serch">
            <div>
                <div>
                    <label htmlFor="name">Ad</label>
                    <br></br>
                    <input onChange={handleChange} name="name" id="name" />
                </div>
                <div>
                    <label htmlFor="name">VÖEN</label>
                    <br></br>
                    <input onChange={handleChange} name="voen" id="voen" />
                </div>
                <div>
                    <label htmlFor="name">Fəaliyyət sahəsi</label>
                    <br></br>
                    <select onChange={handleChange} name="sphere" id="sphere">
                        <option value=""> - </option>
                        {
                            workSectors.map(sector =>
                                <option key={sector.val} value={sector.val}>{sector.text}</option>
                            )
                        }
                    </select>
                </div>
                <div>
                    <div
                        style={{
                            color: 'white',
                            fontWeight: '550',
                            backgroundColor: 'rgb(255, 174, 0)',
                            padding: '8px 25px',
                            borderRadius: '3px',
                            cursor: "pointer"
                        }}
                        onClick={() => props.updateList(0)}
                    >
                        Axtar
                    </div>
                </div>
            </div>
        </div>
    )
}
const NewVendor = (props) => {
    const nameRef = useRef(null);
    const voenRef = useRef(null);
    const sphereRef = useRef(null);
    const fetchPost = useFetch("POST");
    const addNewPotentialVendor = () => {
        const data = {
            name: nameRef.current.value,
            voen: voenRef.current.value,
            sphere: sphereRef.current.value
        }
        fetchPost('http://192.168.0.182:54321/api/new-potential-vendor', data)
            .then(respJ => {
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                props.setPotentialVendors({ count: totalCount, content: respJ });
                nameRef.current.value = '';
                sphereRef.current.value = '';
                voenRef.current.value = '';
                props.setOperationResult({ visible: true, desc: 'Əməliyyat uğurla tamamlandı', icon: FaCheck })

            })
            .catch(ex => console.log(ex))
    }
    return (
        <>
            <li>
                <div>
                </div>
                <div>
                    <input ref={nameRef} />
                </div>
                <div>
                    <input ref={voenRef} />
                </div>
                <div>
                    <select ref={sphereRef}>
                        {
                            workSectors.map(sector =>
                                <option key={sector.val} value={sector.val}>{sector.text}</option>
                            )
                        }
                    </select>
                </div>
                <div >
                </div>
                <div style={{ textAlign: 'center' }}>
                    <FaPlus onClick={addNewPotentialVendor} />
                </div>
            </li>
        </>
    )
}
