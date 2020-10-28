import React, { useContext, useState } from 'react'
import { UserDataContext } from '../pages/SelectModule'
import { TokenContext } from '../App'
import {
	FaEdit,
	FaCheck,
	FaTimes
} from 'react-icons/fa'
const TableRow = (props) => {
	const { material_id, amount, material_comment, material_name, total, department_id, order_type, title, result } = props.material;
	const token = props.token;
	const structureid = props.userData.structureid;
	const [curTotal, setCurTotal] = useState(total);
	const [disabled, setDisabled] = useState(true)
	const handleChange = (e) => {
		const value = e.target.value;
		setCurTotal(value)
	}
	const handleEditClick = () => {
		setDisabled(prev => !prev)
	}
	const handleDone = () => {
		const data = {
			ordNumb: props.ordNumb,
			empVersion: props.empVersion,
			materialid: material_id,
			price: curTotal
		}
		fetch('http://172.16.3.101:54321/api/update-service-price', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json',
				'Content-Length': JSON.stringify(data).length
			},
			body: JSON.stringify(data)
		})
		.then(_ => setDisabled(true))
		.catch(ex => console.log(ex))
	}
	const handleCancel = () => {
		setCurTotal(total);
		setDisabled(true)
	}
	return (
		<li>
			<div>{props.index + 1}</div>
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
				(props.forwardType === 2 && order_type === 1) &&
				<div style={{ maxWidth: '140px' }}>
					<input disabled={disabled} value={curTotal} onChange={handleChange} />
				</div>
			}
			<div>
				<span style={{ width: '100%' }} >
					{material_comment}
				</span>
			</div>
			<div style={{ minWidth: '50px', flex: 'none' }}>
				{
					props.forwardType === 2 && order_type === 1 && structureid === department_id && result === 0 &&
					<>
						{
							disabled
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

const VisaContentMaterials = (props) => {
	const forwardType = props.forwardType;
	const userDataContext = useContext(UserDataContext);
	const userData = userDataContext[0].userInfo;
	const tokenContext = useContext(TokenContext);
	const token = tokenContext[0];
	const { ord_numb, emp_version_id, order_type } = props.orderContent[0];
	return (
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
						key={index}
						token={token}
						ordNumb={ord_numb}
						empVersion={emp_version_id}
						userData={userData}
						forwardType={forwardType}
						material={material}
					/>
				)
			}
		</ul>
	)
}

export default React.memo(VisaContentMaterials)