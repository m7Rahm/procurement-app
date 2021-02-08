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
const EditOrderRequest = React.lazy(() => import('../../modal content/EditOrderRequest'));

const VisaContentHeader = (props) => {
	const { version, current, orderNumb, handleEditClick, updateContent } = props;
	const visaGenInfo = current[0];
	const tranid = current[0].id;
	const tokenContext = useContext(TokenContext);
	const token = tokenContext[0].token;
	const userData = tokenContext[0].userData;
	const canEditRequest = userData.previliges.find(prev => prev === 'Sifarişi redaktə etmək');
	const closeModal = (respJ, receivers) => {
		updateContent(receivers, {
			id: respJ[1].id,
			act_date_time: respJ[1].act_date_time,
			result: respJ[1].result,
			comment: respJ[1].comment
		})
	};
	const editOrderAndApprove = (data, setOperationResult) => {
		const apiData = JSON.stringify(data);
		fetch(`http://172.16.3.101:54321/api/edit-accept-order-req/${tranid}`, {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json',
				'Content-Length': apiData.length
			},
			body: apiData
		})
			.then(resp => resp.json())
			.then(respJ => {
				if (respJ[0].result === 'success')
					closeModal(respJ, data.recs)
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
				closeModal={closeModal}
				tranid={tranid}
				version={version}
				content={current}
				token={token}
				orderNumb={orderNumb}
				{...props}
			/>
		)
	}
	const showEditOrderContent = () => handleEditClick((props) =>
		<EditOrderRequest
			closeModal={closeModal}
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
						canEditRequest && !visaGenInfo.result && visaGenInfo.order_result === 0 &&
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