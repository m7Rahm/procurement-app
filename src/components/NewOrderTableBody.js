import React, { useEffect, useState } from 'react'
import NewOrderTableRow from './NewOrderTableRow'
import NewOrderTableRowAdd from './NewOrderTableRowAdd'
const NewOrderTableBody = (props) => {
  const [activeLinkIndex, setActiveLinkIndex] = useState(null);
  useEffect(
    () => {
      const handleOnOuterClick = (e) => {
        const target = e.target.closest('div');
        if (target) {
          const activeOptions = (!target.classList.contains('importance-div') || activeLinkIndex === target.id)
            ? null
            : target.id;
          setActiveLinkIndex(activeOptions);
        }
      }
      document.addEventListener('click', handleOnOuterClick, false);
      return () => document.removeEventListener('click', handleOnOuterClick, false)
    }
    , [activeLinkIndex]
  )
  return (
    <>
      {
        props.materials.map((material, index) => {
          const isActive = material.id === activeLinkIndex ? true : false;
          return (
            <NewOrderTableRow
              dispatch={props.dispatch}
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
      <NewOrderTableRowAdd dispatch={props.dispatch} />
    </>
  )
}
export default NewOrderTableBody
