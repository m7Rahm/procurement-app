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
            updateListContent: (data, token) => {
                let query = Object.keys(data).reduce((sum, key) => sum += `${key}=${data[key]}&`, "");
                query = query.substring(0, query.length - 1);
                return fetch("http://192.168.0.182:54321/api/tender-docs?doctype=1&" + query, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            },
            params: {
                active: "id",
                number: "number"
            },
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
    const setMenuData = props.setMenuData;
    const { path, url } = useRouteMatch();
    useEffect(() => {
        setMenuData({ url: url, routes: routes });
        props.leftNavRef.current.style.display = "block";
    }, [url, setMenuData, props.leftNavRef])
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