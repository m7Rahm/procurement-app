import React, { useEffect, useState } from 'react'
import NewOrderTableRow from './NewOrderTableRow'
const NewOrderTableBody = (props) => {
  const [activeLinkIndex, setActiveLinkIndex] = useState(null)
  useEffect(
    () => {
      const handleOnOuterClick = (e) => {
        const target = e.target.closest('div');
        console.log(target.id)
        if (target) {
          const activeOptions = (!target.classList.contains('importance-div') || activeLinkIndex === parseInt(target.id))
            ? null
            : parseInt(target.id);
            setActiveLinkIndex(_ => activeOptions);
        }
      }
      document.addEventListener('click', handleOnOuterClick, false);
      return () => document.removeEventListener('click', handleOnOuterClick, false)
    }
    , [activeLinkIndex]
  )
  const materialsList = [0]
  return (
    materialsList.map((_, index) => {
      const isActive = index === activeLinkIndex ? true : false
      return <NewOrderTableRow index={index} key={index} isActive={isActive} />
    })
  )
}
export default NewOrderTableBody