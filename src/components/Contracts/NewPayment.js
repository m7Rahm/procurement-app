import React, { useState, useEffect, useContext, useCallback } from 'react'
import ForwardDocLayout from '../Misc/ForwardDocLayout'
import { TokenContext } from '.././../App'
import { FaTimes } from 'react-icons/fa';
import ContractFiles from './ContractFiles'
const fetchAgreements = (token, controller) =>
    fetch('http://172.16.3.101:54321/api/agreements?result=1', {
        signal: controller.signal,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
const fetchExpressContracts = (token, controller) =>
    fetch('http://172.16.3.101:54321/api/express-contracts?result=1', {
        signal: controller.signal,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
const NewContract = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [files, setFiles] = useState([]);

    const addDocument = (document, type) => {
        setSelectedDocs(prev => prev.find(doc => doc.id === document.id && doc.type === type) ? prev : [...prev, {...document, type: type }])
    }
    const handleSendClick = (users, comment) => {
        const formData = new FormData();
        const relatedDocs = selectedDocs.map(doc => [doc.id, doc.type]);
        const receivers = users.map((user, index) => [user.id, index === 0 ? 1 : 0]);
        formData.append('relatedDocs', JSON.stringify(relatedDocs))
        formData.append('receivers', JSON.stringify(receivers))
        formData.append('comment', comment);
        formData.append("type", 3);
        for (let i = 0; i < files.length; i++)
            formData.append('files', files[i])
        fetch('http://172.16.3.101:54321/api/contract-agreement', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ.length === 0) {
                    props.closeModal();
                    props.updateCards({
                        result: -3,
                        from: 0,
                        next: 20,
                        update: true
                    })
                }
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
        const files = e.target.files;
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
    return (
        <div>
            <AgreementsList
                token={token}
                header="Razılaşmalar"
                type="1"
                fetchFun={fetchAgreements}
                addDocument={addDocument}
            />
            <div style={{ float: 'right', marginRight: '10px' }}>
                <AgreementsList
                    token={token}
                    type="2"
                    header="Müqavilələr"
                    fetchFun={fetchExpressContracts}
                    addDocument={addDocument}
                />
            </div>
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

const AgreementsList = React.memo((props) => {
    const [documents, setDocuments] = useState({ all: [], available: [], visible: [], offset: 2 });
    const fetchFun = props.fetchFun
    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();
        fetchFun(props.token, controller)
            .then(resp => resp.json())
            .then(respJ => {
                if (mounted)
                    setDocuments({ all: respJ, available: respJ, visible: respJ.slice(0, Math.round(200 / 36)), offset: 2 })
            })
            .catch(ex => console.log(ex))
        return () => {
            controller.abort();
            mounted = false
        }
    }, [props.token, fetchFun]);
    const handleVendorSearch = (e) => {
        const value = e.target.value;
        setDocuments(prev => {
            const available = prev.all.filter(document => document.number.toLowerCase().includes(value))
            return ({ ...prev, available: available, visible: available.slice(0, Math.round(200 / 36)), offset: 2 })
        })
    }
    const handleScroll = (e) => {
        const offsetTop = e.target.scrollTop;
        const next = Math.round(200 / 36);
        setDocuments(prev => {
            const offset = Math.round(offsetTop / 36);
            const start = offset > 2 ? offset - 2 : 0;
            const end = start + next + 2 <= prev.available.length ? start + next + 2 : prev.available.length;
            return ({ ...prev, visible: prev.available.slice(start, end), offset: offset > 2 ? offset : 2 })
        })
    }
    return (
        <div style={{ float: 'left' }}>
            <h1 style={{ textAlign: 'center', fontSize: '22px', marginLeft: '10px' }}>{props.header}</h1>
            <div style={{ width: '312px', padding: '5px 4px' }}>
                <input style={{ display: 'block', width: "100%", padding: '3px' }} type="text" onChange={handleVendorSearch} />
                <div style={{ height: '200px', position: 'relative', overflow: 'auto' }} onScroll={handleScroll}>
                    <ul style={{ height: 36 * documents.available.length, width: '100%' }} className="vendors-list">
                        {
                            documents.visible.map((agreement, index) =>
                                <li
                                    key={`${agreement.id}-${props.type}`}
                                    onClick={() => props.addDocument(agreement, props.type)}
                                    style={{ top: (documents.offset + index - 2) * 36 + 'px' }}
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
})

const Actives = React.memo(({ actives = [], removeSelected }) => {
    return (
        <div style={{ overflow: 'hidden', clear: 'left', maxWidth: '50%', margin: '10px', float: 'left' }}>
            {
                actives.map(active =>
                    <div className="forwarded-person-card" style={{ minWidth: '50px', lineHeight: '28px' }} key={`${active.id}-${active.type}`}>
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