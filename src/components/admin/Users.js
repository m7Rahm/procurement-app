import React, { useState, useEffect } from 'react'
import {
	BsThreeDots
} from 'react-icons/bs'
import {
	MdAdd
} from 'react-icons/md'
const Users = () => {
	const [users, setUsers] = useState([]);
	const handleClick = () => {

	}
	useEffect(() => {
		fetch('http://172.16.3.101:54321/api/get-users', {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
			.then(resp => resp.json())
			.then(respJ => setUsers(respJ))
			.catch(ex => console.log(ex))
	}, [])
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
							users.map((user, index) =>
								<tr key={user.id}>
									<td>{index + 1}</td>
									<td>{user.name}</td>
									<td>{user.full_name}</td>
									<td>124921</td>
									<td>{user.passport_data}</td>
									<td>{user.shobe}</td>
									<td>{user.status}</td>
									<td>
										<div
											style={{
												borderRadius: '50%',
												padding: '5px',
												cursor: 'pointer',
												backgroundColor: user.active ? 'green' : 'red',
												width: '10px',
												height: '10px'
											}}>
										</div>
									</td>
									<td><BsThreeDots /></td>
								</tr>
							)
						}
					</tbody>
				</table>
				<div title="yeni işçi əlavə et" className="new-order-button" onClick={() => handleClick(true)}>
        <MdAdd color="white" size="30" />
      </div>
			</div>
		</div>
	)
}
export default Users