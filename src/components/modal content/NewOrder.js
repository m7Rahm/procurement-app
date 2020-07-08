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
          <NewOrderTableBody current={props.current} />
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