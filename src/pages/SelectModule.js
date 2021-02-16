import React, { useState, useEffect, useContext, useRef, lazy } from 'react';
import {
	Link, Switch, Route
} from 'react-router-dom';
import { TokenContext } from '../App';
import LeftSidePane from '../components/Common/LeftSidePane'
import Navigation from '../components/Common/Navigation';
const Contracts = lazy(() => import('./Contracts'));
const Budget = lazy(() => import('./Budget'))
const Orders = lazy(() => import('./Orders'))
const Tender = lazy(() => import('./Tender'))
const Admin = lazy(() => import('./AdminPage'))
const availableModules = [
	{
		text: 'Büdcə',
		label: "Budget",
		link: '/budget',
		component: Budget
	},
	{
		text: 'Sifarişlər',
		label: "Orders",
		link: '/orders',
		component: Orders
	},
	{
		text: 'Admin',
		label: "Admin",
		link: '/admin',
		component: Admin
	},
	{
		text: 'Müqavilələr',
		label: "Contracts",
		link: '/contracts',
		component: Contracts
	},
	{
		text: 'Tender',
		label: "Tender",
		link: '/tender',
		component: Tender
	}
]
const SelectModule = () => {
	const tokenContext = useContext(TokenContext);
	const token = tokenContext[0].token;
	const userData = tokenContext[0].userData;
	const webSocketRef = useRef(null);
	const [menuData, setMenuData] = useState({ url: '', routes: [] })
	const [wSockConnected, setWSockConnected] = useState(false);
	const leftPaneRef = useRef(null);
	const backgroundRef = useRef(null);
	useEffect(() => {
		if (token) {
			const webSocket = new WebSocket('ws://192.168.0.182:12345');
			webSocket.onopen = () => {
				const id = userData.userInfo.id;
				const data = {
					message: "recognition",
					userid: id // todo: get from session
				}
				webSocket.send(JSON.stringify(data));
				webSocketRef.current = webSocket;
				setWSockConnected(true);
			}
			return () => {
				webSocket.close();
				setWSockConnected(false);
				console.log('connection closed');
			}
		}
	}, [token, userData]);
	const routes = availableModules.filter(availableModule => userData.modules.find(module => module.text === availableModule.label));
	const warehouseVisible = userData.modules.find(module => module.text === "Warehouse") ? true : false;
	const handleNavClick = () => {
		leftPaneRef.current.classList.toggle('left-side-pane-open');
		const backgroundDisplay = backgroundRef.current.style.display === 'none' ? 'block' : 'none'
		backgroundRef.current.style.display = backgroundDisplay
	}
	return (
		<Switch>
			<Route exact path="/">
				<div className="splash-screen">
					<div className="module-select">
						{
							routes.map(module =>
								<Link key={module.link} to={module.link}>
									<div className="module-card">
										{module.text}
									</div>
								</Link>
							)
						}
						{
							warehouseVisible &&
							<a href="http://192.168.0.182:62447">
								<div className="module-card">
									Anbar
								</div>
							</a>
						}
					</div>
				</div>
			</Route>
			{
				wSockConnected &&
				<>
					<>
						<Navigation
							handleNavClick={handleNavClick}
							routes={routes}
							webSocketRef={webSocketRef}
							tokenContext={tokenContext}
						/>
						<div
							onClick={handleNavClick}
							ref={backgroundRef}
							style={{
								position: 'fixed',
								height: '100%',
								width: '100%',
								top: 0,
								left: 0,
								display: 'none',
								background: 'rgba(0, 0, 0, 0.6)',
								zIndex: 2
							}}>
						</div>
					</>
					{
						routes.map(route =>
							<Route key={route.link} path={route.link}>
								<LeftSidePane
									url={menuData.url}
									links={menuData.routes}
									ref={leftPaneRef}
									handleNavClick={handleNavClick}
								/>
								<route.component
									webSocketRef={webSocketRef}
									handleNavClick={handleNavClick}
									menuData={menuData}
									setMenuData={setMenuData}
								/>
							</Route>
						)
					}
				</>
			}
		</Switch>
	)
}
export default SelectModule