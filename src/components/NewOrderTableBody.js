import React, { useEffect, useState, useRef } from 'react'
import NewOrderTableRow from './NewOrderTableRow'
import NewOrderTableRowAdd from './NewOrderTableRowAdd'
const NewOrderTableBody = (props) => {
  const [activeLinkIndex, setActiveLinkIndex] = useState(null);
  const modelsListRef = useRef(null);
  const categories = props.categories;
  const state = props.state;
  const { orderType, materials } = state;
  useEffect(() => {
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
    }, [activeLinkIndex]
  )
  return (
    <>
      {
        materials.map((material, index) => {
          const isActive = material.id === activeLinkIndex ? true : false;
          return (
            <NewOrderTableRow
              dispatch={props.dispatch}
              index={index}
              orderType={orderType}
              material={material}
              key={material.id}
              isActive={isActive}
              categories={categories}
              modelsListRef={modelsListRef}
            />
          )
        })
      }
      <NewOrderTableRowAdd state={state} dispatch={props.dispatch} />
    </>
  )
}
export default NewOrderTableBody
