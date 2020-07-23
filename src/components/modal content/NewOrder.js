import React, { useReducer, useEffect } from 'react'
import { orders } from '../../data/data.js'
import NewOrderTableBody from '../NewOrderTableBody'
import NewOrderFooter from '../NewOrderFooter'
import NewOrderHeader from '../NewOrderHeader.js'
const newOrderReducer = (state, action) => {
  const type = action.type;
  switch (type) {
    case 'reset':
      return initState(action.payload)
    case 'deleteRow':
      return { ...state, materials: state.materials.filter(material => material.id !== action.payload.rowid) }
    case 'updateRow':
      return {
        ...state, materials: state.materials.map(
          material => material.id === action.payload.rowid
            ? { ...material, [action.payload.name]: action.payload.value }
            : material)
      }
    case 'updateRowSync':
      {
        return {
          ...state, materials: state.materials.map(material =>
            material.id === action.payload.rowid && parseInt(material.amount) > 0
              ? {
                ...material,
                amount: action.payload.operation === 'dec'
                  ? parseInt(material.amount) - 1
                  : parseInt(material.amount) + 1
              }
              : material
          )
        }
      }
    case 'addRow':
      return { ...state, materials: [...state.materials, action.payload.rowData] }
    case 'setDepid':
      return { ...state, assignmentid: action.payload.value }
    case 'setDeadline':
      return { ...state, deadline: action.payload.value }
    case 'setComment':
      return { ...state, comment: action.payload.value }
    case 'setRec':
      return { ...state, receiverid: action.payload.value }
    default:
      return state
  }
}

const initState = (current) => {
  const order = orders.find(order => order.number === current);
  const materials = order === undefined
    ? [
      {
        id: Math.random().toString(),
        materialId: 1,
        model: '',
        importance: 1,
        amount: 1,
        additionalInfo: '',
        class: ''
      }
    ]
    : order.materials;
  return {
    materials: materials,
    deadline: '',
    receiverid: 2,
    assignmentid: 1,
    comment: ''
  }
}

const NewOrderContent = (props) => {
  // console.log(props)
  const init = (current) => {
    const state = initState(current)
    if (props.stateRef)
      props.stateRef.current.init = state
    return state
  }
  const current = props.current;
  const [state, dispatch] = useReducer(newOrderReducer, current, init);
  useEffect(
    () => {
      if (props.stateRef)
        props.stateRef.current.latest = state;
    }, [state, props.stateRef])

  useEffect(
    () => {
      if (!props.stateRef)
        dispatch({ type: 'reset', payload: current });
    }, [current, props.stateRef])
  
  console.log(props);
  const handleSendClick = () => {
    const parsedMaterials = state.materials.map(material =>
        ({
          material_id: material.materialId,
          amount: material.amount,
          comment: material.additionalInfo,
          model: material.model,
          importance: material.importance
        })
      )
    const data = {
      deadline: state.deadline,
      mats: parsedMaterials,
      receiverid: state.receiverid,
      comment: state.comment,
      assignment_id: state.assignmentid
    }
    fetch('http://172.16.3.101:54321/api/neworder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': JSON.stringify(data).length
      },
      body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    // .then(respJ => console.log(respJ))
    .then(respJ => {
      console.log(respJ[0].result);
      if (respJ[0].result === 'success')
      fetch('http://172.16.3.101:54321/api/orders?from=0&until=20')
      .then(resp => resp.json())
      .then(respJ => {
        props.closeModal(respJ);
      })
      .catch(err => console.log(err))
    })
    .catch(err =>console.log(err))
  }
  return (
    <div className="modal-content-new-order">
      <NewOrderHeader deadline={state.deadline} departmentid={state.assignmentid} dispatch={dispatch} />
      <ul className="new-order-table">
        <li>
          <div>#</div>
          <div>Material</div>
          <div>Model</div>
          <div style={{ width: '170px', maxWidth: '200px' }}>Vaciblik</div>
          <div style={{ maxWidth: '140px' }}>Say</div>
          <div>Əlavə məlumat</div>
          <div> </div>
        </li>
        <NewOrderTableBody dispatch={dispatch} materials={state.materials} />
      </ul>
      <NewOrderFooter comment={state.comment} receiverid={state.receiverid} dispatch={dispatch} />
      <div className="send-order" onClick={handleSendClick}>
        Göndər
      </div>
    </div>
  )
}
export default NewOrderContent