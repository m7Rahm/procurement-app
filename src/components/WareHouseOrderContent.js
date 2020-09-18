import React, { useState, useEffect } from 'react'
import { importance } from '../data/data'
import {
	MdDone,
	MdClose,
	MdEdit
} from 'react-icons/md'
import {
	BsExclamation
} from 'react-icons/bs'
import {
	IoIosTrash
} from 'react-icons/io';
import { token } from '../data/data'
const WarehousemanVersion = (props) => {
	const ordNumb = props.ordNumb;
	const [data, setData] = useState([])
	useEffect(() => {
		const data = {
			ordNumb: ordNumb,
			empVersion: -1
		}
		fetch('http://172.16.3.101:54321/api/warehouse-offer-content', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': JSON.stringify(data).length,
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify(data)
		})
			.then(resp => resp.json())
			.then(respJ => setData(respJ));
			// return () => 
	}, [ordNumb])
	return (
		<div style={{marginTop: '30px'}}>
			<ul className="warehouse-table">
				<li>
					<div>#</div>
					<div>Material</div>
					<div>Model</div>
					<div>Say</div>
					<div>Vaciblik</div>
					<div>Əlavə məlumat</div>
					<div style={{flex: 1}}>Anbarda</div>
					<div>Status</div>
				</li>
				{
					data.map((material, index) =>
						<li key={material.id}>
							<div>{index + 1}</div>
							<div>{material.category}</div>
							<div>{material.model}</div>
							<div>
								<input
									value={material.amount}
									disabled={true}
								/>
							</div>
							<div>{importance.find(obj => obj.val === material.importance).title}</div>
							<div>{material.comment}</div>
							<div style={{flex: 1}}>{material.quantity}</div>
							<div>
								{
									material.quantity >= material.amount
										? <MdDone color="#3cba54" size="20" title="Anbarda var" />
										: material.quantity === 0
											? <MdClose color="#db3236" size="20" title="Anbarda yoxdur" />
											: <BsExclamation color="#F4B400" size="20" title="Anbarda qismən var" />
								}
							</div>
						</li>
					)
				}
			</ul>
		</div>
	)
}
const WarehouseOrderContent = (props) => {
	const [editable, setEditable] = useState(false);
	const [modalState, setModalState] = useState(false);
	console.log(props)
	const handleEditClick = () => {
		setEditable(prev => !prev)
	}
	const handleAmountChange = (e, id) => {
		const value = e.target.value;
		const active = props.active;
		active.find(material => material.id === id).amount = value;
		props.setActive([...active]);
	}
	useEffect(() => {
		setEditable(false);
	}, [props.ordNumb])
	const showUpdatedVersion = () => {
		setModalState(prev => !prev)
	}
	const handleDelete = (e, id) => {
		const target = e.target;
		const li = target.closest('li')
		li.classList.add('delete-row');
		li.addEventListener('animationend', () => {
			const active = props.active;
			const updated = active.filter(material => material.id !== id);
			props.setActive(updated)
		})
	}
	const createNewVersion = () => {
		const mats = props.active.map(element =>
			[
				element.material_id,
				element.amount,
				element.comment,
				element.model,
				element.importance,
				element.unitid
			]
		)
		const data = {
			deadline: props.active[0].deadline,
			mats,
			receivers: [],
			comment: props.active[0].order_comment,
			assignment: props.active[0].assignment,
			ordNumb: props.active[0].ord_numb,
			review: '',
			empVersion: props.active[0].emp_version_id
		}
		fetch('http://172.16.3.101:54321/api/new-order', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': JSON.stringify(data).length,
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify(data)
		})
		.then(resp => resp.json())
		.then(respJ => {
			if (respJ[0].result === 'success') {
				const active = props.active;
				active.forEach(element => element.for_procurement = 2);
				// console.log(active)
				props.setActive([...active])
			}
		})
		.catch(ex => console.log(ex))
	}
	const approveDecline = (action) => {
		const data = {
			receivers: [],
			action,
			empVersion: props.active[0].emp_version_id,
			comment: '',
			forwardedVersion: props.active[0].emp_version_id
		}
		console.log(data)
		fetch(`http://172.16.3.101:54321/api/accept-decline/${props.ordNumb}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': JSON.stringify(data).length,
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify(data)
		})
			.then(resp => resp.json())
			.then(respJ => {
				if (respJ[0].result === 'success') {
					const active = props.active;
					active.forEach(element => element.for_procurement = action);
					console.log(active)
					props.setActive([...active])
				}
			})
			.catch(ex => console.log(ex))
	}
	return (
		<div>
			<div className="warehouse-header">
				{
					props.forProcurement === 1
						? <MdDone color="#0F9D58" size="50" />
						: (props.forProcurement === 0)
							? <MdClose color="#db3236" size="50" />
							: (props.forProcurement === 2)
								? <BsExclamation
										color="#F4B400"
										onClick={showUpdatedVersion}
										size="50"
									/>
								: null
				}

			</div>
			<ul className="warehouse-table">
				<li>
					<div>#</div>
					<div>Material</div>
					<div>Model</div>
					<div>Say</div>
					<div>Vaciblik</div>
					<div>Əlavə məlumat</div>
					<div>Anbarda</div>
					<div>Status</div>
					<div></div>
				</li>
				{
					props.active.map((material, index) =>
						<li key={material.id}>
							<div>{index + 1}</div>
							<div>{material.category}</div>
							<div>{material.model}</div>
							<div>
								<input
									value={material.amount}
									disabled={!editable}
									onChange={(e) => handleAmountChange(e, material.id)}
								/>
							</div>
							<div>{importance.find(obj => obj.val === material.importance).title}</div>
							<div>{material.comment}</div>
							<div>{material.quantity}</div>
							<div>
								{
									material.quantity >= material.amount
										? <MdDone color="#3cba54" size="20" title="Anbarda var" />
										: material.quantity === 0
											? <MdClose color="#db3236" size="20" title="Anbarda yoxdur" />
											: <BsExclamation
												color="#F4B400"
												size="20"
												title="Anbarda qismən var"
											/>
								}
							</div>
							<div>
								<IoIosTrash
									onClick={editable ? (e) => handleDelete(e, material.id) : () => null}
									color={editable ? 'red' : 'gray'} size="25"
									style={{ cursor: editable ? 'pointer' : 'default' }}
								/>
							</div>
						</li>
					)
				}
				{
					props.active[0].for_procurement === null &&
					<div className="warehouse-table-edit-button">
					<MdEdit onClick={handleEditClick} size="30" title="Düzəliş et" />
				</div>
				}
			</ul>
			{
				modalState && props.active[0].for_procurement === 2 &&
				<WarehousemanVersion
					ordNumb={props.ordNumb}
					modalState={modalState}
				/>
			}
			{
				props.forProcurement === null &&
				<div className="accept-decline-container">
					<div onClick={editable ? createNewVersion : () => approveDecline(1)} style={{ backgroundColor: '#3cba54' }} >{editable ? 'Düzəliş et' : 'Təsdiq et'}</div>
					<div onClick={() => approveDecline(0)} style={{ backgroundColor: '#db3236' }}>Etiraz et</div>
				</div>
			}
		</div>
	)
}
export default WarehouseOrderContent