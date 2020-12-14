import React, { useEffect, useState, useContext } from 'react'
import Loading from '../Misc/Loading'
import { TokenContext } from '../../App'

const getResultText = (result) => {
  if (result === 0)
    return 'Baxılır..'
  else if (result === -1)
    return 'Etiraz Edildi'
  else if (result === 1)
    return 'Təsdiq Edildi'
  else if (result === 2)
    return 'Redaytəyə Qaytarıldı'
  else if (result === 3)
    return 'Redaytə Edildi'
}

const Participants = (props) => {
  const tokenContext = useContext(TokenContext);
  const { number, empVersion } = props
  const token = tokenContext[0].token;
  const [checked, setChecked] = useState(false);
  const [participants, setParticipants] = useState(null);
  const handleChange = () => {
    setChecked(prev => !prev);
  }

  useEffect(() => {
    fetch(`http://172.16.3.101:8000/api/participants/${number}?type=1&empVersion=${empVersion}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(resp => resp.json())
      .then(respJ => setParticipants(respJ)
      )
      .catch(err => console.log(err))
  }, [number, empVersion, token])
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
              <div>{getResultText(participant.result)}</div>
              <div>{participant.act_date_time || participant.date_time}</div>
              <div style={{ textAlign: 'left' }}>{participant.comment}</div>
            </li>
          )
        }
      </ul>
      {
        checked &&
        <Reviewers
          empVersion={empVersion}
          number={number}
          token={token}
        />
      }
    </>
  )
}

const Reviewers = ({ empVersion, number, token }) => {
  const [reviewers, setReviewers] = useState(null);
  useEffect(() => {
    fetch(`http://172.16.3.101:8000/api/participants/${number}?type=4&empVersion=${empVersion}`, {
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
                <div>{getResultText(reviewer.result)}</div>
                <div>{reviewer.act_date_time || reviewer.date_time}</div>
                <div style={{ textAlign: 'left' }}>{reviewer.comment}</div>
              </li>
            )
          }
        </ul>
      </>
      : <Loading />
  )
}
export default Participants