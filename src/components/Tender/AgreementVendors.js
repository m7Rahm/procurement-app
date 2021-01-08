import React, { useState, useEffect } from 'react'
import ForwardDocLayout from '../Misc/ForwardDocLayout';
import AgreementVendorRow from './AgreementVendorRow'
import OfferPictures from '../modal content/OfferPictures'
import OperationResult from '../Misc/OperationResult'
import { AiFillCheckCircle } from 'react-icons/ai'
const AgreementVendors = (props) => {
    const [agreementVendors, setAgreementVendors] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [modalState, setModalState] = useState({ display: false, key: null });
    const [operationResult, setOperationResult] = useState({
        visible: false,
        desc: '',
        iconColor: 'rgb(15, 157, 88)',
        icon: AiFillCheckCircle
    })
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/get-vendors', {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setVendors(respJ))
            .catch(ex => console.log(ex))
    }, [props.token])
    const handleSendClick = (receivers, comment) => {
        const recs = JSON.stringify(receivers.map(receiver => [receiver.id]));
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
                    setOperationResult(prev => ({ ...prev, visible: true, desc: 'Əməliyyat uğurla tamamlandı' }))
                }
                else
                    setOperationResult({ visible: true, desc: 'Xəta baş verdi' })
            })
    }
    const addVendor = (vendor) => {
        setAgreementVendors(prev => [...prev, { ...vendor, key: Date.now(), className: 'new-row', files: [], comment: '' }])
    }
    return (
        <div style={{ marginTop: '50px' }}>
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
            <h1 style={{ textAlign: 'center', fontSize: '22px' }}>Vendorlar</h1>
            <div>
                <ul className="vendors-list">
                    {
                        vendors.map((vendor) =>
                            <li key={vendor.id} onClick={() => addVendor(vendor)}>{vendor.name}</li>
                        )
                    }
                </ul>
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
        </div>
    )
}
export default AgreementVendors