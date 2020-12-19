import React, { useContext, useState, useRef } from 'react'
import { UserDataContext } from '../../pages/SelectModule'
import { TokenContext } from '../../App'
import {
	FaEdit,
	FaCheck,
	FaTimes
} from 'react-icons/fa'
import OperationResult from '../Misc/OperationResult'
const VisaContentMaterials = (props) => {
	const { forwardType, canProceed } = props;
	const userDataContext = useContext(UserDataContext);
	const userData = userDataContext[0].userInfo;
	const tokenContext = useContext(TokenContext);
	const token = tokenContext[0];
	const [operationResult, setOperationResult] = useState({ visible: false, desc: '' });
	const { emp_version_id, order_type } = props.orderContent[0];
	return (
		<>
			{
				operationResult.visible &&
				<OperationResult
					setOperationResult={setOperationResult}
					operationDesc={operationResult.desc}
				/>
			}
			<ul className="new-order-table order-table-protex">
				<li>
					<div>#</div>
					<div style={{ textAlign: 'left' }}>Material</div>
					<div style={{ maxWidth: '140px' }}>Say</div>
					{
						(forwardType === 2 && order_type === 1) &&
						<div style={{ maxWidth: '140px' }}>Məbləğ</div>
					}
					<div>Əlavə məlumat</div>
					<div style={{ width: '50px', flex: 'none' }}></div>
				</li>
				{
					props.orderContent.map((material, index) =>
						<TableRow
							index={index}
							setOperationResult={setOperationResult}
							key={index}
							canProceed={canProceed}
							token={token}
							empVersion={emp_version_id}
							userData={userData}
							forwardType={forwardType}
							material={material}
						/>
					)
				}
			</ul>
		</>
	)
}

export default React.memo(VisaContentMaterials)

const TableRow = (props) => {
	const { canProceed, token, setOperationResult, index, forwardType } = props;
	const { amount, material_comment, order_material_id, material_name, total, department_id, order_type, title, result } = props.material;
	const structureid = props.userData.structureid;
	const [disabled, setDisabled] = useState(true);
	const servicePriceRef = useRef(null);
	const handleEditClick = () => {
		setDisabled(prev => {
			canProceed.current[order_material_id] = !prev;
			return !prev
		})
	}
	const handleDone = () => {
		const data = JSON.stringify({
			materialid: order_material_id,
			price: servicePriceRef.current.value
		})
		fetch('http://172.16.3.101:54321/api/update-service-price', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json',
				'Content-Length': data.length
			},
			body: data
		})
			.then(resp => resp.json())
			.then(respJ => {
				if (respJ[0].operation_result === 'success')
					setDisabled(prev => {
						canProceed.current[order_material_id] = !prev;
						return !prev
					})
				else
					setOperationResult({ visible: true, desc: respJ[0].operation_result })
			})
			.catch(ex => console.log(ex))
	}
	const handleCancel = () => {
		servicePriceRef.current.value = total;
		canProceed.current[order_material_id] = true;
		setDisabled(true)
	}
	return (
		<li>
			<div>{index + 1}</div>
			<div style={{ textAlign: 'left' }}>
				{material_name || title}
			</div>
			<div style={{ maxWidth: '140px' }}>
				<div style={{ backgroundColor: 'transparent', padding: '0px 15px' }}>
					<div style={{ width: '40px', textAlign: 'center', padding: '0px 2px', margin: 'auto', flex: 1 }}>
						{amount}
					</div>
				</div>
			</div>
			{
				(forwardType === 2 && order_type === 1) &&
				<div style={{ maxWidth: '140px' }}>
					<input disabled={disabled} defaultValue={total} ref={servicePriceRef} />
				</div>
			}
			<div>
				<span style={{ width: '100%' }} >
					{material_comment}
				</span>
			</div>
			<div style={{ minWidth: '50px', flex: 'none' }}>
				{
					forwardType === 2 && order_type === 1 && structureid === department_id && result === 0 &&
					<>
						{
							disabled && result === 0
								? <FaEdit cursor="pointer" color="#F4B400" onClick={handleEditClick} />
								: <>
									<FaCheck color="#0F9D58" cursor="pointer" onClick={handleDone} />
									<FaTimes color="#ff4a4a" cursor="pointer" onClick={handleCancel} />
								</>
						}
					</>
				}
			</div>
		</li>
	)
}