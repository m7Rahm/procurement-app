import React, { useEffect, useState, useRef } from 'react'
import NewOrderTableRow from './NewOrderTableRow'
import NewOrderTableRowAdd from './NewOrderTableRowAdd'
import NewCategory from './modal content/NewCategory'
const NewOrderTableBody = (props) => {
  const [activeLinkIndex, setActiveLinkIndex] = useState(null);
  const [materials, setMaterials] = useState([]);
  const modelsListRef = useRef(null)
  const [sysParamsModlaState, setSysParamsModalState] = useState(false)
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
    }, [activeLinkIndex]
  )
  useEffect(() => {
    fetch('http://172.16.3.101:54321/api/get-material-categories')
    .then(resp => resp.json())
    .then(respJ => setMaterials(respJ))
    .catch(ex => console.log(ex))
  }, []);
  return (
    <>
      {
        props.materials.map((material, index) => {
          const isActive = material.id === activeLinkIndex ? true : false;
          return (
            <NewOrderTableRow
              dispatch={props.dispatch}
              index={index}
              setSysParamsModalState={setSysParamsModalState}
              materials={materials}
              setMaterials={setMaterials}
              class={material.class}
              id={material.id}
              materialId={material.materialId}
              key={material.id}
              isActive={isActive}
              amount={material.amount}
              model={material.model}
              additionalInfo={material.additionalInfo}
              importance={material.importance}
              modelsListRef={modelsListRef}
            />
          )
        })
      }
      <NewOrderTableRowAdd dispatch={props.dispatch} />
      {
        sysParamsModlaState &&
        <NewCategory
          setMaterials={setMaterials}
          setSysParamsModalState={setSysParamsModalState}
          materials={materials}
        />
      }
    </>
  )
}
export default NewOrderTableBody
