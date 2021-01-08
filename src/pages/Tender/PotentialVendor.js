import React, { useState, useEffect } from 'react'
import {
    IoIosAdd
} from 'react-icons/io'
import PontentialVendorRow from '../../components/PriceOffers/PotentialVendorRow'
import ForwardDocLayout from '../../components/Misc/ForwardDocLayout'
import OfferPictures from '../../components/modal content/OfferPictures'
const vendorDataInit = {
    key: Date.now(),
    className: '',
    name: '',
    voen: '',
    sphere: '0',
    ordNumb: '',
    comment: '',
    files: [],
    orders: []
}
const PotentialVendor = (props) => {
    const { token, ordNumb } = props;
    const [pendingOrders, setPendingOrders] = useState([]);
    const [potentialVendors, setPotentialVendors] = useState([vendorDataInit]);
    const [modalState, setModalState] = useState({ display: false, vendorIndex: null });
    const [update, setUpdate] = useState(false);
    const addNewVendor = () => {
        const newVendor = { ...vendorDataInit, className: 'new-row', key: Date.now() }
        setPotentialVendors(prev => [...prev, newVendor])
    }
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/get-orders-for-potven', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(resp => resp.json())
        .then(respJ => setPendingOrders(respJ))
        .catch(ex => console.log(ex))
    }, [update, token])
    const handleSendClick = (receivers, comment) => {
        const files = potentialVendors.flatMap(vendor => vendor.files);
        const recs = receivers.map(receiver => [receiver.id]);
        const toFin = receivers.length === 0 ? 1 : 0;
        const potVends = JSON.stringify(potentialVendors.map(potentialVendor =>
            [potentialVendor.key, potentialVendor.name, potentialVendor.voen, potentialVendor.sphere, potentialVendor.comment]
        ));
        const filesMetaData = files.map(file => [file.name, file.name.split('.').pop(), file.supplier]);
        const vendorsPerOffer = potentialVendors.flatMap(vendor => vendor.orders.map(ord => [vendor.key, ord.ord_numb]));
        const formData = new FormData();
        formData.append('ordNumb', ordNumb);
        formData.append('vendorsPerOffer', JSON.stringify(vendorsPerOffer))
        formData.append('recs', JSON.stringify(recs));
        formData.append('comment', comment);
        formData.append('toFin', toFin);
        formData.append('potVends', potVends);
        formData.append('filesMetaData', JSON.stringify(filesMetaData));
        for (let i = 0; i < files.length; i++)
            formData.append('files', files[i]);
        fetch('http://172.16.3.101:54321/api/create-price-offer', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].operation_result === 'success') {
                    setUpdate(prev => !prev)
                    setPotentialVendors([{ ...vendorDataInit, key: Date.now() }])
                }
            })
            .catch(ex => console.log(ex))
    }
    return (
        <div style={{ paddingTop: '50px', clear: 'both', width: 'auto' }} className="wrapper">
            {
                modalState.display &&
                    <OfferPictures
                        setModalState={setModalState}
                        vendor={potentialVendors[modalState.vendorIndex]}
                        setPotentialVendors={setPotentialVendors}
                    />
            }
            <ul className="modified">
                <li>
                    <div>#</div>
                    <div>Name</div>
                    <div>VOEN</div>
                    <div>Sphere</div>
                    <div>Comment</div>
                    <div>Sifariş №</div>
                    <div>Attachment</div>
                    <div></div>
                </li>
                {
                    potentialVendors.map((vendor, index) =>
                        <PontentialVendorRow
                            vendor={vendor}
                            pendingOrders={pendingOrders}
                            key={vendor.key}
                            token={token}
                            index={index + 1}
                            setModalState={setModalState}
                            setPotentialVendors={setPotentialVendors}
                        />
                    )
                }
                <li style={{ height: '25px', backgroundColor: 'transparent' }}>
                    <div style={{ padding: '0px' }}></div>
                    <div style={{ padding: '0px' }}></div>
                    <div style={{ padding: '0px' }}></div>
                    <div style={{ padding: '0px' }}></div>
                    <div style={{ padding: '0px' }}></div>
                    <div style={{ padding: '0px' }}></div>
                    <div style={{ padding: '0px' }}>
                        <IoIosAdd title="Əlavə et" cursor="pointer" onClick={addNewVendor} size="25" style={{ margin: 'auto' }} />
                    </div>
                </li>
            </ul>
            <ForwardDocLayout
                handleSendClick={handleSendClick}
                token={token}
            />
        </div>
    )
}
export default PotentialVendor