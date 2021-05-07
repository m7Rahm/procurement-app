import React, { useContext, useState } from 'react';
import Modal from '../../Misc/Modal'
import VisaContentMaterials from '../../Common/VisaContentMaterials'
import VisaContentHeader from './VisaContentHeader'
import { WebSocketContext } from '../../../pages/SelectModule'
const OrderContentProtected = (props) => {
	const { current, canProceed, setVisa, footerComponent: Component } = props;
	const forwardType = current[0].forward_type;
	const webSocket = useContext(WebSocketContext);
	const [modalContent, setModalContent] = useState({ visible: false, content: null });
	const handleModalClose = () => {
		setModalContent(prev => ({ ...prev, visible: false }));
	}
	const handleEditClick = (content) => {
		setModalContent({ visible: true, content, title: "Sifariş № ", number: current[0].ord_numb });
	}
	const updateContent = (updatedCtnt, receivers, originid) => {
		const message = JSON.stringify({
			message: "notification",
			receivers: [...receivers.map(receiver => ({ id: receiver, notif: "newOrder" })), { id: originid, notif: "simpleNotification" }],
			data: undefined
		})
		webSocket.send(message)
		setModalContent(prev => ({ ...prev, visible: false }))
		setVisa(prev => prev.map((row, index) => index === 0 ? ({ ...row, ...updatedCtnt }) : row));
	}
	const forwardDoc = (receivers) => {
		setModalContent({ visible: false, content: null })
		const message = JSON.stringify({
			message: "notification",
			receivers: receivers.map(receiver => ({ id: receiver.id, notif: "newOrder" })),
			data: undefined
		})
		webSocket.send(message)
	}
	return (
		current &&
		<>
			<>
				{
					modalContent.visible &&
					<Modal canBeClosed={true} title="Sifariş № " number={current[0].ord_numb} changeModalState={handleModalClose}>
						{modalContent.content}
					</Modal>
				}
				<VisaContentHeader
					updateContent={updateContent}
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
				current={current[0]}
				canProceed={canProceed}
				forwardDoc={forwardDoc}
				handleEditClick={handleEditClick}
				updateContent={updateContent}
			/>
		</>
	)
}
export default OrderContentProtected
