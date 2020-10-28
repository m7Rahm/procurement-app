import React, { useState, useEffect, useRef, useContext } from 'react'
import {
	MdAdd,
	MdEdit
} from 'react-icons/md'
import Pagination from '../../components/Pagination'
import Modal from '../../components/Modal'
import EditUser from '../../components/admin/EditUser'
import NewUser from '../../components/modal content/NewUser'
import StatusButton from '../../components/StatusButton';
import { TokenContext } from '../../App'
const Users = () => {
	const tokenContext = useContext(TokenContext);
	const token = tokenContext[0]
	const [users, setUsers] = useState({ count: 0, users: [] });
	const activePageRef = useRef(0);
	const [modal, setModal] = useState({ visible: false, content: undefined });
	const createNewUser = () => {
		const newUser = (props) => <NewUser updateList={updateList} closeModal={closeModal} {...props}/>
		setModal({ visible: true, content: newUser})
	}
	const updateList = (from) => {
		fetch(`http://172.16.3.101:54321/api/get-users?from=${from}&next=20`, {
			headers: {
				'Authorization': 'Bearer ' + token
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
				'Authorization': 'Bearer ' + token
			}
		})
			.then(resp => resp.json())
			.then(respJ => {
				const totalCount = respJ[0] ? respJ[0].total_count : 0;
				setUsers({ count: totalCount, users: respJ })
			})
			.catch(ex => console.log(ex))
	}, [token]);
	const closeModal = () => setModal({ visible: false, content: undefined })
	const editUserData = (id) => {
		const editUser = (props) => <EditUser closeModal={closeModal} id={id} {...props}/>
		setModal({ visible: true, content: editUser})
	}
	const updateFunc = (id, state) => fetch(`http://172.16.3.101:54321/api/change-user-status?userid=${id}&status=${state}`, {
		headers: {
			'Authorization': 'Bearer ' + token
		}
	})
		.then(resp => resp.json())
		.then(respJ => console.log(respJ))
		.catch(ex => console.log(ex))
	return (
		<div style={{ paddingTop: '56px' }}>
			<div className="users-page">
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
										<StatusButton
											id={user.id}
											status={user.active_passive}
											updateFunc={updateFunc}
										/>
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