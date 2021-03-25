import React, { useRef } from 'react'
const isReadDivDisplay = (value) => !value ? 'block' : 'none'
const MiscDocCard = (props) => {
    const stateRef = useRef(null);
    const display = isReadDivDisplay(props.card.is_read);
    const handleClick = () => {
        const params = props.params;
        if(props.activeRef.current)
            props.activeRef.current.style.backgroundColor = "transparent";
        stateRef.current.style.backgroundColor = "skyblue";
        props.activeRef.current = stateRef.current;
        const active = Object.keys(params).reduce((prev, current) => prev = { ...prev, [current]: props.card[params[current]] }, {});
        props.setActive(active)
    }
    return (
        <li onClick={handleClick} ref={stateRef} >
            <div style={{ height: 'inherit' }}>
                <div style={{ width: '3px', float: 'right', height: '100%', background: 'steelblue', display: display }}></div>
                <div style={{ padding: '5px', height: '100%' }}>
                    <div style={{ height: '29px', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '17px', fontWeight: 200 }}>
                            {props.card.number}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 200, verticalAlign: 'baseline' }}>
                            {props.card.date_time_string}
                        </span>
                    </div>
                    <div style={{ height: '15px', position: 'relative' }}>
                    </div>
                    <div style={{ height: '23px', paddingTop: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'gray', float: 'left', position: 'relative', zIndex: 0, background: 'whitesmoke', padding: '0px 5px 0px 0px' }}>
                            {props.card.comment}
                        </span>
                    </div>
                </div>
            </div>
        </li>
    )
}
export default MiscDocCard