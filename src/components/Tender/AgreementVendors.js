import React, { useState, useEffect, useRef, useCallback, useContext } from 'react'
import ForwardDocLayout from '../Misc/ForwardDocLayout';
import AgreementVendorRow from './AgreementVendorRow'
import OfferPictures from '../modal content/OfferPictures'
import OperationResult from '../Misc/OperationResult'
import { AiFillCheckCircle } from 'react-icons/ai'
import ContractFiles from '../Contracts/ContractFiles'
import { WebSocketContext } from '../../pages/SelectModule';
import useFetch from '../../hooks/useFetch';
import { TokenContext } from '../../App';

const AgreementVendors = (props) => {
    const [agreementVendors, setAgreementVendors] = useState([]);
    const [modalState, setModalState] = useState({ display: false, key: null });
    const [commonFiles, setCommonFiles] = useState([]);
    const webSocket = useContext(WebSocketContext);
    const token = useContext(TokenContext)[0].token
    const [operationResult, setOperationResult] = useState({
        visible: false,
        desc: '',
        iconColor: 'rgb(15, 157, 88)',
        icon: AiFillCheckCircle
    })
    const handleSendClick = (receivers, comment) => {
        const recs = JSON.stringify(receivers.map((receiver, index) => [receiver.id, index === 0 ? 1 : 0]));
        const vendors = JSON.stringify(agreementVendors.map(vendor => [vendor.id, vendor.comment]));
        const files = agreementVendors.flatMap(vendor => vendor.files);
        const formData = new FormData();
        formData.append('receivers', recs);
        formData.append('vendors', vendors);
        formData.append('comment', comment)
        for (let i = 0; i < files.length; i++) {
            const fileName = files[i].name.split('.');
            const ext = fileName.pop();
            const name = fileName.join('.');
            const sentName = `${name}:${files[i].supplier}.${ext}`;
            formData.append("files", files[i], sentName)
        }
        for (let i = 0; i < commonFiles.length; i++) {
            const fileName = commonFiles[i].name.split('.');
            fileName.length--;
            const name = fileName.join('.');
            const sentName = `${name}:0.${commonFiles[i].ext}`;
            formData.append("files", commonFiles[i], sentName);
        }
        fetch('http://192.168.0.182:54321/api/new-agreement', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ.length) {
                    const message = {
                        message: "notification",
                        receivers: respJ.map(receiver => ({ id: receiver.receiver_id, notif: "nA" })),
                        data: undefined
                    }
                    webSocket.send(JSON.stringify(message))
                    setOperationResult(prev => ({ ...prev, visible: true, desc: 'Əməliyyat uğurla tamamlandı' }));
                    props.setIsEmpty(true);
                }
                else
                    setOperationResult({ visible: true, desc: 'Xəta baş verdi' })
            })
            .catch(ex => console.log(ex))
    }
    const addVendor = (vendor) => {
        setAgreementVendors(prev => [...prev, { ...vendor, key: Date.now(), className: 'new-row', files: [], comment: '' }])
    }
    const addCommonFiles = useCallback((e) => {
        const files = { ...e.target.files };
        files.length = e.target.files.length
        e.target.value = null
        setCommonFiles(prev => {
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
    const removeFile = useCallback((file) => {
        setCommonFiles(prev => prev.filter(doc => doc.name !== file.name))
    }, [])
    return (
        <>
            <div style={{ float: 'left' }}>
                <VendorsList
                    addVendor={addVendor}
                />
            </div>
            <div style={{ clear: 'both', position: "relative", top: "10px" }}>
                <ContractFiles
                    files={commonFiles}
                    addFiles={addCommonFiles}
                    removeFile={removeFile}
                />
            </div>

            <div style={{ position: "relative", top: "10px" }}>
                {
                    modalState.display &&
                    <OfferPictures
                        setModalState={setModalState}
                        id={modalState.key}
                        vendors={agreementVendors}
                        setAgreementVendors={setAgreementVendors}
                    />
                }
                {
                    agreementVendors.length !== 0 ?
                        <>
                            <ul className="new-order-table order-table-protex">
                                <li>
                                    <div>#</div>
                                    <div>Ad</div>
                                    <div>VÖEN</div>
                                    <div>Xid. sahəsi</div>
                                    <div>Qeyd</div>
                                    <div></div>
                                    <div></div>
                                </li>
                                {
                                    agreementVendors.map((vendor, index) =>
                                        <AgreementVendorRow
                                            index={index}
                                            key={vendor.key}
                                            vendor={vendor}
                                            setModalState={setModalState}
                                            setAgreementVendors={setAgreementVendors}
                                        />
                                    )
                                }
                            </ul>
                            <ForwardDocLayout
                                handleSendClick={handleSendClick}
                            />
                        </>
                        :
                        <h1 style={{ textAlign: 'center' }}>Vendor Siyahısı boşdur..</h1>
                }
            </div>
            {
                operationResult.visible &&
                <OperationResult
                    setOperationResult={setOperationResult}
                    operationDesc={operationResult.desc}
                    backgroundColor={operationResult.backgroundColor}
                    iconColor={operationResult.iconColor}
                    icon={operationResult.icon}
                />
            }
        </>
    )
}
export default AgreementVendors

export const VendorsList = React.memo((props) => {
    const [vendors, setVendors] = useState({ all: [], available: [], visible: [], offset: 2 });
    const { headerVisible = true, uid = "0" } = props
    const vendorsListRef = useRef(null);
    const inputRef = useRef(null);
    const fetchGet = useFetch("GET");
    useEffect(() => {
        const controller = new AbortController();
        fetchGet('http://192.168.0.182:54321/api/get-vendors', controller)
            .then(respJ => setVendors({ all: respJ, available: respJ, visible: respJ.slice(0, Math.round(200 / 36)), offset: 2 }))
            .catch(ex => console.log(ex))
        return () => controller.abort();
    }, [fetchGet]);
    const handleVendorSearch = (e) => {
        const value = e.target.value;
        setVendors(prev => {
            const available = prev.all.filter(vendor => vendor.name.toLowerCase().includes(value))
            return ({ ...prev, available: available, visible: available.slice(0, Math.round(200 / 36)), offset: 2 })
        })
    }
    const handleScroll = (e) => {
        const offsetTop = e.target.scrollTop;
        const next = Math.round(200 / 36);
        setVendors(prev => {
            const offset = Math.round(offsetTop / 36);
            const start = offset > 2 ? offset - 2 : 0;
            const end = start + next + 2 <= prev.available.length ? start + next + 2 : prev.available.length;
            return ({ ...prev, visible: prev.available.slice(start, end), offset: offset > 2 ? offset : 2 })
        })
    }
    const handleInputFocus = () => {
        vendorsListRef.current.style.display = "block"
    }
    const handleFocusLose = (e) => {
        const relatedTarget = e.relatedTarget;
        if (relatedTarget === null || relatedTarget.id !== "windowed-vendors-list" + uid)
            vendorsListRef.current.style.display = "none"
    }
    const handleVendorClick = (vendor, inputRef, vendorsListRef) => {
        props.addVendor(vendor, inputRef, vendorsListRef);
        // vendorsListRef.current.style.display = "none"
    }
    const handleItemBlur = (e) => {
        const relatedTarget = e.relatedTarget;
        if (relatedTarget === null || relatedTarget.id !== "windowed-vendors-input" + uid)
            vendorsListRef.current.style.display = "none"
    }
    return (
        <>
            {headerVisible && <h1 style={{ textAlign: 'center', fontSize: '22px' }}>Vendorlar</h1>}
            <div style={{ position: 'relative' }}>
                <input
                    ref={inputRef}
                    style={{ display: 'block', width: "100%", padding: '3px' }}
                    type="text" onChange={handleVendorSearch}
                    onFocus={handleInputFocus}
                    onBlur={handleFocusLose}
                    id={"windowed-vendors-input" + uid}
                />
                <div tabIndex="1" ref={vendorsListRef}
                    onBlur={handleItemBlur}
                    id={"windowed-vendors-list" + uid}
                    style={{ position: 'absolute', zIndex: 2, display: 'none', top: "30px", left: 0, right: 0 }}
                >
                    <div style={{ maxHeight: '200px', position: 'relative', overflow: 'auto', backdropFilter: "blur(3px)", backgroundColor: 'slategray' }} onScroll={handleScroll}>
                        <ul style={{ height: 36 * vendors.available.length, width: "100%" }} className="vendors-list">
                            {
                                vendors.visible.map((vendor, index) =>
                                    <li
                                        key={vendor.id}
                                        onClick={() => handleVendorClick(vendor, inputRef, vendorsListRef)}
                                        style={{ top: (vendors.offset + index - 2) * 36 + 'px', overflow: "hidden" }}
                                    >
                                        {vendor.name}
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
})