import React, { useState, useRef } from 'react'
import SideBar from '../../components/Common/SideBar'
import VisaContent from '../../components/Orders/Visas/VisaContent'
const handleCardClick = (isReadRef, props, stateRef, token) => {
  if (isReadRef.current.style.display === 'block') {
    const data = {
      visaCards: [[props.id, 0, 1, props.isPinned, props.number, props.empVersion]],
      update: 0
    }
    fetch(`http://172.16.3.101:54321/api/change-visa-state`, {
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
        if (respJ[0].result === 'success')
          isReadRef.current.style.display = 'none'
      })
      .catch(error => console.log(error));
  }
  if (props.activeRef.current !== stateRef.current) {
    fetch(`http://172.16.3.101:54321/api/tran-info?tranid=${props.id}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
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
const updateList = (data, token, setVisas, notifIcon) => {
  console.log(data);
  fetch('http://172.16.3.101:54321/api/visas', {
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
const Visas = (props) => {
  const [active, setActive] = useState(null);
  const onMountFunction = useRef((setVisas, notifIcon, token) => {
    const data = {
      userName: '',
      // deadline: '',
      startDate: null,
      endDate: null,
      docType: -3,
      from: 0,
      until: 20
    }
    fetch('http://172.16.3.101:54321/api/visas', {
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
    props.webSocketRef.current.onmessage = (msg) => {
      // console.log(msg)
      const data = JSON.parse(msg.data);
      if (data.action === 'newOrder') {
        console.log(data);
        notifIcon.current.style.display = 'block';
      }
    }
  })
  const sendNotification = (receivers) => {
    props.webSocketRef.current.send(JSON.stringify({ action: 'newOrder', people: receivers }));
  }
  return (
    <div style={{ maxHeight: '100vh', display: 'flex', overflowY: 'hidden' }}>
      <SideBar
        handleCardClick={handleCardClick}
        mountFunc={onMountFunction.current}
        updateList={updateList}
        setActive={setActive}
      />
      <VisaContent
        sendNotification={sendNotification}
        current={active}
      />
    </div>
  )
}
export default Visas