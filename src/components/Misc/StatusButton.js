import React, { useState } from 'react'
const StatusButton = (props) => {
	const [status, setStatus] = useState(props.status)
	const changeStatus = () => {
		setStatus(prev => {
            const stat = !prev ? 1 : 0;
            props.updateFunc(props.id, stat);
			return !prev
		})
	}
	return (
		<div
			onClick={changeStatus}
			title={status ? 'deaktiv et' : 'aktivləşdir'}
			style={{
				borderRadius: '50%',
				padding: '5px',
                cursor: 'pointer',
                margin: 'auto',
				backgroundColor: status ? 'green' : 'red',
				width: '10px',
				height: '10px'
			}}>
		</div>
	)
}
export default StatusButton