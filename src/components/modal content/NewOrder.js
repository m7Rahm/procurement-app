import React, { useReducer, useEffect, useRef } from 'react'
import NewOrderTableBody from '../NewOrderTableBody'
import NewOrderFooter from '../NewOrderFooter'
import NewOrderHeader from '../NewOrderHeader.js';
import { newOrderInitial } from '../../data/data.js'
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
    case 'addRow':
      return { ...state, materials: [...state.materials, action.payload.rowData] }
    case 'setAssign':
      return { ...state, assignment: action.payload.value }
    case 'setDeadline':
      return { ...state, deadline: action.payload.value }
    case 'setComment':
      return { ...state, comment: action.payload.value }
    case 'setOrderid':
      return { ...state, orderid: action.payload.value }
    case 'init':
      return action.payload
    default:
      return state
  }
}

const initState = (current, content, isDraft) => {
  if (!current)
    return newOrderInitial
  else
    return {
      materials: content.map(elem => ({
        id: Math.random().toString(),
        materialId: elem.material_id,
        model: elem.model,
        amount: elem.amount,
        importance: elem.importance,
        additionalInfo: elem.material_comment,
        class: ''
      })),
      deadline: content[0].deadline,
      receivers: !isDraft ? [] : content.map(elem => elem.receiver_id),
      assignment: content[0].assignment,
      comment: !isDraft ? '' : content[0].comment
    }
}

const NewOrderContent = (props) => {
  const empListRef = useRef(null);
  const init = (current) => {
    const state = initState(current, props.content, props.isDraft)
    if (props.stateRef);
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

  const handleSendClick = () => {
    if (!current && !props.isDraft) {
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
        receivers: empListRef.current.map(emp => emp.id),
        comment: state.comment,
        assignment: state.assignment,
        ordNumb: '',
        review: ''
      }
      fetch('http://172.16.3.101:54321/api/new-order', {
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
          if (respJ[0].result === 'success')
            fetch('http://172.16.3.101:54321/api/orders?from=0&until=20')
              .then(resp => resp.json())
              .then(respJ => {
                props.closeModal(respJ);
              })
              .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }
    else if(current && !props.isDraft){
      //todo: check if any changes made props.stateRef.current.latest === props.stateRef.current.init
      //todo: change order content and send it
    }
    else if (props.isDraft){
      //todo: send draft
    }
  }
  return (
    <div className="modal-content-new-order">
      <NewOrderHeader deadline={state.deadline} assignment={state.assignment} dispatch={dispatch} />
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
      <NewOrderFooter isDraft={props.isDraft} comment={state.comment} empListRef={empListRef} dispatch={dispatch} />
      <div className="send-order" onClick={handleSendClick}>
        Göndər
      </div>
    </div>
  )
}
export default NewOrderContent