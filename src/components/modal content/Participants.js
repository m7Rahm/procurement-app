import React, { useEffect, useState, useContext } from 'react'
import {
  IoMdRefreshCircle
} from 'react-icons/io'
import { TokenContext } from '../../App'
const Participants = (props) => {
  const tokenContext = useContext(TokenContext);
  const token = tokenContext[0];
  const [checked, setChecked] = useState(false);
  const [participants, setParticipants] = useState(null);
  const handleChange = () => {
    setChecked(prev => !prev);
  }

  useEffect(() => {
    fetch(`http://172.16.3.101:54321/api/participants/${props.number}?type=1&empVersion=${props.empVersion}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(resp => resp.json())
      .then(respJ => setParticipants(respJ)
      )
      .catch(err => console.log(err))
  }, [props.number, props.empVersion, token])
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
              <div>{participant.result === 1 ? 'Təsdiq' : participant.result === -1 ? 'Etiraz' : 'Baxılır'}</div>
              <div>{participant.act_date_time || participant.date_time}</div>
              <div style={{ textAlign: 'left' }}>{participant.comment}</div>
            </li>
          )
        }
      </ul>
      {
        checked &&
        <Reviewers
          empVersion={props.empVersion}
          number={props.number}
          token={token}
        />
      }
    </>
  )
}

const Reviewers = ({ empVersion, number, token }) => {
  const [reviewers, setReviewers] = useState(null);
  useEffect(() => {
    fetch(`http://172.16.3.101:54321/api/participants/${number}?type=4&empVersion=${empVersion}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(resp => resp.json())
      .then(respJ => setReviewers(respJ)
      )
      .catch(err => console.log(err))
  }, [number, empVersion, token])
  return (
    reviewers ?
      <>
        <span className="reviewers-header">Rəyçilər</span>
        <ul className="participants reviewers">
          <li>
          <div>Ad Soyad</div>
          <div>Status</div>
          <div>Tarix</div>
          <div style={{ textAlign: 'left' }}>Rəy</div>
          </li>
          {
            reviewers.map((reviewer, index) =>
              <li key={index}>
                <div>{reviewer.full_name}
                  <div style={{ fontWeight: '600', fontSize: 11, color: '#777777' }}>Mütəxəssis</div>
                </div>
                <div>{reviewer.result === 1 ? 'Təsdiq' : reviewer.result === -1 ? 'Etiraz' : 'Baxılır'}</div>
                <div>{reviewer.act_date_time || reviewer.date_time}</div>
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