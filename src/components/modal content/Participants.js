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
    return 'Redaktə Edildi'
}

const Participants = (props) => {
  const tokenContext = useContext(TokenContext);
  const { id } = props;
  const token = tokenContext[0].token;
  const [checked, setChecked] = useState(false);
  const [participants, setParticipants] = useState(null);
  const handleChange = () => {
    setChecked(prev => !prev);
  }
  useEffect(() => {
    fetch(`http://192.168.0.182:54321/api/participants/${id}?type=1`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(resp => resp.json())
      .then(respJ => setParticipants(respJ)
      )
      .catch(err => console.log(err))
  }, [id, token])
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
                <div style={{ fontWeight: '600', fontSize: 11, color: '#777777' }}>{participant.vezife || ""}</div>
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
          id={id}
          token={token}
        />
      }
    </>
  )
}

const Reviewers = ({ id, token }) => {
  const [reviewers, setReviewers] = useState(null);
  useEffect(() => {
    fetch(`http://192.168.0.182:54321/api/participants/${id}?type=4`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(resp => resp.json())
      .then(respJ => setReviewers(respJ)
      )
      .catch(err => console.log(err))
  }, [id, token]);
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
                  <div style={{ fontWeight: '600', fontSize: 11, color: '#777777' }}>{reviewer.vezife || ""}</div>
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