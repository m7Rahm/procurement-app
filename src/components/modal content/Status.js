import React from 'react'
import {
  IoMdClose
} from 'react-icons/io'
import img from '../../status.png'
export default (props) => {
  const closeModal = props.changeModalState
  return (
    <div className='modal-content'>
      <div>
        Sifariş № {props.number}
        <IoMdClose onClick={() => closeModal(false)} size='18' style={{ verticalAlign: 'baseline', float: 'right' }} />
      </div>
      <img width='100%' src={img} alt='img'/>
    </div>
  )
}
