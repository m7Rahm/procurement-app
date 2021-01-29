import React, { useState, useEffect, useCallback } from 'react'
import { FaFilePdf, FaFileExcel, FaFileWord } from 'react-icons/fa';
import { AiFillFileUnknown } from 'react-icons/ai'
import Chat from '../../Misc/Chat'
import EmptyContent from '../../Misc/EmptyContent'
import { MdDetails } from 'react-icons/md'
import RightInfoBar from '../../Misc/RightInfoBar';
import AgreementGeneralInfo from './AgreementGeneralInfo'
const ContractContent = (props) => {
    const active = props.current.active;
    const [contractDetails, setContractDetails] = useState([]);
    const [rightPanel, setRightPanel] = useState({ visible: false, id: null })
    useEffect(() => {
        if (props.apiString)
            fetch(props.apiString, {
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            })
                .then(resp => resp.json())
                .then(respJ => setContractDetails(respJ))
    }, [props.apiString, active, props.token]);
    const sendMessage = useCallback((data) => {
        const apiData = JSON.stringify({ ...data, docType: 2 });
        return fetch(`http://172.16.3.101:54321/api/send-message`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + props.token,
                'Content-Type': 'application/json',
                'Content-Length': apiData.length
            },
            body: apiData
        })
    }
        , [props.token]);
    const fetchMessages = useCallback(() =>
        fetch(`http://172.16.3.101:54321/api/messages/${active}?from=0&replyto=0&doctype=2`, {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
        , [active, props.token]);
    const cancel = () => {

    }
    const decline = () => {

    }
    const accept = () => {

    }

    return (
        <div className="visa-content-container" style={{ maxWidth: '1256px', margin: 'auto', padding: '20px', paddingTop: '76px' }}>
            {
                contractDetails.length !== 0
                    ? <>
                        <div>
                            <h1 style={{ fontSize: '24px', color: 'gray' }}>
                                {contractDetails[0].number}
                                <span style={{ float: 'right', cursor: 'pointer', color: "rgb(255, 174, 0)" }}>
                                    <MdDetails size="30" />
                                </span>
                            </h1>

                        </div>
                        <ContractFiles
                            token={props.token}
                            id={active}
                        />
                        <h1 style={{ fontSize: '24px', float: 'right' }}>
                            {contractDetails[0].vendor_name}
                        </h1>
                        <RelatedDocs
                            docs={contractDetails}
                            setRightPanel={setRightPanel}
                        />
                        <p>{contractDetails[0].comment}</p>
                        <div style={{ margin: '6px 0px' }}>
                            {
                                props.referer === 'procurement' && active ?
                                    <div
                                        style={{ background: '#D93404', color: 'white', padding: '6px', cursor: 'pointer', borderRadius: '3px' }}
                                        onClick={cancel}
                                    >
                                        Razılaşmanı ləğv et
                                    </div>
                                    : active &&
                                    <div className="accept-decline-container">
                                        <div
                                            style={{ background: '#D93404' }}
                                            onClick={decline}
                                        >
                                            Etiraz et
                                        </div>
                                        <div
                                            style={{ background: 'rgb(15, 157, 88)' }}
                                            onClick={accept}
                                        >
                                            Təsdiq et
                                        </div>
                                    </div>
                            }
                        </div>
                        <Chat
                            loadMessages={fetchMessages}
                            documentid={active}
                            sendMessage={sendMessage}
                        />
                        {
                            rightPanel.visible &&
                            <RightInfoBar
                                setRightBarState={setRightPanel}
                            >
                                <AgreementGeneralInfo
                                    id={rightPanel.id}
                                    token={props.token}
                                />
                            </RightInfoBar>
                        }
                    </>
                    :
                    <EmptyContent />

            }

        </div>
    )
}

export default React.memo(ContractContent)

export const ContractFiles = React.memo((props) => {
    const [files, setFiles] = useState([]);
    useEffect(() => {
        fetch(`http://172.16.3.101:54321/api/contract-files/${props.id}`, {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setFiles(respJ))
            .catch(ex => console.log(ex))
    }, [props.token, props.id])
    return (
        <div className="uploaded-files">
            {
                files.map(file => {
                    const ext = file.ext;
                    const src = `http://172.16.3.101:54321/original/${file.name}`
                    switch (true) {
                        case /pdf/.test(ext):
                            return (
                                <div key={file.name}>
                                    <a href={src} rel="noopener noreferrer" target="_blank">
                                        <FaFilePdf title={file.name} color="#F40F02" size="36" />
                                    </a>
                                </div>
                            )
                        case /doc./.test(ext):
                            return (
                                <div key={file.name}>
                                    <a href={src} rel="noopener noreferrer" target="_blank" download>
                                        <FaFileWord title={file.name} color="#0078d7" size="36" />
                                    </a>
                                </div>
                            )
                        case /xls./.test(ext):
                            return (
                                <div key={file.name}>
                                    <a href={src} rel="noopener noreferrer" target="_blank">
                                        <FaFileExcel title={file.name} color="#1D6F42" size="36" />
                                    </a>
                                </div>
                            )
                        default:
                            return (
                                <div key={file.name}>
                                    <a href={src} rel="noopener noreferrer" target="_blank" download>
                                        <AiFillFileUnknown title={file.name} size="36" />
                                    </a>
                                </div>
                            )
                    }
                }
                )
            }
        </div>
    )
});
const RelatedDocs = (props) => {
    const handleInfoClick = (doc) => {
        props.setRightPanel(prev => prev.id !== doc.related_doc_id || !prev.visible ? { visible: true, id: doc.related_doc_id } : prev)
    }
    return (
        <>
            <h1 style={{ float: 'left', fontSize: '20px', color: 'gray' }}>Əlaqəli sənədlər</h1>
            <div style={{ overflow: 'hidden', clear: 'left' }}>
                {
                    props.docs.map((doc, index) =>
                        <div
                            className="forwarded-person-card"
                            onClick={() => handleInfoClick(doc)}
                            style={{ minWidth: '50px', lineHeight: '28px', padding: '0px 6px', float: 'left', cursor: 'pointer' }}
                            key={index}
                        >
                            {doc.related_doc_number}
                        </div>
                    )
                }

            </div>
        </>
    )
}