import React, { useState } from 'react';
import SideBar from '../components/SideBar';
import NewOrderContent from '../components/modal content/NewOrder';

const onMountFunction = (setVisas) => {
    const data = {
        deadline: '',
        startDate: null,
        endDate: null,
        from: 0,
        until: 20
    }
    fetch('http://172.16.3.101:54321/api/get-drafts', {
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

const Drafts = (props) => {
    const [active, setActive] = useState(null);
    
    // const NewComponent = () => <NewOrderContent current={active}/>
    return (
        <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'transparent' }}>
            <SideBar mountFunc={onMountFunction} setActive={setActive} />
            <div style={{ flex: 1, background: 'transparent', height: '100vh', overflow: 'auto', paddingTop: '56px', textAlign: 'center' }}>
                {
                    active
                        ? <NewOrderContent isDraft={true} current={active} />
                        : <>
                            <div style={{ marginTop: '100px' }}>
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
        </div>
    )
}
export default Drafts