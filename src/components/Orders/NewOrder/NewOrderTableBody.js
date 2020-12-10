import React, { useRef } from 'react'
import NewOrderTableRow from './NewOrderTableRow'
import NewOrderTableRowAdd from './NewOrderTableRowAdd'
const NewOrderTableBody = (props) => {
  const modelsListRef = useRef(null);
  const categories = props.categories;
  const state = props.state;
  const { orderType, materials, structure } = state;
  return (
    <>
      {
        materials.map((material, index) => {
          return (
            <NewOrderTableRow
              dispatch={props.dispatch}
              index={index}
              orderType={orderType}
              material={material}
              key={material.id}
              structure={structure}
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
