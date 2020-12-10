import React, { useState, Suspense, useEffect, useRef } from 'react';
import Modal from '../../Misc/Modal'
import VisaContentMaterials from '../../Common/VisaContentMaterials'
import VisaContentHeader from './VisaContentHeader'
import Loading from '../../Misc/Loading'

const OrderContentProtected = (props) => {
	const current = props.current;
	const Component = props.footerComponent;
	const forwardType = current[0].forward_type;
	const canProceed = useRef(current.reduce((prev, material) => ({ ...prev, [material.order_material_id]: true }), {}));
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState(null);
	const [currentState, setCurrentState] = useState(current[0])
	const handleModalClose = () => {
		setIsModalOpen(false)
	}
	useEffect(() => {
		setCurrentState(current[0]);
		canProceed.current = current.reduce((prev, material) => ({ ...prev, [material.order_material_id]: true }), {})
	}, [current])
	const handleEditClick = (content) => {
		setModalContent(_ => content);
		setIsModalOpen(true);
	}
	const updateContent = (recs, updatedCtnt) => {
		props.sendNotification(recs);
		setCurrentState(prev => ({ ...prev, ...updatedCtnt }));
		setIsModalOpen(false);
	}
	return (
		props.current &&
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
					version={props.current[0].emp_version_id}
					currentState={currentState}
					handleEditClick={handleEditClick}
					intention={current[0].intention}
					orderNumb={current[0].ord_numb}
				/>
			</>
			<VisaContentMaterials
				orderContent={props.current}
				canProceed={canProceed}
				forwardType={forwardType}
			/>
			<Component
				sendNotification={props.sendNotification}
				current={props.current[0]}
				canProceed={canProceed}
				orderContent={currentState}
				handleEditClick={handleEditClick}
				setIsModalOpen={setIsModalOpen}
				updateContent={updateContent}
			/>
		</>
	)
}
export default OrderContentProtected
