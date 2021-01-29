import React, { useState, useEffect, useContext, useRef, lazy } from 'react';
import {
	Link, Switch, Route
} from 'react-router-dom';
import { TokenContext } from '../App';
import {
	IoMdMenu
} from 'react-icons/io';

import logo from '../logo.svg';
import LeftSidePane from '../components/Common/LeftSidePane'
const Contracts = lazy(() => import('./Contracts'));
const Budget = lazy(() => import('./Budget'))
const Orders = lazy(() => import('./Orders'))
const Tender = lazy(() => import('./Tender'))
const Admin = lazy(() => import('./AdminPage'))
const availableModules = [
	{
		text: 'Budget',
		link: '/budget',
		component: Budget
	},
	{
		text: 'Orders',
		link: '/orders',
		component: Orders
	},
	{
		text: 'Admin',
		link: '/admin',
		component: Admin
	},
	{
		text: 'Contracts',
		link: '/contracts',
		component: Contracts
	},
	{
		text: 'Tender',
		link: '/tender',
		component: Tender
	},
]
const SelectModule = () => {
	const tokenContext = useContext(TokenContext);
	const token = tokenContext[0].token;
	const userData = tokenContext[0].userData
	const moduleNavigationRef = useRef(null);
	const webSocketRef = useRef(null);
	const [menuData, setMenuData] = useState({ url: '', routes: [] })
	const [wSockConnected, setWSockConnected] = useState(false);
	const leftPaneRef = useRef(null);
	const backgroundRef = useRef(null);
	useEffect(() => {
		if (token) {
			const webSocket = new WebSocket('ws://172.16.3.101:12345');
			webSocket.onopen = () => {
				const id = userData.id;
				const data = {
					action: "recognition",
					person: id // todo: get from session
				}
				console.log('connected');
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
	const routes = availableModules.filter(availableModule => userData.modules.find(module => module.text === availableModule.text));
	const handleNavClick = () => {
		leftPaneRef.current.classList.toggle('left-side-pane-open');
		const backgroundDisplay = backgroundRef.current.style.display === 'none' ? 'block' : 'none'
		backgroundRef.current.style.display = backgroundDisplay
	}
	const handleLogOut = () => {
		tokenContext[1]({ token: '', userData: {} })
		localStorage.removeItem('token');
	}
	const handleIconClick = () => {
		moduleNavigationRef.current.style.display = moduleNavigationRef.current.style.display === 'block'
			? 'none'
			: 'block'
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
					</div>
				</div>
			</Route>
			{
				wSockConnected &&
				<>
					{
						routes.map(route =>
							<Route key={route.link} path={route.link}>
								<>
									<nav>
										<ul>
											<li>
												<div>
													<div className="left-side-toggle">
														<IoMdMenu size="24" cursor="pointer" color="#606060" onClick={handleNavClick} />
													</div>
													<div style={{ position: 'relative' }}>
														<img style={{ height: '32px', cursor: 'pointer', width: '45px' }} onClick={handleIconClick} src={logo} alt='user pic'>
														</img>
														<ul ref={moduleNavigationRef} className="profile-icon">
															{
																routes.map(module =>
																	<li key={module.link}>
																		<Link to={module.link}>
																			<div >
																				{module.text}
																			</div>
																		</Link>
																	</li>
																)
															}
															<li onClick={handleLogOut}>
																<div style={{ minWidth: '60px' }}>Log out</div>
															</li>
														</ul>
													</div>
												</div>
											</li>
										</ul>
									</nav>
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