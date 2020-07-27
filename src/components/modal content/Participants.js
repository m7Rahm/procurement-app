import React, { useEffect, useState } from 'react'
import {
  IoMdRefreshCircle
} from 'react-icons/io'
const Participants = (props) => {
  // console.log(props.number)
  const [checked, setChecked] = useState(false);
  const [participants, setParticipants] = useState(null);
  const handleChange = () => {
    setChecked(prev => !prev);
  }

  useEffect(() => {
    fetch(`http://172.16.3.101:54321/api/participants/${props.number}?type=1`)
      .then(resp => resp.json())
      .then(respJ => setParticipants(respJ)
      )
      .catch(err => console.log(err))
  }, [props.number])
  return (
    participants &&
    <>
      <div className="toggle-container">
        <span className={`toggle-container ${checked ? 'active' : ''}`} onClick={handleChange}>
          <span></span>
        </span>
        <span>{!checked ? 'Rəyçiləri göstər' : 'Rəyçiləri gizlət'}</span>
      </div>
      <ul className='participants'>
        <li>
          <div>Ad Soyad</div>
          <div>Status</div>
          <div>Tarix</div>
          <div style={{ textAlign: 'left' }}>Qeyd</div>
        </li>
        {
          participants.map((participant, index) =>
            <li key={index}>
              <div>{participant.full_name}
                <div style={{ fontWeight: '600', fontSize: 11, color: '#777777' }}>{'Mütəxəssis'}</div>
              </div>
              <div>{participant.result === 1 ? 'Təsdiq' : participant.result === 0 ? 'Etiraz' : 'Baxılır'}</div>
              <div>{participant.date_time}</div>
              <div style={{ textAlign: 'left' }}>{participant.comment}</div>
            </li>
          )
        }
      </ul>
      {
        checked &&
        <Reviewers id={props.number} />
      }
    </>
  )
}

const Reviewers = (props) => {
  const [reviewers, setReviewers] = useState(null);
  useEffect(() => {
    fetch(`http://172.16.3.101:54321/api/participants/${props.id}?type=2`)
      .then(resp => resp.json())
      .then(respJ => setReviewers(respJ)
      )
      .catch(err => console.log(err))
  }, [props.id])
  return (
    reviewers ?
      <>
        <span className="reviewers-header">Rəyçilər</span>
        <ul className="participants reviewers">
          <li>
            <div>Ad Soyad</div>
            <div>Tarix</div>
            <div style={{ textAlign: 'center' }}>Rəy</div>
          </li>
          {
            reviewers.map((reviewer, index) =>
              <li key={index}>
                <div>{reviewer.full_name}
                  <div style={{ fontWeight: '600', fontSize: 11, color: '#777777' }}>{'Mütəxəssis'}</div>
                </div>
                <div>{reviewer.date_time}</div>
                <div style={{ textAlign: 'left' }}>{reviewer.comment}</div>
              </li>
            )
          }
        </ul>
      </>
      : <div className="loading">
          <IoMdRefreshCircle size="50" color="#a4a4a4" />
        </div>
  )
}
export default Participants