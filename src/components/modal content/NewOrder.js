import React, { useReducer, useEffect, useRef, useImperativeHandle } from 'react'
import NewOrderTableBody from '../NewOrderTableBody'
import NewOrderFooter from '../NewOrderFooter'
import NewOrderHeader from '../NewOrderHeader.js';
import { newOrderInitial } from '../../data/data.js'
const newOrderReducer = (state, action) => {
  const type = action.type;
  switch (type) {
    case 'reset':
      return initState(true, action.payload)
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

const initState = (current, content) => {
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
      receivers: [],
      assignment: content[0].assignment,
      comment: content[0].comment,
      review: content[0].review ? content[0].review : ''
    }
}

const NewOrderContent = (props) => {
  const stateRef = useRef({})
  const empListRef = useRef([]);
  const receiversRef = useRef([]);
  const init = (current) => {
    const state = initState(current, props.content)
    stateRef.current.init = state;
    console.log(state.materials);
    receiversRef.current = state.receivers
    return state
  }
  // console.log(receiversRef.current)
  const current = props.current;
  const empVersionId = props.content ? props.content[0].emp_id : undefined
  const [state, dispatch] = useReducer(newOrderReducer, current, init);
  useEffect(() => {
    fetch('http://172.16.3.101:54321/api/emplist')
      .then(resp => resp.json())
      .then(respJ => {
        empListRef.current = respJ;
      })
      .catch(err => console.log(err));
  }, [])
  useEffect(() => {
    if (props.content && props.isDraft) {
      dispatch({ type: 'reset', payload: props.content })
    }
  }, [props.content, props.isDraft])
  // console.log(stateRef.current.init, state)
  useImperativeHandle(props.stateRef, () => ({
    changed: JSON.stringify(stateRef.current.init) !== JSON.stringify(state),
    latest: state,
    receivers: receiversRef.current
  }), [state])
  const createApproveNewOrder = (url, onSuccess) => {
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
      receivers: receiversRef.current.map(emp => emp.id),
      comment: state.comment,
      assignment: state.assignment,
      ordNumb: current ? current : '',
      review: state.review,
      empVersion: props.content ? props.content[0].emp_version_id: null
    }
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': JSON.stringify(data).length
      },
      body: JSON.stringify(data)
    })
      .then(resp => resp.json())
      .then(respJ => {
        console.log(respJ);
        if (respJ[0].result === 'success') {
          onSuccess(data, respJ)
        }
      })
      .catch(err => console.log(err))
  }
  const handleSendClick = () => {
    if (!current && !props.isDraft) {
      const onSuccess = (data, respJ) => {
        const recs = [...data.receivers, respJ[0].head_id];
        fetch('http://172.16.3.101:54321/api/orders?from=0&until=20')
          .then(resp => resp.json())
          .then(respJ => {
            props.closeModal(respJ, recs);
          })
          .catch(err => console.log(err))
      }
      createApproveNewOrder('http://172.16.3.101:54321/api/new-order', onSuccess)
    }
    else if (current && !props.isDraft) {
      // todo: check if any changes made
      const { review: reviewInit, ...initStateMain } = stateRef.current.init;
      const { review: reviewLatest, ...latestStateMain } = state;
      if (JSON.stringify(initStateMain) === JSON.stringify(latestStateMain)) {
        const data = {
          receivers: latestStateMain.receivers,
          action: 1,
          empVersion: props.content[0].emp_version_id,
          comment: latestStateMain.review,
          forwardedVersion: props.content[0].emp_version_id
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
              props.closeModal(respJ)
          })
      }
      else {
        //todo: change order content and send it
        const onSuccess = (data, respJ) => {
          const recs = [...data.receivers, respJ[0].head_id];
          props.closeModal(respJ, recs);
        }
        createApproveNewOrder('http://172.16.3.101:54321/api/new-order', onSuccess)
      }
    }
    else if (props.isDraft) {
      console.log(receiversRef.current)
      const onSuccess = (data, respJ) => {
        const recs = [...data.receivers, respJ[0].head_id];
        props.onSuccess(recs)
      }
      createApproveNewOrder('http://172.16.3.101:54321/api/create-order-from-draft', onSuccess)
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
      <NewOrderFooter
        isDraft={props.isDraft}
        comment={state.comment}
        current={current}
        receiversRef={receiversRef}
        dispatch={dispatch}
        empVersion={empVersionId}
        empListRef={empListRef}
      />
      <div className="send-order" onClick={handleSendClick}>
        Göndər
      </div>
    </div>
  )
}
export default NewOrderContent