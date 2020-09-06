import React, { useState, useCallback } from 'react'
import SideBar from '../components/SideBar'
import VisaContent from '../components/VisaContent'
const handleCardClick = (isReadRef, props, stateRef) => {
  if (isReadRef.current.style.display === 'block') {
    const data = {
      visaCards: [[props.id, 0, 1, props.isPinned, props.number, props.empVersion]],
      update: 0
    }
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
    fetch(`http://172.16.3.101:54321/api/tran-info?tranid=${props.id}`)
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
const Archived = (props) => {
  const [active, setActive] = useState(null);
  const onMountFunction = useCallback((setVisas, notifIcon) => {
    const data = {
      from: 0,
      until: 20
    }
    fetch('http://172.16.3.101:54321/api/get-deleted', {
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
  }, [])
  const sendNotification = (receivers) => {
    props.webSocketRef.current.send(JSON.stringify({action: 'newOrder', people: receivers}));
  }
  return (
    <div style={{ maxHeight: '100vh', display: 'flex', overflowY: 'hidden' }}>
      <SideBar
        handleCardClick={handleCardClick}
        mountFunc={onMountFunction}
        setActive={setActive}
      />
      <VisaContent sendNotification={sendNotification} current={active} />
    </div>
  )
}
export default Archived