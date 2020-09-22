import React, { useState, useEffect, useRef } from 'react'
import {
	MdAdd,
	MdEdit
} from 'react-icons/md'
import Pagination from '../components/Pagination'
import Modal from '../components/Modal'
import EditUser from '../components/admin/EditUser'
import NewUser from '../components/modal content/NewUser'
const StatusButton = (props) => {
	const [status, setStatus] = useState(props.status)
	const changeStatus = () => {
		setStatus(prev => {
			const stat = !prev ? 1 : 0
			fetch(`http://172.16.3.101:54321/api/change-user-status?userid=${props.id}&status=${stat}`, {
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('token')
				}
			})
			.then(resp => resp.json())
			.then(respJ => console.log(respJ))
			.catch(ex => console.log(ex))
			return !prev
		})
	}
	return (
		<div
			onClick={changeStatus}
			title={status ? 'deaktiv et' : 'aktivləşdir'}
			style={{
				borderRadius: '50%',
				padding: '5px',
				cursor: 'pointer',
				backgroundColor: status ? 'green' : 'red',
				width: '10px',
				height: '10px'
			}}>
		</div>
	)
}
const Users = () => {
	const [users, setUsers] = useState({ count: 0, users: [] });
	const activePageRef = useRef(0);
	const [modal, setModal] = useState({ visible: false, content: undefined });
	const createNewUser = () => {
		const newUser = (props) => <NewUser closeModal={closeModal} {...props}/>
		setModal({ visible: true, content: newUser})
	}
	const updateList = (from) => {
		fetch(`http://172.16.3.101:54321/api/get-users?from=${from}&next=20`, {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
			.then(resp => resp.json())
			.then(respJ => {
				const totalCount = respJ[0] ? respJ[0].total_count : 0;
				setUsers({ count: totalCount, users: respJ })
			})
			.catch(ex => console.log(ex))
	}
	useEffect(() => {
		fetch(`http://172.16.3.101:54321/api/get-users?from=0&next=20`, {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
			.then(resp => resp.json())
			.then(respJ => {
				const totalCount = respJ[0] ? respJ[0].total_count : 0;
				setUsers({ count: totalCount, users: respJ })
			})
			.catch(ex => console.log(ex))
	}, []);
	const closeModal = () => setModal({ visible: false, content: undefined })
	const editUserData = (id) => {
		const editUser = (props) => <EditUser closeModal={closeModal} id={id} {...props}/>
		setModal({ visible: true, content: editUser})
	}
	return (
		<div style={{ paddingTop: '56px' }}>
			<div style={{
				paddingTop: '40px',
				maxWidth: '1256px',
				margin: 'auto'
			}}>
				<table className="users-table">
					<thead>
						<tr>
							<th>#</th>
							<th>Username</th>
							<th>Ad</th>
							<th>FIN</th>
							<th>ID</th>
							<th>Departament</th>
							<th>Status</th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{
							users.users.map((user, index) =>
								<tr key={user.id}>
									<td>{index + 1}</td>
									<td>{user.username}</td>
									<td>{user.full_name}</td>
									<td>124921</td>
									<td>{user.passport_data}</td>
									<td>{user.shobe}</td>
									<td>{user.status}</td>
									<td>
										<StatusButton id={user.id} status={user.active_passive} />
									</td>
									<td>
										<MdEdit
											onClick={() => editUserData(user.id)}
											title="düzəliş et"
										/>
									</td>
								</tr>
							)
						}
					</tbody>
				</table>
				<div title="yeni işçi əlavə et" className="new-order-button" onClick={createNewUser}>
					<MdAdd color="white" size="30" />
				</div>
				<Pagination
					count={users.count}
					activePageRef={activePageRef}
					updateList={updateList}
				/>
				{
					modal.visible &&
					<Modal title="Edit" changeModalState={closeModal}>
						{modal.content}
					</Modal>
				}
			</div>
		</div>
	)
}
export default Users