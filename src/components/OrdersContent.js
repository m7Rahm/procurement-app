import React, { useState, useEffect } from 'react'

import OrderContentProtected from './OrderContentProtected'
import PriceOfferVersion from './PriceOfferVersion'
const footerComponent = () =>
    <>
    </>
const OrdersContent = (props) => {
    // console.log(props.current);
    const [priceOfferVersions, setPriceOfferVersions] = useState([{ finished: true, user_id: Math.random() }])
    const empVersion = props.current[0].emp_version_id
    const ordNumb = props.current[0].ord_numb;
    
    useEffect(() => {
        const data = {
            empVersion,
            ordNumb
        }
        const token = localStorage.getItem('token');
        fetch('http://172.16.3.101:54321/api/get-price-offer-versions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length,
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
        .then(resp => resp.json())
        .then(respJ => {
            setPriceOfferVersions(respJ);
        })
        .catch(ex => console.log(ex))
    }, [empVersion, ordNumb]);
    const finished = priceOfferVersions.length === 0 ? false : priceOfferVersions[0].finished;
    // console.log(priceOfferVersions)
    return (
        <div
            style={{
                display: 'flex',
                flexFlow: 'column wrap',
                flex: 1,
                maxWidth: '1256px',
                paddingTop: '100px',
                margin: ' 0px auto',
                overflowY: 'hidden',
                maxHeight: '100vh'
                }}>
            <div style={{overflow: 'auto'}}>
                <OrderContentProtected footerComponent={footerComponent} current={props.current} />
                {
                    priceOfferVersions.map(version => 
                        <PriceOfferVersion
                            ordNumb={ordNumb}
                            canBeChanged={props.canBeChanged}
                            key={version.user_id}
                            name={version.full_name}
                            offerVersion={version.user_id}
                            active={props.current}
                        />
                    )
                }
                <props.footerComp
                    finished={finished}
                    active={props.current}
                />
            </div>
        </div>
    )
}
export default OrdersContent

