import React, { useState, useEffect, useContext, useCallback } from 'react'
import ForwardDocLayout from '../Misc/ForwardDocLayout'
import { TokenContext } from '.././../App'
import { FaTimes } from 'react-icons/fa';
import ContractFiles from './ContractFiles'
import { VendorsList } from '../../components/Tender/AgreementVendors.js'
import { WebSocketContext } from "../../pages/SelectModule"
import useFetch from '../../hooks/useFetch';
const NewContract = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [files, setFiles] = useState([]);
    const [vendor, setVendor] = useState(null);
    const webSocket = useContext(WebSocketContext);
    const fetchGet = useFetch("GET");
    const addAgreement = useCallback((agreement) => {
        setSelectedDocs(prev => {
            if (!prev.some(elem => elem.id === agreement.id))
                return [...prev, agreement]
            else return prev
        })
    }, []);
    const handleSendClick = (users, comment) => {
        const formData = new FormData();
        const relatedDocs = selectedDocs.map(doc => [doc.id, 1]);
        const receivers = users.map((user, index) => [user.id, index === 0 ? 1 : 0]);
        formData.append('relatedDocs', JSON.stringify(relatedDocs))
        formData.append('receivers', JSON.stringify(receivers))
        formData.append('comment', comment);
        formData.append("type", 2);
        formData.append('vendorid', vendor.id)
        for (let i = 0; i < files.length; i++)
            formData.append('files', files[i])
        fetch('http://192.168.0.182:54321/api/contract-agreement', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ.length !== 0) {
                    const message = {
                        message: "notification",
                        receivers: respJ.map(receiver => ({ id: receiver.receiver_id, notif: "nC" })),
                        data: undefined
                    }
                    webSocket.send(JSON.stringify(message))
                }
                props.closeModal();
                props.setInitData({
                    result: 0,
                    from: 0,
                    next: 20
                })
            })
            .catch(ex => console.log(ex))
    }
    const removeSelected = useCallback((selected) => {
        setSelectedDocs(prev => prev.filter(doc => doc.id !== selected.id))
    }, []);
    const removeFile = useCallback((files) => {
        setFiles(prev => prev.filter(doc => doc.name !== files.name))
    }, [])
    const handleChange = useCallback((e) => {
        const files = { ...e.target.files };
        files.length = e.target.files.length
        e.target.value = null
        setFiles(prev => {
            const newFiles = [];
            let unique = true;
            if (prev.length !== 0) {
                for (let j = 0; j < files.length; j++) {
                    for (let i = 0; i < prev.length; i++) {
                        if (files[j].name === prev[i].name) {
                            unique = false;
                            break;
                        }
                    }
                    if (unique) {
                        const ext = files[j].name.split('.').pop();
                        files[j].ext = ext;
                        newFiles.push(files[j]);
                    }
                    unique = true;
                }
                return [...prev, ...newFiles]
            }
            else {
                for (let i = 0; i < files.length; i++) {
                    const ext = files[i].name.split('.').pop();
                    files[i].ext = ext;
                    newFiles.push(files[i]);
                }
                return newFiles
            }
        })
    }, []);
    const addVendor = (vendor, _, vendorsListRef) => {
        setVendor(vendor)
        vendorsListRef.current.style.display = "none"
    }
    return (
        <div>
            <AgreementsList
                fetchGet={fetchGet}
                addAgreement={addAgreement}
            />
            <div style={{ float: 'right', marginRight: '10px' }}>
                <VendorsList
                    token={token}
                    addVendor={addVendor}
                />
            </div>
            {
                vendor !== null &&
                <div style={{ overflow: 'hidden', maxWidth: '50%', margin: '10px', float: 'right', clear: 'right', lineHeight: '28px' }}>
                    <div className="forwarded-person-card">
                        <span style={{ verticalAlign: 'baseline', margin: '0px 10px' }}>
                            {vendor.name}
                        </span>
                    </div>
                </div>
            }
            <Actives
                actives={selectedDocs}
                removeSelected={removeSelected}
            />

            <div style={{ clear: 'both' }}>
                <ContractFiles
                    files={files}
                    addFiles={handleChange}
                    removeFile={removeFile}
                />
            </div>

            <ForwardDocLayout
                handleSendClick={handleSendClick}
                token={token}
            />
        </div>
    )
}
export default NewContract

const AgreementsList = (props) => {
    const [agreements, setAgreements] = useState({ all: [], available: [], visible: [], offset: 2 });
    const fetchGet = useFetch("GET");
    useEffect(() => {
        const controller = new AbortController();
        fetchGet('http://192.168.0.182:54321/api/agreements?result=1', controller)
            .then(respJ => setAgreements({ all: respJ, available: respJ, visible: respJ.slice(0, Math.round(200 / 36)), offset: 2 }))
            .catch(ex => console.log(ex))
        return () => controller.abort();
    }, [fetchGet]);
    const handleVendorSearch = (e) => {
        const value = e.target.value;
        setAgreements(prev => {
            const available = prev.all.filter(agreement => agreement.number.toLowerCase().includes(value))
            return ({ ...prev, available: available, visible: available.slice(0, Math.round(200 / 36)), offset: 2 })
        })
    }
    const handleScroll = (e) => {
        const offsetTop = e.target.scrollTop;
        const next = Math.round(200 / 36);
        setAgreements(prev => {
            const offset = Math.round(offsetTop / 36);
            const start = offset > 2 ? offset - 2 : 0;
            const end = start + next + 2 <= prev.available.length ? start + next + 2 : prev.available.length;
            return ({ ...prev, visible: prev.available.slice(start, end), offset: offset > 2 ? offset : 2 })
        })
    }
    return (
        <div style={{ float: 'left' }}>
            <h1 style={{ textAlign: 'center', fontSize: '22px', marginLeft: '10px' }}>Razılaşmalar</h1>
            <div style={{ width: '312px', padding: '5px 4px' }}>
                <input style={{ display: 'block', width: "100%", padding: '3px' }} type="text" onChange={handleVendorSearch} />
                <div style={{ height: '200px', position: 'relative', overflow: 'auto' }} onScroll={handleScroll}>
                    <ul style={{ height: 36 * agreements.available.length, width: '100%' }} className="vendors-list">
                        {
                            agreements.visible.map((agreement, index) =>
                                <li
                                    key={agreement.id}
                                    onClick={() => props.addAgreement(agreement)}
                                    style={{ top: (agreements.offset + index - 2) * 36 + 'px' }}
                                >
                                    {agreement.number}
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

const Actives = React.memo(({ actives = [], removeSelected }) => {
    return (
        <div style={{ overflow: 'hidden', clear: 'left', maxWidth: '50%', margin: '10px', float: 'left' }}>
            {
                actives.map(active =>
                    <div className="forwarded-person-card" style={{ minWidth: '50px', lineHeight: '28px' }} key={active.id}>
                        <span style={{ verticalAlign: 'baseline', marginLeft: '10px' }}>
                            {active.number}
                        </span>
                        <span style={{ float: 'right', verticalAlign: 'baseline', marginRight: '4px' }}>
                            <FaTimes onClick={() => removeSelected(active)} />
                        </span>
                    </div>
                )
            }
        </div>
    )
});