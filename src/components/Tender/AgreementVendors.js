import React, { useState, useEffect } from 'react'
import ForwardDocLayout from '../Misc/ForwardDocLayout';
import AgreementVendorRow from './AgreementVendorRow'
import OfferPictures from '../modal content/OfferPictures'
import OperationResult from '../Misc/OperationResult'
import { AiFillCheckCircle } from 'react-icons/ai'
const AgreementVendors = (props) => {
    const [agreementVendors, setAgreementVendors] = useState([]);
    const [modalState, setModalState] = useState({ display: false, key: null });
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
            formData.append('files', files[i], sentName)
        }
        fetch('http://172.16.3.101:54321/api/new-agreement', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + props.token
            },
            body: formData
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].operation_result === 'success') {
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
    return (
        <>
            <div style={{ float: 'left' }}>
                <VendorsList
                    addVendor={addVendor}
                    token={props.token}
                />
            </div>
            <div style={{ clear: 'both' }}>
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
                                token={props.token}
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

export const VendorsList = (props) => {
    const [vendors, setVendors] = useState({ all: [], available: [], visible: [], offset: 2 });
    useEffect(() => {
        const controller = new AbortController();
        fetch('http://172.16.3.101:54321/api/get-vendors', {
            signal: controller.signal,
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setVendors({ all: respJ, available: respJ, visible: respJ.slice(0, Math.round(200 / 36)), offset: 2 }))
            .catch(ex => console.log(ex))
        return () => controller.abort();
    }, [props.token]);
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
    return (
        <>
            <h1 style={{ textAlign: 'center', fontSize: '22px' }}>Vendorlar</h1>
            <div>
                <input style={{ display: 'block', width: "100%", padding: '3px' }} type="text" onChange={handleVendorSearch} />
                <div style={{ height: '200px', position: 'relative', overflow: 'auto' }} onScroll={handleScroll}>
                    <ul style={{ height: 36 * vendors.available.length }} className="vendors-list">
                        {
                            vendors.visible.map((vendor, index) =>
                                <li
                                    key={vendor.id}
                                    onClick={() => props.addVendor(vendor)}
                                    style={{ top: (vendors.offset + index - 2) * 36 + 'px' }}
                                >
                                    {vendor.name}
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
        </>
    )
}