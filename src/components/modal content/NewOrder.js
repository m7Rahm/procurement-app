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
    case 'setReview':
      return { ...state, review: action.payload.value }
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
      receivers: current && isDraft ? content.map(elem => elem.receiver_id) : [],
      assignment: content[0].assignment,
      comment: content[0].comment,
      review: content[0].review ? content[0].review : ''
    }
}

const NewOrderContent = (props) => {
  // console.log(props.content)
  const empListRef = useRef([])
  const init = (current) => {
    const state = initState(current, props.content, props.isDraft)
    if (props.stateRef)
      props.stateRef.current.init = state
    return state
  }
  const current = props.current;
  const [state, dispatch] = useReducer(newOrderReducer, current, init);
  useEffect(() => {
    fetch('http://172.16.3.101:54321/api/emplist')
    .then(resp => resp.json())
    .then(respJ => {
      empListRef.current = respJ;
    })
    .catch(err => console.log(err));
  }, [])
  useEffect(
    () => {
      if (props.stateRef)
        props.stateRef.current.latest = state;
    }, [state, props.stateRef])
  const createApproveNewOrder = () => {
    const parsedMaterials = state.materials.map(material =>
      [
        material.materialId,
        material.amount,
        material.additionalInfo,
        material.model,
        material.importance
      ]
    )
    const data = {
      deadline: state.deadline,
      mats: parsedMaterials,
      receivers: props.receiversRef.current.map(emp => emp.id),
      comment: state.comment,
      assignment: state.assignment,
      ordNumb: current ? current : '',
      review: state.review
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
        if (respJ[0].result === 'success') {
          const recs = [...data.receivers, respJ[0].head_id];
          fetch('http://172.16.3.101:54321/api/orders?from=0&until=20')
            .then(resp => resp.json())
            .then(respJ => {
              props.closeModal(respJ, recs);
            })
            .catch(err => console.log(err))
        }
      })
      .catch(err => console.log(err))
  }
  const handleSendClick = () => {
    if (!current && !props.isDraft)
      createApproveNewOrder()
    else if (current && !props.isDraft) {
      // todo: check if any changes made
      const { review: reviewInit, ...initStateMain } = props.stateRef.current.init;
      const { review: reviewLatest, ...latestStateMain } = props.stateRef.current.latest;
      if (JSON.stringify(initStateMain) === JSON.stringify(latestStateMain)) {
        const data = {
          receivers: latestStateMain.receivers,
          action: 1,
          empVersion: props.content[0].emp_version_id,
          comment: latestStateMain.review
        }
        fetch(`http://172.16.3.101:54321/api/accept-decline/${current}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(data).length
          },
          body: JSON.stringify(data)
        })
          .then(resp => resp.json())
          .then(respJ => {
            if (respJ[0].result === 'success')
              fetch(`http://172.16.3.101:54321/api/refresh-order-content?empVersion=${props.version}&orderNumb=${props.current}`)
                .then(resp => resp.json())
                .then(respJ => {
                  props.closeModal(respJ)
                })
                .catch(err => console.log(err));
          })
      }
      else {
        //todo: change order content and send it
        createApproveNewOrder()
      }
    }
    else if (props.isDraft) {
      //todo: send draft
    }
  }
  console.log(empListRef.current)
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
      <NewOrderFooter
        isDraft={props.isDraft}
        comment={state.comment}
        current={current}
        receiversRef={props.receiversRef}
        dispatch={dispatch}
        empListRef={empListRef}
      />
      <div className="send-order" onClick={handleSendClick}>
        Göndər
      </div>
    </div>
  )
}
export default NewOrderContent