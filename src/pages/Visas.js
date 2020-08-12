import React, { useState, useCallback } from 'react'
import SideBar from '../components/SideBar'
import VisaContent from '../components/VisaContent'
// import { visas } from '../data/data'
const handleCardClick = (isReadRef, props, stateRef) => {
  if (isReadRef.current.style.display === 'block') {
    const data = { visaCards: [[props.id, 0, 1, props.isPinned]], update: 0 }
    fetch(`http://172.16.3.101:54321/api/change-visa-state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': JSON.stringify(data).length
      },
      body: JSON.stringify(data)
    })
      .then(resp => resp.json())
      .then(respJ => {
        if (respJ[0].result === 'success')
          isReadRef.current.style.display = 'none'
      })
      .catch(error => console.log(error));
  }
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
const Visas = (props) => {
  const [active, setActive] = useState(null);
  const onMountFunction = useCallback((setVisas, notifIcon) => {
    const data = {
      userName: '',
      deadline: '',
      startDate: null,
      endDate: null,
      docType: 0,
      from: 0,
      until: 20
    }
    fetch('http://172.16.3.101:54321/api/visas', {
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
    props.webSocketRef.current.onmessage = (msg) => {
      // console.log(msg)
      const data = JSON.parse(msg.data);
      if (data.action === 'newOrder') {
        notifIcon.current.style.display = 'block';
      }
    }
  }, [props.webSocketRef])


  return (
    <div style={{ maxHeight: '100vh', display: 'flex', overflow: 'hidden' }}>
      <SideBar handleCardClick={handleCardClick} mountFunc={onMountFunction} setActive={setActive} />
      <VisaContent current={active} />
    </div>
  )
}
export default Visas