import React, { useRef } from 'react'
import NewOrderTableRow from './NewOrderTableRow'
import NewOrderTableRowAdd from './NewOrderTableRowAdd'
const NewOrderTableBody = (props) => {
  const modelsListRef = useRef(null);
  const glCategories = props.glCategories;
  const parentGlCategories = glCategories.filter(glCategory => glCategory.dependent_id === null);
  const subGlCategories = glCategories.filter(glCategory => glCategory.dependent_id !== null)
  const { state, dispatch } = props;
  const { orderType, materials, structure } = state;
  return (
    <>
      {
        materials.map((material, index) => {
          return (
            <NewOrderTableRow
              dispatch={dispatch}
              index={index}
              orderType={orderType}
              material={material}
              key={material.id}
              structure={structure}
              parentGlCategories={parentGlCategories}
              subGlCategories={subGlCategories}
              modelsListRef={modelsListRef}
            />
          )
        })
      }
      <NewOrderTableRowAdd dispatch={dispatch} />
    </>
  )
}
export default NewOrderTableBody
