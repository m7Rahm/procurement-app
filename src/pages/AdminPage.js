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
	Switch,
	Redirect
} from 'react-router-dom'
import Structure from './Admin/Structure'
import Materials from './Admin/OrderMaterials'
import '../styles/Admin.css'
const routes = [
	{
		text: 'Rollar',
		link: '/roles',
		icon: IoMdSettings,
		component: Roles
	},
	{
		text: 'Istifadəçilər',
		link: '/users',
		icon: FaUsers,
		component: Users
	},
	{
		text: 'Struktur',
		link: '/structure',
		icon: ImTree,
		component: Structure
	},
	{
		text: 'Məhsullar',
		link: '/materials',
		icon: FaBoxes,
		component: Materials
	}
]
const AdminPage = (props) => {
	const setMenuData = props.setMenuData
	const { path, url } = useRouteMatch()
	useEffect(() => {
		setMenuData({ url: url, routes: routes });
        props.leftNavRef.current.style.display = "block";
	}, [url, setMenuData, props.leftNavRef])
	return (
		<div className="dashboard" style={{ paddingTop: '76px' }}>
			<Switch>
				{
					routes.map(route =>
						<Route key={route.link} path={`${path}${route.link}`}>
							<route.component />
						</Route>
					)
				}
				<Redirect to={`${path}/roles/:docid?`} />
			</Switch>
		</div>
	)
}
export default AdminPage