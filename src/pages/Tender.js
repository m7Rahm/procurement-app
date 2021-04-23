import React, { useEffect } from "react"
import {
    Switch,
    Route,
    useRouteMatch,
    Redirect
} from "react-router-dom";
import { MdLocalOffer } from "react-icons/md"
import { FaCartArrowDown, FaTasks } from "react-icons/fa"
import { IoIosDocument, IoIosBulb } from "react-icons/io"
import ExpressVendors from "./Tender/ExpressVendors"
import PotentialVendors from "./Tender/PotentialVendors"
import Orders from "./Tender/Orders";
import "../styles/Tender.css"
import NewAgreement from "./Tender/NewAgreement";
import Agreements from "./Orders/Agreements";
const routes = [
    {
        text: "Sifarişlər",
        link: "/orders",
        icon: FaCartArrowDown,
        component: Orders
    },
    {
        text: "Express Vendorlar",
        link: "/express-vendors",
        icon: MdLocalOffer,
        component: ExpressVendors
    },
    {
        text: "Potensial Vendorlar",
        link: "/potential-vendors",
        icon: IoIosBulb,
        component: PotentialVendors
    },
    {
        text: "Razılaşmalar",
        link: "/agreements",
        icon: FaTasks,
        component: Agreements,
        props: {
            params: {
                active: "id",
                number: "number",
            },
            method: "GET",
            link: "http://192.168.0.182:54321/api/tender-docs?doctype=1&",
            referer: "procurement"
        }
    },
    {
        text: "Yeni Razılaşma",
        link: "/new-agreement",
        icon: IoIosDocument,
        component: NewAgreement
    }
]
const Tender = (props) => {
    const { setMenuData, loadingIndicatorRef } = props;
    const { path, url } = useRouteMatch();
    useEffect(() => {
        setMenuData({ url: url, routes: routes });
        loadingIndicatorRef.current.style.transform = "translateX(0%)";
        loadingIndicatorRef.current.style.opacity = "0";
        loadingIndicatorRef.current.classList.add("load-to-start");
        props.leftNavRef.current.style.display = "block";
    }, [url, setMenuData, props.leftNavRef, loadingIndicatorRef])
    return (
        <Switch>
            {
                routes.map(route =>
                    <Route key={route.link} path={`${path}${route.link}/:docid?`}>
                        <route.component {...route.props} />
                    </Route>
                )
            }
            <Redirect to={`${path}/orders/:docid?`} />
        </Switch>
    )
}

export default Tender