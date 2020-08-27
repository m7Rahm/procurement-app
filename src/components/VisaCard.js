import React, { useRef } from 'react'

const VisaCard = (props) => {
	const stateRef = useRef(null);
	// const [checked, setChecked] = useState(false);
	const checkBoxRef = useRef(null)
	const isReadRef = useRef(null);
	const handleCheck = (e) => {
		const prevAmount = props.checkedAmount.current.length;
		const checked = e.target.checked;
		console.log(props)
		if (checked)
			props.checkedAmount.current.push({
				id: props.id,
				val: props.id,
				isPinned: props.isPinned,
				isRead: props.isOpened,
				number: props.number,
				empVersion: props.empVersion
			})
		else {
			for (let i = 0; i < props.checkedAmount.current.length; i++)
				if (props.checkedAmount.current[i].id === props.id)
					props.checkedAmount.current.splice(i, 1);
		}
		// console.log(props.checkedAmount.current);
		if (prevAmount * props.checkedAmount.current.length === 0) {
			if (props.checkedAmount.current.length === 0) {
				props.iconsPanelRef.current.classList.toggle('icons-panel-hide');
				props.iconsPanelRef.current.addEventListener('animationend', () => {
					props.setIconsVisible(false);
					props.iconsPanelRef.current.classList.remove('icons-panel-hide');
				})
			}
			else
				props.setIconsVisible(prev => !prev)
		}
	}

	const handleClick = () => {
		props.handleCardClick(isReadRef, props, stateRef)
	}
	return (
		<li onClick={handleClick} ref={stateRef}>
			<div style={{ height: 'inherit' }}>
				<div ref={isReadRef} style={{ width: '3px', float: 'right', height: '100%', background: 'steelblue', display: !props.isOpened ? 'block' : 'none' }}></div>
				<div style={{ padding: '5px', height: '100%' }}>
					<div style={{ height: '100%', float: 'left', padding: '15px 15px 0px 10px' }}>
						<input ref={checkBoxRef}  type="checkbox" onChange={handleCheck} style={{ padding: '3px' }} ></input>
					</div>
					<div style={{ height: '29px', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<span style={{ fontSize: '17px', fontWeight: 200 }}>
							{props.from ? props.from : '[DRAFT]'}
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