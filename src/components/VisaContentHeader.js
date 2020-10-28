import React, { useContext } from 'react'
import {
	FaEdit,
	FaCheck,
	FaTimes
} from 'react-icons/fa'
import {
	IoIosWarning
} from 'react-icons/io'
import { UserDataContext } from '../pages/SelectModule'
import VisaVersionsContainer from '../components/VisaVersionsContainer'
import { TokenContext } from '../App'
const EditOrderRequest = React.lazy(() => import('./modal content/EditOrderRequest'));

const VisaContentHeader = (props) => {
	const { version, current, orderNumb, currentState, handleEditClick, updateContent } = props;
	const tranid = current[0].id;
	const userDataContext = useContext(UserDataContext);
	const tokenContext = useContext(TokenContext);
	const userData = userDataContext[0];
	const canEditRequest = userData.previliges.find(prev => prev === 'Sifarişi redaktə etmək')
	const closeModal = (respJ, receivers) => {
		updateContent(receivers, {
			id: respJ[1].id,
			act_date_time: respJ[1].act_date_time,
			result: respJ[1].result,
			comment: respJ[1].comment
		})
	};
	const editOrderAndApprove = (data) => {
		const token = tokenContext[0];
		fetch(`http://172.16.3.101:54321/api/edit-accept-order-req/${tranid}`, {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json',
				'Content-Length': JSON.stringify(data).length
			},
			body: JSON.stringify(data)
		})
			.then(resp => resp.json())
			.then(respJ => closeModal(respJ, data.recs))
			.catch(ex => console.log(ex))
	}
	const showOrderVersions = () => {
		handleEditClick((props) =>
			<VisaVersionsContainer
				closeModal={closeModal}
				tranid={tranid}
				version={version}
				content={current}
				token={tokenContext[0]}
				orderNumb={orderNumb}
				{...props}
			/>
		)
	}
	return (
		<>
			<div className="protex-order-header-container">
				<h1>
					{`Sifariş № ${orderNumb}`}
					{
						canEditRequest && !currentState.result &&
						<FaEdit onClick={() => handleEditClick((props) =>
							<EditOrderRequest
								closeModal={closeModal}
								version={version}
								view='procurement'
								content={current}
								editOrderAndApprove={editOrderAndApprove}
								{...props}
							/>
						)}
							title="düzəliş et"
							size="20"
						/>
					}
				</h1>
				{
					currentState.result === 1
						? <span>
							{currentState.act_date_time}
							<FaCheck size="30" title="Təsdiq" color="#34A853" />
						</span>
						: currentState.result === -1
							? <span>
								{currentState.act_date_time}
								<FaTimes title="Etiraz" size="30" color="#EA4335" />
							</span>
							: currentState.result === 3
								? <span>
									{currentState.act_date_time}
									<IoIosWarning onClick={showOrderVersions} title="Dəyişikliklərə bax" cursor="pointer" size="30" color="#EA4335" />
								</span>
								: ''

				}
			</div>
			{/* <div className="new-order-header">
				<div>
					<label htmlFor="destination" color="#555555">Təyinatı</label>
					<br />
					<div style={{ clear: 'both', fontSize: '22px', fontWeight: '555', color: 'gray' }}>{props.assignment}</div>
				</div>
				<div>
					<label htmlFor="deadline" color="#555555">Deadline</label>
					<div style={{ clear: 'both', fontSize: '22px', fontWeight: '550', color: 'gray' }}>{props.deadline}</div>
				</div>
			</div> */}
		</>
	)
}
export default VisaContentHeader