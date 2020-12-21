import React, { useState, Suspense } from 'react';
import Modal from '../../Misc/Modal'
import VisaContentMaterials from '../../Common/VisaContentMaterials'
import VisaContentHeader from './VisaContentHeader'
import Loading from '../../Misc/Loading'

const OrderContentProtected = (props) => {
	const { current, canProceed, setVisa, footerComponent: Component, sendNotification } = props;
	const forwardType = current[0].forward_type;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState(null);
	const handleModalClose = () => {
		setIsModalOpen(false)
	}
	const handleEditClick = (content) => {
		setModalContent(_ => content);
		setIsModalOpen(true);
	}
	const updateContent = (recs, updatedCtnt) => {
		sendNotification(recs);
		setVisa(prev => prev.map((row, index) => index === 0 ? ({...row, ...updatedCtnt }) : row));
		setIsModalOpen(false);
	}
	return (
		current &&
		<>
			<>
				{
					isModalOpen &&
					<Suspense fallback={<Loading />}>
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
					version={current[0].emp_version_id}
					handleEditClick={handleEditClick}
					intention={current[0].intention}
					orderNumb={current[0].ord_numb}
				/>
			</>
			<VisaContentMaterials
				orderContent={current}
				canProceed={canProceed}
				forwardType={forwardType}
			/>
			<Component
				sendNotification={sendNotification}
				current={current[0]}
				canProceed={canProceed}
				handleEditClick={handleEditClick}
				setIsModalOpen={setIsModalOpen}
				updateContent={updateContent}
			/>
		</>
	)
}
export default OrderContentProtected
