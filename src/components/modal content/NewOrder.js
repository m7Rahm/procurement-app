import React, { useReducer, useEffect } from 'react'
import { orders } from '../../data/data.js'
import NewOrderTableBody from '../NewOrderTableBody'
import NewOrderFooter from '../NewOrderFooter'
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
        materialId: null,
        model: '',
        importance: 1,
        amount: 1,
        additionalInfo: '',
        class: ''
      }
    ]
    : order.materials;
  return { materials: materials }
}

const NewOrderContent = (props) => {
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
        dispatch({ type: 'reset', payload: current })
    }, [current, props.stateRef])
  return (
    <div className="modal-content-new-order">
      <div>
        <div className="new-order-header">
          <div>
            <label htmlFor="destination">Təyinatı</label>
            <br />
            <select type="text">
              <option>Informasiya Texnologiyaları</option>
              <option>Təsərrüfat</option>
              <option>Təmir</option>
            </select>
          </div>
          <div>
            <label htmlFor="deadline">Deadline</label>
            <br />
            <input name="deadline" required={true} type="date" />
          </div>
        </div>
      </div>
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
        <NewOrderTableBody dispatch={dispatch} materials={state.materials} stateRef={props.stateRef} />
      </ul>
      <NewOrderFooter />
      <div className="send-order">
        Göndər
      </div>
    </div>
  )
}
export default NewOrderContent