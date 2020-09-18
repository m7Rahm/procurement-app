import React, { useState } from 'react'
import WareHouseOrderContent from '../components/WareHouseOrderContent'
import SideBar from '../components/SideBar'
import { token } from '../data/data'
const onMountFunction = (setVisas) => {
    const data = {
        deadline: '',
        userName: '',
        startDate: null,
        endDate: null,
        from: 0,
        until: 20
    }
    fetch('http://172.16.3.101:54321/api/warehouse-offers', {
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
            const totalCount = respJ[0] ? respJ[0].total_count : 0;
            setVisas({ count: totalCount, visas: respJ });
        })
        .catch(err => console.log(err))
}
const handleCardClick = (_, props, stateRef) => {
    if (props.activeRef.current !== stateRef.current) {
        const data = {
            ordNumb: props.number,
            empVersion: props.empVersion
        };
        fetch(`http://172.16.3.101:54321/api/warehouse-offer-content`, {
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
                props.setActiveVisa(respJ);
                props.activeRef.current.style.background = 'none';
                stateRef.current.style.background = 'skyblue'
                props.activeRef.current = stateRef.current;
            })
            .catch(error => console.log(error));
    }
};
const WareHouse = (props) => {
    const [active, setActive] = useState(null);
    // const activeCardRef = useRef(null);
    // console.log(active);
    // const onSuccess = (receivers) => {
    //     if (props.webSocketRef.current) {
    //         props.webSocketRef.current.send(JSON.stringify({ action: 'newOrder', people: receivers }))
    //         activeCardRef.current.style.display = 'none';
    //         setActive(null)
    //     }
    // }
    return (
        <div style={{ textAlign: 'center', background: 'transparent', minHeight: '100vh', display: 'flex' }}>
            <SideBar
                handleCardClick={handleCardClick}
                mountFunc={onMountFunction}
                setActive={setActive}
            />
            {
                active
                    ? <div className="warehouse-container">
                        <WareHouseOrderContent
                            setActive={setActive}
                            ordNumb={active[0].ord_numb}
                            active={active}
                            forProcurement={active[0].for_procurement}
                            />
                    </div>
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
        </div >
    )
}
export default WareHouse