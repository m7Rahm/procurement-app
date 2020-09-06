import React, { useState, useLayoutEffect, useRef, useEffect } from 'react'
import PriceOffererReady from './PriceOffererReady'
import WarningApprovedPO from './modal content/WarningApprovedPO'
import Modal from './Modal'
import PicturesModal from './modal content/PicturesModal'

const OrderDetails = React.memo((props) => {
    const [offerDetails, setOfferDetails] = useState([]);
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
            .then(respJ => {
                setOfferDetails(respJ);
                props.offerDetailsRef.current = respJ;
            })
    }, [props.priceOfferNumb, props.offerDetailsRef])
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
    const [approvedData, setApprovedData] = useState([]);
    const ordNumb = props.active[0].ord_numb;
    const empVersion = props.priceOfferInfo.empVersion
    const poNumb = props.priceOfferInfo.poNumb;
    const offerDetailsRef = useRef(null);
    const picturesModalHOC = (offererid) => (props) =>
        <PicturesModal
            offererid={offererid}
            priceOfferNumb={poNumb}
            {...props}
        />

    const [modalState, setModalState] = useState({ state: false, content: null });
    // console.log(props)
    const closeModal = () => {
        setModalState({ state: false, content: null })
    }
    const warningDuplicate = (props) =>
        <WarningApprovedPO
            {...props}
            approvedData={approvedData}
        />
    useLayoutEffect(() => {
        const data = {
            poNumb: poNumb,
            empVersion: empVersion
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
    }, [poNumb, empVersion])
    const confirmSelected = () => {
        console.log(indivPricesRef.current, selectedSupplierRef.current)
        const partial = selectedSupplierRef.current.ref ? false : true;
        const approvedPriceIds = Object.values(indivPricesRef.current).map(priceInfo => priceInfo.val);
        const data = {
            priceOfferIden: props.priceOfferNumb,
            partial: partial,
            result: 1,
            offererid: selectedSupplierRef.current.value,
            approvedPriceIds: approvedPriceIds,
            ordNumb,
            empVersion
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
                // console.log(respJ);
                if (respJ[0].result === 'success') {
                    actionsRibbon.current.style.display = 'none'
                }
                else if (respJ[0].result === 'exists') {

                    setModalState({ state: true, content: warningDuplicate })
                    setApprovedData(respJ)
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
                else if (respJ[0].result === 'exists') {
                    setApprovedData(respJ)
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
                        <OrderDetails priceOfferNumb={props.priceOfferNumb} offerDetailsRef={offerDetailsRef} />
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
                                offerDetailsRef={offerDetailsRef}
                                selectedSupplierRef={selectedSupplierRef}
                                offerer={offerer}
                                result={offerer.result}
                                processed={processed}
                                key={index}
                                id={index}
                                picturesModalHOC={picturesModalHOC}
                                setModalState={setModalState}
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
            {
                modalState.state &&
                <Modal changeModalState={closeModal}>
                    {modalState.content}
                </Modal>
            }
        </>
    )
}
export default PriceOfferReadyTable