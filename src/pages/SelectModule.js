import React, { useState, useEffect, useContext, useRef, Suspense, lazy } from 'react';
import {
	Link, Switch, Route
} from 'react-router-dom';
import { TokenContext } from '../App';
import {
	IoMdMenu,
	IoMdRefreshCircle
} from 'react-icons/io';
import { modules } from '../data/data';
import '../App.css';
import logo from '../logo.svg';
import LeftSidePane from '../components/LeftSidePane'
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
		component: Budget
	},
	{
		text: 'Tender',
		link: '/tender',
		component: Tender
	},
]
export const UserDataContext = React.createContext();
const SelectModule = () => {
	const tokenContext = useContext(TokenContext);
	const token = tokenContext[0];
	const moduleNavigationRef = useRef(null);
	const [userData, setUserData] = useState({ modules: [], previliges: [], userInfo: {} })
	const webSocketRef = useRef(null);
	const [menuData, setMenuData] = useState({ url: '', routes: [] })
	const [wSockConnected, setWSockConnected] = useState(false);
	const leftPaneRef = useRef(null);
	const backgroundRef = useRef(null);
	useEffect(() => {
		// console.log(token);
		if (token) {
			const webSocket = new WebSocket('ws://172.16.3.101:12345');
			webSocket.onopen = () => {
				fetch('http://172.16.3.101:54321/api/get-user-data', {
					headers: {
						'Authorization': 'Bearer ' + token
					}
				})
					.then(resp => resp.json())
					.then(respJ => {
						const id = respJ.userData.data.id;
						const userModules = respJ.userData.data.modules.split(',');
						const previliges = respJ.userData.data.previliges.split(',');
						const userMods = modules.filter(module => userModules.find(userModule => userModule === module.text));
						// const userPreviliges = availableOperations.filter(operation => previliges.find(previlige => previlige === operation));
						const data = {
							action: "recognition",
							person: id // todo: get from session
						}
						console.log('connected');
						webSocket.send(JSON.stringify(data));
						// setWebSocketRef(webSocket);
						webSocketRef.current = webSocket;
						const structureid = respJ.userData.data.structureid;
						const fullName = respJ.userData.data.fullName;
						setUserData({
							modules: userMods, previliges: previliges, userInfo: {
								id,
								structureid,
								fullName
							}
						})
						// setWSockConnected(true);
						setWSockConnected(true);
					})
					.catch(ex => console.log(ex))
			}
			return () => {
				webSocket.close();
				setWSockConnected(false);
				console.log('connection closed');
			}
		}
	}, [token]);
	const routes = availableModules.filter(availableModule => userData.modules.find(module => module.text === availableModule.text));
	// console.log(webSocketRef)
	const handleNavClick = () => {
		leftPaneRef.current.classList.toggle('left-side-pane-open');
		const backgroundDisplay = backgroundRef.current.style.display === 'none' ? 'block' : 'none'
		backgroundRef.current.style.display = backgroundDisplay
	}
	const handleLogOut = () => {
		tokenContext[1]('')
		localStorage.removeItem('token');
	}
	const handleIconClick = () => {
		moduleNavigationRef.current.style.display = moduleNavigationRef.current.style.display === 'block'
			? 'none'
			: 'block'
	}
	return (
		<Suspense fallback={
			<div className="loading">
				<IoMdRefreshCircle size="50" color="#a4a4a4" />
			</div>
		}>
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
						<UserDataContext.Provider value={[userData, setUserData]}>
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
																<img style={{ height: '32px', cursor: 'pointer' }} onClick={handleIconClick} src={logo} alt='user pic'>
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
						</UserDataContext.Provider>
					</>
				}
			</Switch>
		</Suspense>
	)
}
export default SelectModule