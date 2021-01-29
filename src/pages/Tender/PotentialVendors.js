import React, { useContext, useState, useRef, useLayoutEffect } from 'react'
import { TokenContext } from '../../App'
import Pagination from '../../components/Misc/Pagination';
import { workSectors } from '../../data/data'
import { FaEdit, FaEdge, FaPlus, FaCheck, FaTimes } from 'react-icons/fa'
import OperationResult from '../../components/Misc/OperationResult'
const PotentialVendors = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [potentialVendors, setPotentialVendors] = useState({ count: 0, content: [] });
    const activePageRef = useRef(0);
    const [operationResult, setOperationResult] = useState({ visible: false, desc: '', icon: null })
    const searchStateRef = useRef({
        name: '',
        voen: '',
        sphere: ''
    });
    const updateList = (from) => {
        fetch(`http://172.16.3.101:54321/api/potential-vendors?from=${from}&name=${searchStateRef.current.name}&voen=${searchStateRef.current.voen}&sphere=${searchStateRef.current.sphere}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                setPotentialVendors({ count: totalCount, content: respJ });
            })
    }
    useLayoutEffect(() => {
        fetch('http://172.16.3.101:54321/api/potential-vendors?from=0', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                setPotentialVendors({ count: totalCount, content: respJ });
            })
            .catch(ex => console.log(ex))
    }, [token]);
    return (
        <div className="dashboard" style={{ paddingTop: '56px' }}>
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
                        token={token}
                        setPotentialVendors={setPotentialVendors}
                        setOperationResult={setOperationResult}
                    />
                    {
                        potentialVendors.content.map((potentialVendor, index) =>
                            <PotentialVendor
                                key={potentialVendor.id}
                                index={index}
                                token={token}
                                setOperationResult={setOperationResult}
                                vendor={potentialVendor}
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
                            borderRadius: '3px'
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
    const addNewPotentialVendor = () => {
        const data = JSON.stringify({
            name: nameRef.current.value,
            voen: voenRef.current.value,
            sphere: sphereRef.current.value
        })
        fetch('http://172.16.3.101:54321/api/new-potential-vendor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Authorization': 'Bearer ' + props.token
            },
            body: data
        })
            .then(resp => resp.json())
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
const PotentialVendor = React.memo((props) => {
    const [disabled, setDisabled] = useState(true);
    const nameRef = useRef(null);
    const voenRef = useRef(null);
    const sphereRef = useRef(null);
    const handleEditStart = () => {
        setDisabled(prev => !prev)
    }
    const revertChanges = () => {
        nameRef.current.value = props.vendor.name;
        voenRef.current.value = props.vendor.voen;
        sphereRef.current.value = props.vendor.sphere;
        setDisabled(prev => !prev)
    }
    const updateVendor = () => {
        const data = JSON.stringify({
            id: props.vendor.id,
            name: nameRef.current.value,
            voen: voenRef.current.value,
            sphere: sphereRef.current.value
        });
        fetch('http://172.16.3.101:54321/api/update-potential-vendor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Authorization': 'Bearer ' + props.token
            },
            body: data
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].operation_result === 'success') {
                    props.setOperationResult({ visible: true, desc: 'Əməliyyat uğurla tamamlandı', icon: FaCheck })
                    setDisabled(true)
                }
            })
            .catch(ex => console.log(ex))
    }
    return (
        <li>
            <div style={{ textAlign: 'center' }}>
                {props.index + 1}
            </div>
            <div>
                <input disabled={disabled} ref={nameRef} defaultValue={props.vendor.name} />
            </div>
            <div>
                <input disabled={disabled} ref={voenRef} defaultValue={props.vendor.voen} />
            </div>
            <div>
                <select disabled={disabled} ref={sphereRef} defaultValue={props.vendor.sphere}>
                    {
                        workSectors.map(sector =>
                            <option key={sector.val} value={sector.val}>{sector.text}</option>
                        )
                    }
                </select>
            </div>
            <div style={{ textAlign: 'center' }}>
                {
                    props.vendor.can_be_express &&
                    <FaEdge />
                }
            </div>
            <div style={{ textAlign: 'center' }}>
                {
                    disabled ?
                        <FaEdit onClick={handleEditStart} />
                        : <>
                            <FaCheck onClick={updateVendor} />
                            <FaTimes onClick={revertChanges} />
                        </>
                }
            </div>
        </li>
    )
})