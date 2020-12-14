import React, { useRef, useState } from 'react'
import SideBar from '../../components/Common/SideBar'
import VisaContent from '../../components/Orders/Visas/VisaContent'

// const handleCardClick = (isReadRef, props, stateRef, ) => {
//         props.setActiveVisa(respJ);
//         props.activeRef.current.style.background = 'none';
//         stateRef.current.style.background = 'skyblue'
//         props.activeRef.current = stateRef.current;
// }
const updateList = (data, token, setVisas, notifIcon) => {
  data = JSON.stringify(data);
  fetch('http://172.16.3.101:8000/api/visas', {
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
  const [active, setActive] = useState(undefined);
	const activeRef = useRef({ style: { background: '' } });
  const onMountFunction = useRef((setVisas, notifIcon, token) => {
    const data = JSON.stringify({
      userName: '',
      startDate: null,
      endDate: null,
      docType: -3,
      from: 0,
      until: 20
    })
    fetch('http://172.16.3.101:8000/api/visas', {
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
    props.webSocketRef.current.onmessage = (msg) => {
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
    <div style={{ display: 'flex', overflowY: 'hidden', position: 'relative' }}>
      <SideBar
        mountFunc={onMountFunction.current}
        updateList={updateList}
        setActive={setActive}
        activeRef={activeRef}
      />
      <VisaContent
        tranid={active}
        sendNotification={sendNotification}
      />
    </div>
  )
}
export default Visas