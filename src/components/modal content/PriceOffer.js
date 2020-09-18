import React, { useRef, useState } from 'react'
import PriceOfferList from '../PriceOfferList'
import { token } from '../../data/data'
const PriceOffer = (props) => {
    const offerers = useRef([]);
    const [offerersCount, setOfferersCount] = useState(0)
    const addOfferer = () => {
        offerers.current.push({ key: Math.random() })
        setOfferersCount(prev => prev + 1);
    }
    const handleSendClick = () => {
        const priceOfferers = offerers.current.map(key =>
            [
                key.state.supplier,
                key.state.delType,
                key.state.delDur,
                key.state.sum,
                key.state.approxTranFee,
                key.state.impFee,
                key.state.vat,
                key.state.total
            ]
        )
        const offererPrices = offerers.current.flatMap(key => Object.values(key.state.values).map(material =>
            [
                key.state.supplier,
                material.materialid,
                material.price,
                material.amount,
                material.delType,
                material.delDur,
                material.approxTranFee,
                material.impFee,
                material.vat,
                material.total
            ]
        ));
        // console.log(offererPrices);
        const files = offerers.current.reduce((acc, current) =>
            acc = [...acc, ...current.state.files]
            , []);
        const fileMetaData = files.map(file => ({ supplier: file.supplier, name: file.name, ext: file.name.split('.').pop() }))
        console.log(fileMetaData);
        const formData = new FormData();
        formData.append('ordNumb', props.active[0].ord_numb);
        formData.append('empVersion', props.active[0].emp_version_id);
        for (let i = 0; i < files.length; i++)
            formData.append('photos', files[i]);
        formData.append('priceOfferers', JSON.stringify(priceOfferers));
        formData.append('offererPrices', JSON.stringify(offererPrices));
        formData.append('fileMetaData', JSON.stringify(fileMetaData));
        fetch('http://172.16.3.101:54321/api/price-offer', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                console.log(respJ)
                if (respJ[0].result === 'success')
                    props.containerRef.current.style.display = 'none'
            })
            .catch(ex => console.log(ex));
    }

    return (
        <>
            <PriceOfferList
                orderDetails={props.active}
                setOfferersCount={setOfferersCount}
                offerers={offerers}
                offerersCount={offerersCount}
            />
            <div className="add-new-price-offerer" onClick={addOfferer}>Əlavə et</div>
            <div onClick={handleSendClick} style={{ backgroundColor: 'rgb(255, 174, 0)' }} className="add-new-price-offerer">Göndər </div>
        </>
    )
}
export default PriceOffer