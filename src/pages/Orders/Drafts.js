import React, { useState, useRef } from 'react';
import SideBar from '../../components/SideBar';
import NewOrderContent from '../../components/modal content/NewOrder';
const onMountFunction = (setVisas, _, props) => {
    const token = props.token;
    const data = {
        deadline: '',
        startDate: null,
        endDate: null,
        from: 0,
        until: 20
    }
    fetch('http://172.16.3.101:8000/api/get-drafts', {
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
            setVisas({ count: totalCount, visas: respJ })
        })
        .catch(err => console.log(err))
}
const handleCardClick = (_, props, stateRef) => {
    const token = props.token;
    if (props.activeRef.current !== stateRef.current) {
        const data = {
            draftid: props.number,
            empVersion: props.empVersion
        };
        fetch(`http://172.16.3.101:8000/api/draft`, {
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
                props.activeCardRef.current = stateRef.current;
                props.setActiveVisa(respJ);
                props.activeRef.current.style.background = 'none';
                stateRef.current.style.background = 'skyblue'
                props.activeRef.current = stateRef.current;
            })
            .catch(error => console.log(error));
    }
}
const Drafts = (props) => {
    const activeCardRef = useRef(null);
    const [active, setActive] = useState(null);
    const onSuccess = (receivers) => {
        if (props.webSocketRef.current) {
            props.webSocketRef.current.send(JSON.stringify({ action: 'newOrder', people: receivers }))
            activeCardRef.current.style.display = 'none';
            setActive(null)
        }
    }
    // const NewComponent = () => <NewOrderContent current={active}/>
    return (
        <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'transparent' }}>
            <SideBar
                token={props.token}
                activeCardRef={activeCardRef}
                isDraft={true}
                handleCardClick={handleCardClick}
                mountFunc={onMountFunction}
                setActive={setActive}
            />
            <div style={{ flex: 1, background: 'transparent', height: '100vh', overflow: 'auto', paddingTop: '56px', textAlign: 'center' }}>
                {
                    active
                        ? <div style={{ maxWidth: '1256px', margin: 'auto' }}>
                            <NewOrderContent
                                isDraft={true}
                                current={active[0].ord_numb}
                                content={active}
                                onSuccess={onSuccess}
                            />
                        </div>
                        : <>
                            <div style={{ marginTop: '100px' }}>
                                <img
                                    src={require('../../Konvert.svg')}
                                    alt="blah"
                                    height="70"
                                    style={{ marginBottom: '20px' }} />
                                <br />
                                <span style={{ color: 'gray', fontSize: 20 }}>Baxmaq üçün sənədi seçin</span>
                            </div>
                        </>
                }
            </div>
        </div>
    )
}
export default Drafts