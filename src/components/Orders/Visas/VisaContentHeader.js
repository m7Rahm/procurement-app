import React, { useContext } from 'react'
import {
	FaEdit,
	FaCheck,
	FaTimes
} from 'react-icons/fa'
import {
	IoIosWarning
} from 'react-icons/io'
import VisaVersionsContainer from './VisaVersionsContainer'
import { TokenContext } from '../../../App'
import useFetch from '../../../hooks/useFetch'
const EditOrderRequest = React.lazy(() => import('../../modal content/EditOrderRequest'));

const VisaContentHeader = (props) => {
	const { version, current, orderNumb, handleEditClick, updateContent } = props;
	const visaGenInfo = current[0];
	const tranid = current[0].id;
	const tokenContext = useContext(TokenContext);
	const userData = tokenContext[0].userData;
	const fetchPost = useFetch("POST");
	const canEditRequest = userData.previliges.find(prev => prev === 'Sifarişi redaktə etmək');
	const closeModal = (respJ, receivers) => {
		updateContent({
			id: respJ[1].id,
			act_date_time: respJ[1].act_date_time,
			result: respJ[1].result,
			comment: respJ[1].comment
		}, receivers, respJ[1].origin_emp_id)
	};
	const editOrderAndApprove = (data, receivers, setOperationResult) => {
		fetchPost(`http://192.168.0.182:54321/api/edit-accept-order-req/${tranid}`, data)
			.then(respJ => {
				if (respJ[0].result === 'success')
					closeModal(respJ, receivers.map(receiver => receiver.id))
				else if (respJ[0].error)
					setOperationResult({ visible: true, desc: respJ[0].error })
				else
					throw new Error('Error Performing operation')
			})
			.catch(ex => console.log(ex))
	}
	const showOrderVersions = () => {
		handleEditClick((props) =>
			<VisaVersionsContainer
				tranid={tranid}
				version={version}
				content={current}
				doneEditing={updateContent}
				orderNumb={orderNumb}
				{...props}
			/>
		)
	}
	const showEditOrderContent = () => handleEditClick((props) =>
		<EditOrderRequest
			version={version}
			view='procurement'
			content={current}
			editOrderAndApprove={editOrderAndApprove}
			{...props}
		/>
	)
	return (
		<>
			<div className="protex-order-header-container">
				<h1>
					{`Sifariş № ${orderNumb}`}
					{
						canEditRequest && !visaGenInfo.result && visaGenInfo.can_influence &&
						<FaEdit onClick={showEditOrderContent}
							title="düzəliş et"
							size="20"
						/>
					}
				</h1>
				{
					visaGenInfo.result === 1
						? <span>
							{visaGenInfo.act_date_time}
							<FaCheck size="30" title="Təsdiq" color="#34A853" />
						</span>
						: visaGenInfo.result === -1
							? <span>
								{visaGenInfo.act_date_time}
								<FaTimes title="Etiraz" size="30" color="#EA4335" />
							</span>
							: visaGenInfo.result === 3
								? <span>
									{visaGenInfo.act_date_time}
									<IoIosWarning onClick={showOrderVersions} title="Dəyişikliklərə bax" cursor="pointer" size="30" color="#EA4335" />
								</span>
								: ''

				}
			</div>
		</>
	)
}
export default VisaContentHeader