import React, { useState } from 'react'

const VisaCard = (props) => {
    const [checked, setChecked] = useState(false);
    const handleCheck = (e) => {
        const prevAmount = props.checkedAmount.current;
        const checked = e.target.checked;
        setChecked(_ => checked);
        props.checkedAmount.current = checked ? props.checkedAmount.current + 1 : props.checkedAmount.current - 1;
        if (prevAmount * props.checkedAmount.current === 0) {
            if (props.iconsPanel.current) {
                props.iconsPanel.current.classList.toggle('icons-panel-hide');
                props.iconsPanel.current.addEventListener('animationend', () => props.setIconsVisible(prev => !prev))
            }
            else
                props.setIconsVisible(prev => !prev)
        }
    }
    // console.log(props);
    return (
        <li onClick={() => props.setActive(_ => ({ number: props.number, senderid: props.senderid }))} style={{ background: props.active ? 'skyblue' : '' }}>
            <div style={{ height: 'inherit' }}>
                {
                    !props.isOpened &&
                    <div style={{ width: '3px', float: 'right', height: '100%', background: 'steelblue' }}></div>
                }
                <div style={{ padding: '5px', height: '100%' }}>
                    <div style={{ height: '100%', float: 'left', padding: '15px 15px 0px 10px' }}>
                        <input checked={checked} type="checkbox" onChange={handleCheck} style={{ padding: '3px' }} ></input>
                    </div>
                    <div style={{ height: '29px', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '17px', fontWeight: 200 }}>
                            {props.from}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 200, verticalAlign: 'baseline', color: 'gray' }}>
                            {props.date}
                        </span>
                    </div>
                    <div style={{ height: '15px', position: 'relative' }}>
                        <span title={`deadline: ${props.deadline}`} style={{ background: 'whitesmoke', fontSize: '12px', color: 'steelblue', position: 'absolute', right: 0, padding: '0px 5px', zIndex: 0, fontWeight: 700 }}>
                            {props.deadline}
                        </span>
                        <span title={props.category} style={{ fontSize: '12px', color: 'steelblue', float: 'left', fontWeight: '700' }}>
                            {props.category}
                        </span>
                    </div>
                    <div style={{ height: '23px', paddingTop: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'gray', float: 'left', position: 'relative', zIndex: 0, background: 'whitesmoke', padding: '0px 5px 0px 0px' }}>
                            {props.remark}
                        </span>
                    </div>
                </div>
            </div>
        </li>

    )
}
export default React.memo(VisaCard)