import React, { useState, useEffect, useContext, useRef, lazy, Suspense } from "react";
import { Link, Switch, Route, Redirect } from "react-router-dom";
import { TokenContext } from "../App";
import LeftSidePane from "../components/Common/LeftSidePane"
import Navigation from "../components/Common/Navigation";
// import PaymentLayout from "../components/Exports/PaymentLayout";
import Loading from "../components/Misc/Loading"
const Contracts = lazy(() => import("./Contracts"));
const Budget = lazy(() => import("./Budget"))
const Orders = lazy(() => import("./Orders"))
const Tender = lazy(() => import("./Tender"))
const Admin = lazy(() => import("./AdminPage"))
const Other = lazy(() => import("./Other"))
const availableModules = [
	{
		text: "Büdcə",
		label: "Budget",
		link: "/budget",
		component: Budget
	},
	{
		text: "Sifarişlər",
		label: "Orders",
		link: "/orders",
		component: Orders
	},
	{
		text: "Admin",
		label: "Admin",
		link: "/admin",
		component: Admin
	},
	{
		text: "Müqavilələr",
		label: "Contracts",
		link: "/contracts",
		component: Contracts
	},
	{
		text: "Tender",
		label: "Tender",
		link: "/tender",
		component: Tender
	},
	{
		text: "Digər",
		label: "Other",
		link: "/other",
		component: Other
	}
]
const SelectModule = () => {
	const tokenContext = useContext(TokenContext);
	const token = tokenContext[0].token;
	const userData = tokenContext[0].userData;
	const [menuData, setMenuData] = useState({ url: "", routes: [] })
	const [webSocket, setWebSocket] = useState(null);
	const leftPaneRef = useRef(null);
	const backgroundRef = useRef(null);
	const leftNavIconRef = useRef(null);
	const loadingIndicatorRef = useRef(null)
	useEffect(() => {
		let mounted = true;
		if (token) {
			const webSocket = new WebSocket("ws://192.168.0.182:12345");
			webSocket.onopen = () => {
				const id = userData.userInfo.id;
				const data = {
					message: "recognition",
					userid: id // todo: get from session
				}
				webSocket.send(JSON.stringify(data));
				if (mounted)
					setWebSocket(webSocket);
			}
			return () => {
				webSocket.close();
				setWebSocket(null);
				mounted = false;
				console.log("connection closed");
			}
		}
	}, [token, userData]);
	const routes = availableModules.filter(availableModule => userData.modules.find(module => module.text === availableModule.label));
	const warehouseVisible = userData.modules.find(module => module.text === "Warehouse") ? true : false;
	const handleNavClick = () => {
		if (leftPaneRef.current) {
			leftPaneRef.current.classList.toggle("left-side-pane-open");
			const backgroundDisplay = backgroundRef.current.style.display === "none" ? "block" : "none"
			backgroundRef.current.style.display = backgroundDisplay
		}
	}
	return (
		<WebSocketContext.Provider value={webSocket}>
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
					webSocket &&
					<>
						<>
							<Navigation
								handleNavClick={handleNavClick}
								routes={routes}
								webSocket={webSocket}
								token={token}
								userData={userData}
								ref={loadingIndicatorRef}
								leftNavRef={leftNavIconRef}
								tokenContext={tokenContext}
							/>
							<div
								onClick={handleNavClick}
								ref={backgroundRef}
								style={{
									position: "fixed",
									height: "100%",
									width: "100%",
									top: 0,
									left: 0,
									display: "none",
									background: "rgba(0, 0, 0, 0.6)",
									zIndex: 2
								}}>
							</div>
						</>
						<Switch>
							{
								routes.map(route =>
									<Route key={route.link} path={route.link} >
										<LeftSidePane
											url={menuData.url}
											links={menuData.routes}
											ref={leftPaneRef}
											backgroundRef={backgroundRef}
											handleNavClick={handleNavClick}
										/>
										<Suspense fallback={<Loading />} >
											<route.component
												handleNavClick={handleNavClick}
												menuData={menuData}
												loadingIndicatorRef={loadingIndicatorRef}
												leftNavRef={leftNavIconRef}
												setMenuData={setMenuData}
											/>
										</Suspense>
									</Route>
								)
							}
							{/* <Suspense fallback={<Loading />} >
								<Route key="exports" path="/exports" >
									<PaymentLayout
										handleNavClick={handleNavClick}
										menuData={menuData}
										loadingIndicatorRef={loadingIndicatorRef}
										leftNavRef={leftNavIconRef}
										setMenuData={setMenuData}
									/>
								</Route>
							</Suspense> */}
							<Redirect to="/" />
						</Switch>
					</>
				}
			</Switch>
		</WebSocketContext.Provider>
	)
}
export default SelectModule
export const WebSocketContext = React.createContext();