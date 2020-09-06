import React, { useState } from 'react'
import OrdersContent from '../components/OrdersContent'
import PriceOffer from '../components/modal content/PriceOffer' 
import SideBar from '../components/SideBar'
import CreatePriceOfferFooter from '../components/CreatePriceOfferFooter'

const onMountFunction = (setVisas) => {
    const data = {
        deadline: '',
        userName: '',
        startDate: null,
        endDate: null,
        from: 0,
        until: 20
    }
    fetch('http://172.16.3.101:54321/api/get-ready-orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(data).length
        },
        body: JSON.stringify(data)
    })
        .then(resp => resp.json())
        .then(respJ => setVisas(respJ))
        .catch(err => console.log(err))
}
const handleCardClick = (_, props, stateRef) => {
    if (props.activeRef.current !== stateRef.current) {
        const data = {
            orderid: props.number,
            empVersion: props.empVersion
        };
        fetch(`http://172.16.3.101:54321/api/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length
            },
            body: JSON.stringify(data)
        })
            .then(resp => resp.json())
            .then(respJ => {
                props.setActiveVisa(respJ);
                props.activeRef.current.style.background = 'none';
                stateRef.current.style.background = 'skyblue'
                props.activeRef.current = stateRef.current;
            })
            .catch(error => console.log(error));
    }
}
const footerComp = (props) =>
    <CreatePriceOfferFooter
        {...props}
        childComp={PriceOffer}
    />
const Inbox = () => {
    const canBeChanged = false
    const [active, setActive] = useState(null);
    return (
        <div style={{ textAlign: 'center', background: 'transparent', minHeight: '100vh', display: 'flex' }}>
            <SideBar handleCardClick={handleCardClick} mountFunc={onMountFunction} setActive={setActive} />
            {
                active
                    ? <OrdersContent
                        current={active}
                        canBeChanged={canBeChanged}
                        footerComp={footerComp}
                    />
                    : <>
                        <div style={{ marginTop: '100px', flex: 1, paddingTop: '56px' }}>
                            <img
                                src={require('../Konvert.svg')}
                                alt="blah"
                                height="70"
                                style={{ marginBottom: '20px' }} />
                            <br />
                            <span style={{ color: 'gray', fontSize: 20 }}>Baxmaq üçün sənədi seçin</span>
                        </div>
                    </>
            }
        </div>
    )
}
export default Inbox