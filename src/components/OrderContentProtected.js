import React, { useState, Suspense } from 'react';
import Modal from './Modal'
import {
	FaUndo
} from 'react-icons/fa'
import VisaContentMaterials from './VisaContentMaterials'
import VisaContentHeader from './VisaContentHeader';


const OrderContentProtected = (props) => {
	// console.log(props);
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
						<Modal number={current[0].ord_numb} changeModalState={handleModalClose}>
							{modalContent}
						</Modal>
					</Suspense>				
				}
					<VisaContentHeader
						deadline={current[0].deadline}
						setUpdatedContent={setUpdatedContent}
						setIsModalOpen={setIsModalOpen}
						current={current}
						version={props.current[0].emp_version_id}
						currentState={currentState}
						handleEditClick={handleEditClick}
						assignment={current[0].assignment}
						intention={current[0].intention}
						orderNumb={current[0].ord_numb}
					/>
			</>
			<VisaContentMaterials orderContent={props.current} />
			<Component
				current={props.current[0].ord_numb}
				version={props.current[0].emp_version_id}
				orderContent={currentState}
				intention={props.current[0].intention}
				handleEditClick={handleEditClick}
				setIsModalOpen={setIsModalOpen}
				setUpdatedContent={setUpdatedContent}
			/>
		</>
	)
}
export default OrderContentProtected
