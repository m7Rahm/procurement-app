import React, { useReducer, useEffect, useRef, useContext, useState } from 'react'
import NewOrderTableBody from '../NewOrderTableBody'
import { newOrderInitial } from '../../data/data.js'
import { TokenContext } from '../../App'
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
            ? { ...material, ...action.payload.data }
            : material
        )
      }
    case 'updateRowSync':
      return {
        ...state, materials: state.materials.map(material =>
          material.id === action.payload.rowid && parseInt(material.count) > 0
            ? {
              ...material,
              count: action.payload.operation === 'dec'
                ? parseInt(material.count) - 1
                : parseInt(material.count) + 1
            }
            : material
        )
      }
    case 'addRow':
      return { ...state, materials: [...state.materials, action.payload.rowData] }
    case 'setCategory':
      return { ...state, category: action.payload.value }
    case 'setOrderType':
      return { ...state, orderType: action.payload.value }
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

const initState = () => newOrderInitial

const NewOrderContent = (props) => {
  const tokenContext = useContext(TokenContext);
  const token = tokenContext[0];
  const stateRef = useRef({});
  const closeModal = props.handleModalClose;
  const version = props.version;
  const [categories, setCategories] = useState([]);
  const init = (current) => {
    const state = initState(current, version, token);
    stateRef.current.init = state;
    return state
  }
  const current = props.current;
  const [state, dispatch] = useReducer(newOrderReducer, current, init);
  useEffect(() => {
    fetch('http://172.16.3.101:54321/api/material-categories', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(resp => resp.json())
      .then(respJ => {
        setCategories(respJ);
      })
      .catch(err => console.log(err))
  }, [token]);
  const createApproveNewOrder = (url, onSuccess) => {
    const parsedMaterials = state.materials.map(material =>
      [
        material.model,
        material.count,
        material.approx_price * material.count,
        material.additionalInfo,
        material.subCategory
      ]
    )
    const data = {
      mats: parsedMaterials,
      receivers: [], // receiversRef.current.map(emp => emp.id),
      ordNumb: current ? current : '',
      orderType: state.orderType
    }
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': JSON.stringify(data).length,
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(data)
    })
      .then(resp => resp.json())
      .then(respJ => {
        if (respJ[0].result === 'success') {
          onSuccess(data, respJ)
        }
      })
      .catch(err => console.log(err))
  }
  console.log(state)
  useEffect(() => {
    dispatch({
      type: 'init',
      payload: {...newOrderInitial, orderType: state.orderType}
    })
  }, [state.orderType, dispatch])
  const handleSendClick = () => {
    if (!current && !props.isDraft) {
      const onSuccess = (data, respJ) => {
        const recs = [...data.receivers, respJ[0].head_id];
        const apiData = JSON.stringify({
          from: 0,
          until: 20,
          status: 0,
          dateFrom: '',
          dateTill: '',
          ordNumb: ''
        });
        //todo: create socket and connect
        fetch('http://172.16.3.101:54321/api/orders', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Length': apiData.length,
            'Content-Type': 'application/json'
          },
          body: apiData
        })
          .then(resp => resp.json())
          .then(respJ => {
            closeModal(respJ, recs);
          })
          .catch(err => console.log(err))
      }
      createApproveNewOrder('http://172.16.3.101:54321/api/new-order', onSuccess)
    }
  }
  const handleChange = (e) => {
    const value = e.target.value;
    dispatch({ type: 'setOrderType', payload: { value: value } })
  }
  return (
    <div className="modal-content-new-order">
      <div>
        <select value={state.orderType} onChange={handleChange}>
          <option value={0}>Mal-Material</option>
          <option value={1}>Xidmət</option>
        </select>
      </div>
      <ul className="new-order-table">
        <li>
          <div>#</div>
          <div>Kateqoriya</div>
          <div>Alt-Kateqoriya</div>
          <div>Məhsul</div>
          <div style={{ width: '170px', maxWidth: '200px' }}>Kod</div>
          <div style={{ maxWidth: '140px' }}>Say</div>
          <div>Kurasiya</div>
          <div>Büccə</div>
          <div>Əlavə məlumat</div>
          <div> </div>
        </li>
        <NewOrderTableBody
          state={state}
          dispatch={dispatch}
          categories={categories}
        />
      </ul>
      <div className="send-order" onClick={handleSendClick}>
        Göndər
      </div>
    </div>
  )
}
export default NewOrderContent