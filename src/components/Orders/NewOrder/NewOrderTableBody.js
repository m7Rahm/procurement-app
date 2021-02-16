import React, { useRef, useState, useMemo } from 'react'
import NewOrderTableRow from './NewOrderTableRow'
import NewOrderTableRowAdd from './NewOrderTableRowAdd'
const NewOrderTableBody = (props) => {
  const modelsListRef = useRef(null);
  const { orderInfo, glCategories, handleSendClick } = props;
  const { orderType, structure, glCategory } = orderInfo;
  const subGlCategories = useMemo(() => glCategories.sub.filter(category => category.dependent_id === Number(glCategory)), [glCategory, glCategories.sub]);
  const [materials, setMaterials] = useState([
    {
      id: Date.now(),
      materialId: '',
      code: '',
      approx_price: 0,
      additionalInfo: '',
      class: '',
      subGlCategory: '',
      count: 1
    }
  ]);
  return (
    <>
      <ul className="new-order-table">
        <li>
          <div>#</div>
          <div>Sub-Gl Kateqoriya</div>
          <div>Məhsul</div>
          <div style={{ width: '170px', maxWidth: '200px' }}>Kod</div>
          <div style={{ maxWidth: '140px' }}>Say</div>
          <div>Kurasiya</div>
          <div>Büdcə</div>
          <div>Əlavə məlumat</div>
          <div></div>
        </li>
        {
          materials.map((material, index) => {
            return (
              <NewOrderTableRow
                setMaterials={setMaterials}
                index={index}
                orderType={orderType}
                material={material}
                key={material.id}
                structure={structure}
                subGlCategories={subGlCategories}
                modelsListRef={modelsListRef}
              />
            )
          })
        }
        <NewOrderTableRowAdd setMaterials={setMaterials} />
      </ul>
      <div className="send-order" onClick={() => handleSendClick(materials)}>
        Göndər
      </div>
    </>
  )
}
export default React.memo(NewOrderTableBody)
