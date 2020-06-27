import React from 'react'
import {
  FaExclamation
} from 'react-icons/fa'
const NewOrderContent = (props) => {
  return (
    <div className="modal-content-new-order">
      <div>
        <div className="new-order-header">
          <div>
            <label htmlFor="destination">Təyinatı</label>
            <br />
            <select type="text">
              <option>Info</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
          <div>
            <label htmlFor="deadline">Deadline</label>
            <br />
            <input name="deadline" required={true} type="date" />
          </div>
        </div>
        {/* <label htmlFor="material">Material</label>
        <select type="text">
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
        <br />
        <label htmlFor="model">Model</label>
        <input name="model" type="text" />
        <br />
        <label htmlFor="more info">Əlavə məlumat</label>
        <input name="more info" type="text" />
        <label htmlFor="amount">Say</label>
        <input name="amount" type="text" />
        <br /> */}
      </div>
      <table className="new-order-table">
        <thead>
          <tr>
            <td>#</td>
            <td>Material</td>
            <td>Model</td>
            <td>Vaciblik</td>
            <td>Say</td>
            <td>Əlavə məlumat</td>
            <td> </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>
              <select>
                <option>Notebook</option>
                <option>Hard Drive</option>
                <option>Mouse</option>
              </select>
            </td>
            <td><input type="text" placeholder="Model" /></td>
            <td style={{ position: 'relative', overflow: 'hidden' }}>
              <ul style={{ margin: '0px', listStyleType: 'none', position: 'absolute', top: '0', left: '0' }}>
                <li style={{height: '26px', padding: '5px'}}>
                  <FaExclamation color="#ff4a4a" />
                </li>
                <li>
                  <FaExclamation color="#ff4a4a" />
                  <FaExclamation color="#ff4a4a" />
                </li>
                <li>
                  <FaExclamation color="#ff4a4a" />
                  <FaExclamation color="#ff4a4a" />
                  <FaExclamation color="#ff4a4a" />
                </li>
              </ul>
            </td>
            <td>50</td>
            <td>https://facebook.com</td>
            <td> </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
export default NewOrderContent