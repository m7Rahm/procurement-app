import React, { useState, useEffect, useRef } from 'react'
import {
	MdAdd,
	MdEdit
} from 'react-icons/md'
import Pagination from '../../components/Misc/Pagination'
import Modal from '../../components/Misc/Modal'
import EditUser from '../../components/Admin/EditUser'
import StatusButton from '../../components/Misc/StatusButton';
import useFetch from '../../hooks/useFetch'
const Users = () => {
	const [users, setUsers] = useState({ count: 0, users: [] });
	const activePageRef = useRef(0);
	const [modal, setModal] = useState({ visible: false, content: undefined });
	const fetchGet = useFetch("GET");
	const updateList = (from) => {
		fetchGet(`http://192.168.0.182:54321/api/get-users?from=${from}&next=20`)
			.then(respJ => {
				const totalCount = respJ[0] ? respJ[0].total_count : 0;
				setUsers({ count: totalCount, users: respJ })
			})
			.catch(ex => console.log(ex))
	}
	useEffect(() => {
		fetchGet(`http://192.168.0.182:54321/api/get-users?from=0&next=20`)
			.then(respJ => {
				const totalCount = respJ[0] ? respJ[0].total_count : 0;
				setUsers({ count: totalCount, users: respJ })
			})
			.catch(ex => console.log(ex))
	}, [fetchGet]);
	const closeModal = () => {
		setModal({ visible: false, content: undefined })
	}
	const editUserData = (user = { id: undefined, full_name: "Yeni istifadəçi" }) => {
		const editUser = (props) => <EditUser updateList={updateList} closeModal={closeModal} id={user.id} {...props} />
		setModal({ visible: true, content: editUser, title: user.full_name })
	}
	const updateFunc = (id, state) => fetchGet(`http://192.168.0.182:54321/api/change-user-status?userid=${id}&status=${state}`)
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
									<td>{user.fin}</td>
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
											onClick={() => editUserData(user)}
											title="düzəliş et"
										/>
									</td>
								</tr>
							)
						}
					</tbody>
				</table>
				<div title="yeni işçi əlavə et" className="new-order-button" onClick={() => editUserData()}>
					<MdAdd color="white" size="30" />
				</div>
				<Pagination
					count={users.count}
					activePageRef={activePageRef}
					updateList={updateList}
				/>
				{
					modal.visible &&
					<Modal title={modal.title} changeModalState={closeModal}>
						{modal.content}
					</Modal>
				}
			</div>
		</div>
	)
}
export default Users