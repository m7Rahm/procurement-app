import React from 'react'
import NewOrderTableBody from '../NewOrderTableBody'
const NewOrderContent = (props) => {
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
      <table className="new-order-table">
        <thead>
          <tr>
            <td>#</td>
            <td>Material</td>
            <td>Model</td>
            <td style={{ width: '170px', maxWidth: '200px' }}>Vaciblik</td>
            <td style={{ width: '120px' }}>Say</td>
            <td>Əlavə məlumat</td>
            <td> </td>
          </tr>
        </thead>
        <tbody>
          <NewOrderTableBody />
        </tbody>
      </table>
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