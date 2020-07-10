import React, { useReducer } from 'react'
import { orders } from '../../data/data.js'
import NewOrderTableBody from '../NewOrderTableBody'

const newOrderReducer = (state, action) => {
  const type = action.type;
  switch (type) {
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
            ? {...material,
              amount: action.payload.operation === 'dec'
              ? parseInt(material.amount) - 1
              : parseInt(material.amount) + 1}
            : material
          )
        }
      }
    case 'addRow':
      return {...state, materials: [...state.materials, action.payload.rowData]}
    default:
      return state
  }

}
const NewOrderContent = (props) => {
  const current = props.current;
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
  const [state, dispatch] = useReducer(newOrderReducer, { materials: materials })
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
      <div className="new-order-footer-wrapper">
        <textarea placeholder="Sifariş barədə əlavə qeydlər..." />
        <div className="forwarded-person">
          <label htmlFor="forwardedPerson">Yönləndirilən şəxs</label>
          <br />
          <select name="forwardedPerson">
            <option>
              Rahman Mustafayev
        </option>
            <option>
              Bill Clinton
        </option>
            <option>
              Bill Gates
        </option>
          </select>
        </div>
      </div>
      <div className="send-order">
        Göndər
      </div>
    </div>
  )
}
export default NewOrderContent