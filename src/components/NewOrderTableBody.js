import React, { useEffect, useState, useRef } from 'react'
import NewOrderTableRow from './NewOrderTableRow'
import NewOrderTableRowAdd from './NewOrderTableRowAdd'

const NewOrderTableBody = (props) => {
  const [activeLinkIndex, setActiveLinkIndex] = useState(null);
  const modelsListRef = useRef(null);
  const categories = props.categories;
  const state = props.state;
  const materials = state.materials;
  // const [sysParamsModlaState, setSysParamsModalState] = useState(false)
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
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   fetch('http://172.16.3.101:54321/api/get-material-categories', {
  //     headers: {
  //       'Authorization': 'Bearer ' + token
  //     }
  //   })
  //   .then(resp => resp.json())
  //   .then(respJ => setMaterials(respJ))
  //   .catch(ex => console.log(ex))
  //   fetch('http://172.16.3.101:54321/api/get-units', {
  //     headers: {
  //       'Authorization': 'Bearer ' + token
  //     }
  //   })
  //   .then(resp => resp.json())
  //   .then(respJ => setUnits(respJ))
  //   .catch(ex => console.log(ex))
  // }, []);
  return (
    <>
      {
        materials.map((material, index) => {
          const isActive = material.id === activeLinkIndex ? true : false;
          return (
            <NewOrderTableRow
              dispatch={props.dispatch}
              index={index}
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
