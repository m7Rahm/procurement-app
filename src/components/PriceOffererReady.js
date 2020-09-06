import React, { useState, useRef, useLayoutEffect } from 'react'
import {
    AiOutlinePicture
} from 'react-icons/ai'
import {
    RiListSettingsLine
} from 'react-icons/ri'
import { incoTerms } from '../data/data'
import PriceOffererDetailedProtex from './modal content/PriceOffererDetailedProtex'
const styleSuitable = (suitable, result) => (
    {
        backgroundColor: result ? 'rgba(30, 143, 255, 0.514)' : suitable ? 'rgb(253, 95, 95)' : '',
        color: suitable ? 'white' : ''
    }
)
const PriceRow = (props) => {
    const ref = useRef(null)
    const handlePriceSelect = () => {
        if(props.selectedSupplierRef.current.ref){
            props.selectedSupplierRef.current.ref.style.backgroundColor = 'transparent';
            props.selectedSupplierRef.current = {}
        }
        if(props.indivPricesRef.current[props.id]){
            const suitable = props.indivPricesRef.current[props.id].suitable;
            const prevStyle = styleSuitable(suitable)
            props.indivPricesRef.current[props.id].ref.style.backgroundColor = prevStyle.backgroundColor;
            props.indivPricesRef.current[props.id].ref.style.color = prevStyle.color;
        }
        props.indivPricesRef.current = { ...props.indivPricesRef.current, [props.id]: {
            val: props.priceid,
            ref: ref.current,
            suitable: props.suitable
        } };
        ref.current.style.backgroundColor = 'rgba(30, 143, 255, 0.514)';
    }
    return (
        <div
            onClick={!props.processed ? handlePriceSelect: () => {}}
            ref={ref}
            style={{ display: 'flex', cursor: 'pointer' , ...styleSuitable(props.suitable, props.result) }}>
            <div style={{ flex: 1, borderRight: '1px solid gray'}}>
                {props.price}
            </div>
            <div style={{ flex: 1, borderRight: '1px solid gray' }}>
                {props.amount}
            </div>
            <div style={{ flex: 1 }}>
                {props.total}
            </div>
        </div>
    )
}

const PriceOffererReady = (props) => {
    // console.log(props);
    const [advancedViewDisp, setAdvancedViewDisp] = useState(false)
    const supplierRef = useRef(null)
    const [prices, setPrices] = useState([])
    // console.log(prices)
    const handleSupplierSelect = () => {
        if(props.selectedSupplierRef.current.ref){
            props.selectedSupplierRef.current.ref.style.backgroundColor = 'transparent'
            props.selectedSupplierRef.current = {}
        }
        Object.values(props.indivPricesRef.current).forEach(offererPrice => {
            const prevStyle = styleSuitable(offererPrice.suitable)
            offererPrice.ref.style.backgroundColor = prevStyle.backgroundColor;
            offererPrice.ref.style.color = prevStyle.color;
        })
        props.indivPricesRef.current = {}
        props.selectedSupplierRef.current.ref = supplierRef.current;
        props.selectedSupplierRef.current.ref.style.backgroundColor = 'rgba(30, 143, 255, 0.514)'
        props.selectedSupplierRef.current.value = props.offerer.offerer_id
    }
    useLayoutEffect(() => {
        const data = {
            priceOfferNumb: props.offerer.price_offer_numb,
            offererid: props.offerer.offerer_id
        }
        fetch('http://172.16.3.101:54321/api/offerer-prices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length
            },
            body: JSON.stringify(data)
        })
        .then(resp => resp.json())
        .then(respJ =>setPrices(respJ))
        .catch(ex => console.log(ex));
    }, [props.offerer])
    const showDetailedView = () => {
        setAdvancedViewDisp(true)
    }
    const offerExtendedInfo = prices.map((price, index) => ({ ...price, ...props.offerDetailsRef.current[index] }));
    const handlePictureClick = () => {
        const picturesModal = props.picturesModalHOC(props.offerer.offerer_id)
        props.setModalState({state: true, content: picturesModal})
    }
    return (
        <div style={{backgroundColor: props.result ? 'rgba(30, 143, 255, 0.514)' : ''}} ref={supplierRef}>
            <div style={{cursor: 'pointer'}} onClick={!props.processed ? handleSupplierSelect : () => {}}>
                {props.offerer.offerer_name}
                <div style={{cursor: 'default'}}>
                    <AiOutlinePicture onClick={handlePictureClick} className="pictures-thumb" size="20" />
                    <RiListSettingsLine onClick={showDetailedView} title="ətraflı" size="20" />
                </div>
            </div>
            <div>
               <div>
                    {incoTerms.find(term => term.id === props.offerer.del_type).name}
                </div>
            </div>
            <div>
                {props.offerer.del_dur}
            </div>
            {
                prices.map((material, index) =>
                	<PriceRow
                        indivPricesRef={props.indivPricesRef}
                        key={index}
                        result={material.result}
                        processed={props.processed}
                        selectedSupplierRef={props.selectedSupplierRef}
                        supplierid={props.offerer.offerer_id}
                        id={material.material_id_primary}
                        priceid={material.id}
                        suitable={material.suitable}
                        price={material.price}
                        amount={material.amount}
                        total={material.total}
                    />
                )
            }
            <div style={{width: '200px'}}>{props.offerer.sum}</div>
            <div style={{width: '200px'}}>{props.offerer.approx_trans_fee}</div>
            <div style={{width: '200px'}}>{props.offerer.imp_fee}</div>
            <div style={{width: '200px'}}>{props.offerer.vat}</div>
            <div
                onClick={!props.processed ? handleSupplierSelect : () => {}}
                style={{width: '200px', cursor: 'pointer', ...styleSuitable(props.offerer.suitable)}}
                >{props.offerer.total}</div>
            <div>
                {
                    advancedViewDisp &&
                    	<PriceOffererDetailedProtex
                    		supplier={props.offerer}
                    		closeModal={setAdvancedViewDisp}
                    		orderDetails={props.orderDetails}
                    		prices={offerExtendedInfo}
                    		// handleAdvChange={() => {}}
                    	/>
                }
            </div>
        </div>
    )
}
export default PriceOffererReady