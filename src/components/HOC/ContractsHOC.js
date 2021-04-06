import React, { useState, lazy, useEffect, useCallback } from "react"
import OrdersSearchHOC from "..//Search/OrdersSearchHOC"
import AgreementCard from "../VisaCards/AgreementCard"
import SideBarContainer from "../HOC/SideBarContainer"
import CardsList from "../HOC/CardsList"
import { FaPlus } from "react-icons/fa"
import { optionsAgreements } from "../../data/data"
import { useParams } from "react-router-dom"
import useFetch from "../../hooks/useFetch"
const Modal = lazy(() => import("..//Misc/Modal"))
const NewContract = lazy(() => import("../Contracts/NewContract"))
const NewPayment = lazy(() => import("../Contracts/NewPayment"))
const SideBarContent = CardsList(AgreementCard);
const Search = OrdersSearchHOC(optionsAgreements);
const SideBar = React.memo(SideBarContainer(Search, SideBarContent));

const ContractsHOC = (Content) => function Payments(props) {
    const [modalState, setModalState] = useState({ visible: false, content: null });
    const [initData, setInitData] = useState(props.inData);
    const fetchPost = useFetch("POST");
    const fetchGet = useFetch("GET");
    const { method, link, transformData } = props;
    const updateListContent = useCallback((data) => {
        const apiData = !transformData ? data : transformData(data);
        if (method === "GET")
            return fetchGet(link + apiData)
        else
            return fetchPost(link, apiData)
    }, [fetchPost, link, fetchGet, method, transformData])
    const { docid } = useParams()
    const [active, setActive] = useState({
        active: docid
    });
    useEffect(() => {
        let mounted = true;
        if (mounted && docid) {
            setActive(prev => ({ ...prev, active: docid }))
        }
        return () => {
            mounted = false
        }
    }, [docid])
    const apiString = active.active ? `http://192.168.0.182:54321/api/doc-content?doctype=${props.docType}&docid=${active.active}` : ""
    const closeModal = () => {
        setModalState({ visible: false, content: null })
    }
    const handleNewContractClick = () => {
        const component = props.docType === 3 ? NewPayment : NewContract
        setModalState({ visible: true, content: component, setInitData: setInitData })
    }
    return (
        <div className="agreements-container" style={{ overflow: "auto" }}>
            <SideBar
                initData={initData}
                setActive={setActive}
                updateListContent={updateListContent}
                params={props.params}
                newDocNotifName={props.newDocNotifName}
            />
            <Content
                docid={active.active}
                referer={props.referer}
                apiString={apiString}
                setActive={setActive}
            />
            {
                props.referer === "procurement" &&
                <div onClick={handleNewContractClick} style={{ position: "fixed", bottom: "50px", right: "50px" }}>
                    <FaPlus size="28" color="#FFAE00" cursor="pointer" />
                </div>
            }
            {
                modalState.visible &&
                <Modal childProps={modalState} changeModalState={closeModal}>
                    {modalState.content}
                </Modal>
            }
        </div>
    )
}
export default ContractsHOC