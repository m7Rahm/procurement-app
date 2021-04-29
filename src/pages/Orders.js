import React, { useEffect } from "react"
import MyOrders from "./Orders/MyOrders"
import Visas from "./Orders/Visas"
import Agreements from "./Orders/Agreements"
import ContractsHOC from "../components/HOC/ContractsHOC"
import { IoMdDocument, IoMdCheckmarkCircleOutline, IoMdCart } from "react-icons/io"
import { FaHandshake } from "react-icons/fa"
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom"
import { MdPayment } from "react-icons/md"
import "../styles/Orders.css"
import PaymentContent from "../components/Orders/Contracts/PaymentContent"
import ContractContent from "../components/Orders/Contracts/ContractContent"

const Contracts = ContractsHOC(ContractContent);
const Payments = ContractsHOC(PaymentContent);
const routes = [
    {
        text: "Sifarişlərim",
        link: "/my-orders",
        icon: IoMdCart,
        component: MyOrders,
        props: {
            inParams: {
                dateFrom: '',
                dateTill: '',
                status: -3,
                date: '',
                ordNumb: "",
                departments: []
            },
            method: "POST",
            link: "http://192.168.0.182:54321/api/orders",
            referer: "protected"
        }
    },
    {
        text: "Redaktəyə qaytarılmış",
        link: "/returned",
        icon: IoMdDocument,
        component: MyOrders,
        props: {
            inParams: {
                dateFrom: '',
                dateTill: '',
                status: -3,
                date: '',
                ordNumb: ""
            },
            method: "GET",
            link: "http://192.168.0.182:54321/api/returned-orders?from=0&until=20",
            referer: "returned",
            inLink: (from) => `http://192.168.0.182:54321/api/returned-orders?from=${from}&until=20`
        }
    },
    {
        text: "Vizalar",
        link: "/visas",
        icon: IoMdCheckmarkCircleOutline,
        component: Visas
    },
    {
        text: "Q/T razılaşmaları",
        link: "/agreements",
        icon: IoMdCart,
        component: Agreements,
        props: {
            link: "http://192.168.0.182:54321/api/get-user-agreements",
            params: {
                active: "message_id",
                number: "number",
            },
            method: "POST",
            newDocNotifName: "nA"
        }
    },
    {
        text: "Müqavilə razılaşmaları",
        link: "/contracts",
        icon: FaHandshake,
        component: Contracts,
        props: {
            link: "http://192.168.0.182:54321/api/get-user-contracts",
            method: "POST",
            inData: {
                number: "",
                result: 0,
                from: 0,
                next: 20
            },
            params: {
                active: "message_id",
                tranid: "id",
                number: "number"
            },
            docType: 2,
            newDocNotifName: "nC"
        }
    },
    {
        text: "Ödəniş razılaşmaları",
        link: "/payments",
        icon: MdPayment,
        component: Payments,
        props: {
            link: "http://192.168.0.182:54321/api/get-user-payments",
            method: "POST",
            inData: {
                number: "",
                result: 0,
                from: 0,
                next: 20
            },
            params: {
                active: "message_id"
            },
            docType: 3,
            newDocNotifName: "nP"
        }
    }
];

const Orders = (props) => {
    const { setMenuData, loadingIndicatorRef } = props;
    const { path, url } = useRouteMatch()
    useEffect(() => {
        loadingIndicatorRef.current.style.transform = "translateX(0%)";
        loadingIndicatorRef.current.style.opacity = "0";
        loadingIndicatorRef.current.classList.add("load-to-start");
        setMenuData({ url: url, routes: routes });
        props.leftNavRef.current.style.display = "block";
    }, [url, setMenuData, props.leftNavRef, loadingIndicatorRef]);
    return (
        <div className="dashboard">
            <Switch>
                {
                    routes.map(route =>
                        <Route key={route.link} path={`${path}${route.link}`}>
                            <route.component {...route.props} />
                        </Route>
                    )
                }
                <Redirect to={`${path}/my-orders`} />
            </Switch>
        </div>
    )
}
export default Orders