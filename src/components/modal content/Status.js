import React, { useEffect, useState } from 'react'
import {
  FaSearch,
  FaBox,
  FaCheck,
  FaBoxOpen,
  FaShoppingCart,
  FaTruck,
} from 'react-icons/fa'
import useFetch from '../../hooks/useFetch'
const getStyle = (active, current) => {
  const blinkingAnim = {
    animation: "anim-blinking 1.2s",
    animationIterationCount: "infinite"
  }
  const style = { backgroundColor: active ? "#0F9D58" : "gainsboro" }
  if (current)
    return { ...style, ...blinkingAnim }
  else
    return style
}

const Status = (props) => {
  const [stage, setStage] = useState(1)
  const fetchGet = useFetch("GET")
  useEffect(() => {
    fetchGet("http://192.168.0.182:54321/api/order-state/" + props.id)
      .then(resp => {
        let stage = 1
        if (resp) {
          const { result, parent_result: parentResult } = resp[0];
          if (resp[0].is_confirmed)
            stage = 2
          if (parentResult !== null && parentResult >= 0)
            stage = 3
          if (result === 77)
            stage = 4
          if (parentResult === 25 || result === 25)
            stage = 5
          if (result === 20 || result === 44)
            stage = 6
          if (result === 99)
            stage = 7
          setStage(stage)
        }
      })
      .catch(ex => console.log(ex))
  }, [fetchGet, props.id])
  return (
    <>
      <div className='status-container'>
        <div className='icon-container' style={getStyle(true, stage === 1)}>
          <FaSearch size='30' title="Baxılır" color='white' />
        </div>
        <div style={getStyle(stage > 1, false)}></div>
        <div className='icon-container' style={getStyle(stage > 1, stage === 2)}>
          <FaBoxOpen size='30' title="Anbarda" color='white' />
        </div>
        <div style={getStyle(stage > 2, false)}></div>
        <div className='icon-container' style={getStyle(stage > 2, stage === 3)}>
          <FaShoppingCart size='30' title="Qiymət Araşdırması" color='white' />
        </div>
        <div style={getStyle(stage > 3, false)}></div>
        <div className='icon-container' style={getStyle(stage > 3, stage === 4)}>
          <FaTruck size='30' title="Yolda" color='white' />
        </div>
        <div style={getStyle(stage > 4, false)}></div>
        <div className='icon-container' style={getStyle(stage > 4, stage === 5)}>
          <FaBox size='30' title="Anbarda" color='white' />
        </div>
        <div style={getStyle(stage > 5, false)}></div>
        <div className='icon-container' style={getStyle(stage > 5, stage === 6)}>
          <FaCheck size='30' title="Təhvil verilmişdir" color='white' />
        </div>
      </div>
    </>
  )
}
export default Status
