import React, { useState, Suspense } from 'react';
import Modal from './Modal'
import {
	FaUndo
} from 'react-icons/fa'
import VisaContentMaterials from './VisaContentMaterials'
import VisaContentHeader from './VisaContentHeader';


const OrderContentProtected = (props) => {
	// console.log(props.current);
	const current = props.current;
	const Component = props.footerComponent
	// const senderid = props.current.senderid;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState(null);
	const [updatedContent, setUpdatedContent] = useState({})
	const handleModalClose = () => {
		setIsModalOpen(false)
	}
	const currentState = updatedContent.id === current[0].id
		? updatedContent
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
	const updateContent = (recs, updatedCtnt) => {
		props.sendNotification(recs);
		setUpdatedContent(updatedCtnt)
	}
	return (
		props.current &&
		<>
			<>
				{
					isModalOpen &&
					<Suspense fallback={
						<div className="loading">
							<FaUndo size="50" color="#a4a4a4" />
						</div>
					}>
						<Modal canBeClosed={true} number={current[0].ord_numb} changeModalState={handleModalClose}>
							{modalContent}
						</Modal>
					</Suspense>
				}
				<VisaContentHeader
					deadline={current[0].deadline}
					updateContent={updateContent}
					setIsModalOpen={setIsModalOpen}
					current={current}
					version={props.current[0].emp_version_id}
					currentState={currentState}
					handleEditClick={handleEditClick}
					// assignment={current[0].assignment}
					intention={current[0].intention}
					orderNumb={current[0].ord_numb}
				/>
			</>
			<VisaContentMaterials orderContent={props.current} />
			<Component
				sendNotification={props.sendNotification}
				current={props.current[0]}
				orderContent={currentState}
				handleEditClick={handleEditClick}
				setIsModalOpen={setIsModalOpen}
				updateContent={updateContent}
			/>
		</>
	)
}
export default OrderContentProtected
