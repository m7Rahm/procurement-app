import React, { useState, Suspense } from 'react';
import Modal from './Modal'
import {
	FaEdit,
	FaUndo,
	FaCheck,
	FaTimes
} from 'react-icons/fa'
import VisaContentFooter from './VisaContentFooter'
import VisaContentMaterials from './VisaContentMaterials'
const NewOrderContent = React.lazy(() => import('./modal content/NewOrder'));


const OrderContentProtected = (props) => {
	const current = props.current;
	// const senderid = props.current.senderid;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState(null);
	const [updatedContent, setUpdatedContent] = useState({})
	const handleModalClose = () => {
		setIsModalOpen(false)
	}
	const currentState = updatedContent.id === current[0].id
	?  updatedContent
	: {
		actDateTime: current[0].act_date_time,
		result: current[0].result,
		comment: current[0].comment
	}
	// console.log(props.current);
	const handleEditClick = (content) => {
		setModalContent(_ => content);
		setIsModalOpen(true);
	}
	return (
		props.current  &&
		<>
			<div>
				{
					isModalOpen &&
					<Suspense fallback={
						<div className="loading">
							<FaUndo size="50" color="#a4a4a4" />
						</div>
					}>
						<Modal number={current[0].ord_numb} changeModalState={handleModalClose}>
							{modalContent}
						</Modal>
					</Suspense>
				}
				<div className="protex-order-header-container">
					<h1>
						{`Sifariş № ${current[0].ord_numb}`}
						{
							current[0].intention === 1 &&
							<FaEdit onClick={() => handleEditClick((props) => <NewOrderContent content={props.current} {...props} />)} title="düzəliş et" size="20" />
						}
					</h1>
					{
						currentState.result === 1 ?
							<span>
								{currentState.actDateTime}
								<FaCheck size="30" title="Təsdiq" color="#34A853" />
							</span>
							: currentState.result !== null ?
								<span>
									{currentState.actDateTime}
									<FaTimes title="Etiraz" size="30" color="#EA4335" />
								</span>
								: ''
					}
				</div>
				<div className="new-order-header">
					<div>
						<label htmlFor="destination" color="#555555">Təyinatı</label>
						<br />
						<div style={{ clear: 'both', fontSize: '22px', fontWeight: '555', color: 'gray' }}>{props.current[0].assignment}</div>
					</div>
					<div>
						<label htmlFor="deadline" color="#555555">Deadline</label>
						<div style={{ clear: 'both', fontSize: '22px', fontWeight: '550', color: 'gray' }}>{props.current[0].deadline}</div>
					</div>
				</div>
			</div>
			<VisaContentMaterials orderContent={props.current} />
			<VisaContentFooter
				current={props.current[0].ord_numb}
				version={props.current[0].emp_version_id}
				orderContent={currentState}
				handleEditClick={handleEditClick}
				setIsModalOpen={setIsModalOpen}
				setUpdatedContent={setUpdatedContent}
			/>
		</>
	)
}
export default OrderContentProtected
