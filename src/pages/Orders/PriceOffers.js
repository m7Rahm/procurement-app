import React, { useContext, useState } from 'react'
import SideBar from '../../components/Common/SideBar'
import PriceOffer from '../../components/PriceOffers/PriceOffer'
import { TokenContext } from '../../App';
const handleCardClick = (_, props, stateRef, token) => {
    if (props.activeRef.current !== stateRef.current) {
        fetch(`http://172.16.3.101:54321/api/express-get-price-offer-content/${props.id}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                props.setActiveVisa({ content: respJ, tranid: props.id });
                props.activeRef.current.style.background = 'none';
                stateRef.current.style.background = 'skyblue'
                props.activeRef.current = stateRef.current;
            })
            .catch(error => console.log(error));
    }
}
const onMount = (setVisas, _, token) => {
    const data = JSON.stringify({
        // userName: '',
        startDate: null,
        endDate: null,
        // docType: -3,
        from: 0,
        // until: 20
    });
    fetch('http://172.16.3.101:54321/api/express-get-price-offers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'Authorization': 'Bearer ' + token
        },
        body: data
    })
        .then(resp => resp.json())
        .then(respJ => {
            const totalCount = respJ[0] ? respJ[0].total_count : 0;
            setVisas({ count: totalCount, visas: respJ })
        })
        .catch(err => console.log(err))
}
const updateList = (data, token, setVisas, notifIcon) => {
    const reqData = JSON.stringify(data);
    fetch('http://172.16.3.101:54321/api/express-get-price-offers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': reqData.length,
            'Authorization': 'Bearer ' + token
        },
        body: reqData
    })
        .then(resp => resp.json())
        .then(respJ => {
            const totalCount = respJ[0] ? respJ[0].total_count : 0;
            setVisas({ count: totalCount, visas: respJ });
            if (notifIcon !== undefined) {
                notifIcon.current.style.animation = 'visibility-hide 0.2s ease-in both';
                notifIcon.current.addEventListener('animationend', function () {
                    this.style.display = 'none';
                    this.style.animation = 'animation: show-up 0.2s ease-in both';
                })
            }
        })
        .catch(ex => console.log(ex))
}
const PriceOffers = (props) => {
    const [active, setActive] = useState({ content: [], tranid: null });
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0]
    return (
        <div style={{ maxHeight: '100vh', display: 'flex', overflowY: 'hidden' }}>
            <SideBar
                handleCardClick={handleCardClick}
                mountFunc={onMount}
                setActive={setActive}
                updateList={updateList}
            />
            <PriceOffer
                // sendNotification={sendNotification}
                token={token}
                tranid={active.tranid}
                current={active.content}
            />
        </div>
    )
}
export default PriceOffers