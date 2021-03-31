import React, { useEffect } from "react"

import { Switch, Route, useRouteMatch } from "react-router-dom"
import ExpressContracts from "./Contracts/ExpressContracts"
import { FaFileContract, FaHandshake } from "react-icons/fa"
import { MdPayment } from "react-icons/md"
import ContractContent from "../components/Orders/Contracts/ContractContent"
import ContractsHOC from "../components/HOC/ContractsHOC"
import PaymentContent from "../components/Orders/Contracts/PaymentContent"
import "../styles/Tender.css"
const Contracts = ContractsHOC(ContractContent);
const Payments = ContractsHOC(PaymentContent);
const routes = [
    {
        text: "Müqavilə razılaşmaları",
        link: "/contracts",
        icon: FaHandshake,
        component: Contracts,
        props: {
            updateListContent: (data, token) => {
                let query = Object.keys(data).reduce((sum, key) => sum += `${key}=${data[key]}&`, "");
                query = query.substring(0, query.length - 1);
                return fetch("http://192.168.0.182:54321/api/tender-docs?doctype=2&" + query, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            },
            inData: {
                number: "",
                result: 0,
                from: 0,
                next: 20
            },
            params: {
                active: "id",
            },
            docType: 2,
            referer: "procurement"
        }
    },
    {
        text: "Müqavilələr",
        link: "/express-contracts",
        icon: FaFileContract,
        component: ExpressContracts
    },
    {
        text: "Ödəniş razılaşmaları",
        link: "/payments",
        icon: MdPayment,
        component: Payments,
        props: {
            updateListContent: (data, token) => {
                let query = Object.keys(data).reduce((sum, key) => sum += `${key}=${data[key]}&`, "");
                query = query.substring(0, query.length - 1);
                return fetch("http://192.168.0.182:54321/api/tender-docs?doctype=3&" + query, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            },
            inData: {
                number: "",
                result: 0,
                from: 0,
                next: 20
            },
            params: {
                active: "id",
            },
            referer: "procurement",
            docType: 3
        }
    }
]
const ContractsModule = (props) => {
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
                            <route.component {...route.props} />
                        </Route>
                    )
                }
            </Switch>
        </div>
    )
}

export default ContractsModule