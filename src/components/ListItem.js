import React, { useState } from 'react'
import {
  FaCommentAlt,
  FaEllipsisH
} from 'react-icons/fa'
import StatusModal from './StatusModal'

export default (props) => {
  const onStatusClick = () => {
   
  }
  const onCommentClick = () => {
    setIsModalOpen(prevState => !prevState)
  }
  const onActionClick = () => {

  }
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <>
      <li>
        <div style={{ width: '25px' }}>{props.rowNumber}</div>
        <div style={{ width: '10%' }}> {props.status} <img src={props.icon} onClick={onStatusClick} /></div>
        <div style={{ width: '20%' }}> {props.category}</div>
        <div style={{ width: '15%' }}> {props.number}</div>
        <div style={{ width: '20%' }}> {props.participants}</div>
        <div style={{ width: '15%' }}> {props.deadline}</div>
        <div style={{ width: '10%' }}><FaCommentAlt color='#a1a1a1' onClick={onCommentClick} /> {props.remark}</div>
        <div style={{ overflow: 'hidden' }}><FaEllipsisH color='#a1a1a1' onClick={onActionClick} /></div>
      </li>
      {
        isModalOpen?
        <StatusModal changeModalState = {setIsModalOpen}/>
        :''
      }
    </>
  )
}