import React, { useState, useLayoutEffect, useRef, useEffect } from 'react'
import PriceOffererReady from './PriceOffererReady'
const OrderDetails = React.memo((props) => {
    const [offerDetails, setOfferDetails] = useState([])
    useEffect(() => {
        const data = {
            priceOfferNumb: props.priceOfferNumb
        }
        fetch('http://172.16.3.101:54321/api/get-price-offer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length
            },
            body: JSON.stringify(data)
        })
            .then(resp => resp.json())
            .then(respJ => setOfferDetails(respJ))
    }, [props.priceOfferNumb])
return (
    offerDetails.map((detail, index) =>
        <div key={detail.id}>
            <div>{index += 1}</div>
            <div>{detail.material_name}</div>
            <div>{detail.model}</div>
            <div>{detail.amount}</div>
            <div>{detail.unit || 'ədəd'}</div>
        </div>
    )
)
}, () => true)


const PriceOfferReadyTable = (props) => {
    const indivPricesRef = useRef({})
    const selectedSupplierRef = useRef({})
    const actionsRibbon = useRef(null);
    const [offerers, setOfferers] = useState([]);
    useLayoutEffect(() => {
        const data = {
            poNumb: props.priceOfferInfo.poNumb,
            empVersion: props.priceOfferInfo.empVersion
        }
        fetch('http://172.16.3.101:54321/api/get-po-gen-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length
            },
            body: JSON.stringify(data)
        })
            .then(resp => resp.json())
            .then(respJ => {
                setOfferers(respJ)
            })
    }, [props.priceOfferInfo])
    const confirmSelected = () => {
        console.log(indivPricesRef.current, selectedSupplierRef.current)
        const partial = selectedSupplierRef.current.ref ? false : true;
        const approvedPriceIds = Object.values(indivPricesRef.current).map(priceInfo => priceInfo.val);
        const data = {
            priceOfferIden: props.priceOfferNumb,
            partial: partial,
            result: 1,
            offererid: selectedSupplierRef.current.value,
            approvedPriceIds: approvedPriceIds
        }
        fetch('http://172.16.3.101:54321/api/app-dec-price-offer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length
            },
            body: JSON.stringify(data)
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].result === 'success') {
                    console.log(respJ)
                    actionsRibbon.current.style.display = 'none'
                }
            })
    }
    const decline = () => {
        const data = {
            priceOfferIden: props.priceOfferNumb,
            partial: false,
            result: -1,
            offererid: 0,
            approvedPriceIds: []
        }
        fetch('http://172.16.3.101:54321/api/app-dec-price-offer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length
            },
            body: JSON.stringify(data)
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].result === 'success') {
                    actionsRibbon.current.style.display = 'none'
                }
            })
    }
    let processed = offerers[0] ? offerers[0].processed : false;
    processed = processed || !props.canBeChanged
    return (
        <>
            <div>
                {
                    // modalState &&
                    // <Suspense fallback="">
                    //     <OfferPictures setModalState={setModalState} pictures={pictures} />
                    // </Suspense>
                }
                <div className="price-offer-table-container">
                    <div className="header-container">
                        <div>
                            <div>№</div>
                            <div>Malın adı</div>
                            <div>Texniki göstərici</div>
                            <div>Miqdar</div>
                            <div>Say</div>
                        </div>
                        <OrderDetails priceOfferNumb={props.priceOfferNumb}/>
                        <div>
                            <div>Сəm</div>
                            <div>Təxmini daşınma xərci</div>
                            <div>15% Idxal rüsumu</div>
                            <div>18% ƏDV</div>
                            <div>Yekun məbləğ</div>
                            <div>Təsdiq olunan təklif</div>
                        </div>
                    </div>
                    {
                        offerers.map((offerer, index) =>
                            <PriceOffererReady
                                indivPricesRef={indivPricesRef}
                                selectedSupplierRef={selectedSupplierRef}
                                offerer={offerer}
                                result={offerer.result}
                                processed={processed}
                                key={index}
                                id={index}
                            />)
                    }
                </div>
            </div>
            {
                !processed &&
                <div ref={actionsRibbon}>
                    <div className="add-new-price-offerer" onClick={confirmSelected}>Seçimləri təsdiqlə</div>
                    <div onClick={decline} style={{ backgroundColor: 'rgb(255, 174, 0)' }} className="add-new-price-offerer">Etiraz et </div>
                </div>
            }
        </>
    )
}
export default PriceOfferReadyTable