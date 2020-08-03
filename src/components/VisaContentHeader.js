import React from 'react'
import {
	FaEdit,
	FaCheck,
	FaTimes
} from 'react-icons/fa'
const NewOrderContent = React.lazy(() => import('./modal content/NewOrder'));

const VisaContentHeader = (props) => {
	const version = props.version;
	const current = props.current;
	const closeUpdateModal = (respJ) => {
		props.setIsModalOpen(false);
		props.setUpdatedContent({
			id: respJ[0].id,
			actDateTime: respJ[0].act_date_time,
			result: respJ[0].result,
			comment: respJ[0].comment
		})
	}
	return (
		<>
			<div className="protex-order-header-container">
				<h1>
					{`Sifariş № ${props.orderNumb}`}
					{
						props.intention === 1 && !props.currentState.result &&
						<FaEdit onClick={() => props.handleEditClick((props) => <NewOrderContent closeUpdateModal={closeUpdateModal} version={version} content={current} {...props} />)} title="düzəliş et" size="20" />
					}
				</h1>
				{
					props.currentState.result === 1 ?
						<span>
							{props.currentState.actDateTime}
							<FaCheck size="30" title="Təsdiq" color="#34A853" />
						</span>
						: props.currentState.result !== null ?
							<span>
								{props.currentState.actDateTime}
								<FaTimes title="Etiraz" size="30" color="#EA4335" />
							</span>
							: ''
				}
			</div>
			<div className="new-order-header">
				<div>
					<label htmlFor="destination" color="#555555">Təyinatı</label>
					<br />
					<div style={{ clear: 'both', fontSize: '22px', fontWeight: '555', color: 'gray' }}>{props.assignment}</div>
				</div>
				<div>
					<label htmlFor="deadline" color="#555555">Deadline</label>
					<div style={{ clear: 'both', fontSize: '22px', fontWeight: '550', color: 'gray' }}>{props.deadline}</div>
				</div>
			</div>
		</>
	)
}
export default VisaContentHeader