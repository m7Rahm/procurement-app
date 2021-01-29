import React, { useEffect } from 'react'
import Roles from './Admin/Roles'
import Users from './Admin/Users'
import { IoMdSettings } from 'react-icons/io'
import {
	FaUsers,
	FaBoxes
} from 'react-icons/fa'
import { ImTree } from 'react-icons/im'
import {
	useRouteMatch,
	Route,
	Switch
} from 'react-router-dom'
import Structure from './Admin/Structure'
import Materials from './Admin/OrderMaterials'
import '../styles/Admin.css'
const routes = [
	{
		text: 'Roles',
		link: '/roles',
		icon: IoMdSettings,
		component: Roles
	},
	{
		text: 'Users',
		link: '/users',
		icon: FaUsers,
		component: Users
	},
	{
		text: 'Structure',
		link: '/structure',
		icon: ImTree,
		component: Structure
	},
	{
		text: 'Materials',
		link: '/materials',
		icon: FaBoxes,
		component: Materials
	}
]
const AdminPage = (props) => {
	const setMenuData = props.setMenuData
	const { path, url } = useRouteMatch()
	useEffect(() => {
		setMenuData({ url: url, routes: routes })
	}, [url, setMenuData])
	return (
		<div className="dashboard">
			<Switch>
				{
					routes.map(route =>
						<Route key={route.link} path={`${path}${route.link}`}>
							<route.component />
						</Route>
					)
				}
			</Switch>
		</div>
	)
}
export default AdminPage