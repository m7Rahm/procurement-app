import React, { useEffect, useState } from 'react'
import NewOrderTableRow from './NewOrderTableRow'
import shortId from 'shortid'
import NewOrderTableRowAdd from './NewOrderTableRowAdd'
const NewOrderTableBody = (props) => {
  const [activeLinkIndex, setActiveLinkIndex] = useState(null)
  const [materialsList, setMaterialsList] = useState([
    {
      id: shortId.generate(),
      materialId: null,
      model: '',
      importance: 1,
      amount: 1,
      additionalInfo: '',
      class: ''
    }
  ])
  useEffect(
    () => {
      const handleOnOuterClick = (e) => {
        const target = e.target.closest('div');
        // console.log(target.id)
        if (target) {
          const activeOptions = (!target.classList.contains('importance-div') || activeLinkIndex === target.id)
            ? null
            : target.id;
          setActiveLinkIndex(_ => activeOptions);
        }
      }
      document.addEventListener('click', handleOnOuterClick, false);
      return () => document.removeEventListener('click', handleOnOuterClick, false)
    }
    , [activeLinkIndex]
  )
  // console.log(materialsList)
  return (
    <>
      {
        materialsList.map((material, index) => {
          const isActive = material.id === activeLinkIndex ? true : false
          return (
            <NewOrderTableRow
              updateMaterialsList={setMaterialsList}
              index={index}
              class={material.class}
              id={material.id}
              key={material.id}
              isActive={isActive}
              amount={material.amount}
              model={material.model}
              additionalInfo={material.additionalInfo}
              importance={material.importance}
            />
          )
        })
      }
      <NewOrderTableRowAdd updateMaterialsList={setMaterialsList} />
    </>
  )
}
export default NewOrderTableBody