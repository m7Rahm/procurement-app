import React, { useEffect, useRef, useState } from 'react'
import NewOrderTableRow from './NewOrderTableRow'
import NewOrderTableRowAdd from './NewOrderTableRowAdd'
const NewOrderTableBody = (props) => {
  const modelsListRef = useRef(null);
  const { orderInfo, glCategories, handleSendClick } = props;
  const { orderType, structure } = orderInfo;
  const [materials, setMaterials] = useState([
    {
      id: Date.now(),
      materialId: '',
      code: '',
      approx_price: 0,
      additionalInfo: '',
      class: '',
      subGlCategory: '-1',
      count: 1,
      isService: 0
    }
  ]);
  const onSendClick = () => {
    handleSendClick(materials)
  }
  useEffect(() => {
    setMaterials(prev => prev.filter(material => material.isService === orderType))
  }, [orderType])
  return (
    <>
      <ul className="new-order-table">
        <li>
          <div>#</div>
          <div>Sub-Gl Kateqoriya</div>
          <div>Məhsul</div>
          <div style={{ maxWidth: " 60px" }}>Qalıq</div>
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
                materialid={material.id}
                className={material.class}
                subGlCategory={material.subGlCategory}
                structure={structure}
                count={material.count}
                subGlCategories={glCategories.sub}
                modelsListRef={modelsListRef}
                additionalInfo={material.additionalInfo}
                department={material.department}
              />
            )
          })
        }
        <NewOrderTableRowAdd setMaterials={setMaterials} />
      </ul>
      <div className="send-order" style={{ cursor: props.active ? 'pointer' : 'not-allowed' }} onClick={onSendClick}>
        Göndər
      </div>
    </>
  )
}
export default React.memo(NewOrderTableBody)
