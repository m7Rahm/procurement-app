import React, { lazy, useEffect, useState } from "react"
import { AiFillCheckCircle } from "react-icons/ai"
import { FaInfoCircle } from "react-icons/fa"
import OperationResult from "../Misc/OperationResult"
import EmptyContent from "../Misc/EmptyContent"
import useFetch from "../../hooks/useFetch"
import Modal from "../Misc/Modal"
import ProductHistory from "../modal content/ProductHistory"
const RightInfoBar = lazy(() => import("../Misc/RightInfoBar"))
const AgreementsList = lazy(() => import("../Misc/AgreementsList"));
const AgreementContent = (props) => {
    const state = window.history.state
    const modalInitState = state && state.sid ? { visible: true, title: state.t, subGlCategory: state.sid, productid: state.pid } : { visible: false }
    const [orderContent, setOrderContent] = useState([]);
    const [modal, setModal] = useState(modalInitState)
    const [rightBarState, setRightBarState] = useState({ visible: false, id: null });
    const [operationResult, setOperationResult] = useState({
        visible: false,
        desc: "",
        backgroundColor: "white",
        iconColor: "rgb(15, 157, 88)",
        icon: AiFillCheckCircle
    });
    const active = props.active
    const fetchGet = useFetch("GET")
    useEffect(() => {
        if (active) {
            fetchGet(`http://192.168.0.182:54321/api/get-tender-order-content/${active}`)
                .then(respJ => {
                    if (respJ)
                        setOrderContent(respJ)
                })
                .catch(ex => console.log(ex))
        }
    }, [active, fetchGet]);
    const setEmpty = () => {
        props.setActive(props.activeInit)
    }
    const closeModal = () => {
        window.history.replaceState(null, "", window.location.href)
        setModal(prev => ({ ...prev, visible: false }))
    }
    return (
        <div className="visa-content-container" style={{ maxWidth: "1256px", margin: "auto", paddingTop: "76px" }}>
            {
                operationResult.visible &&
                <OperationResult
                    setOperationResult={setOperationResult}
                    operationDesc={operationResult.desc}
                    iconColor={operationResult.iconColor}
                    icon={operationResult.icon}
                />
            }
            {
                active && orderContent.length !== 0 ?
                    <>
                        {
                            modal.visible &&
                            <Modal title={modal.title} style={{ minHeight: "450px" }} childProps={modal} changeModalState={closeModal}>
                                {ProductHistory}
                            </Modal>
                        }
                        <div className="ready-order-header">
                            <h1>Sifariş № {props.ordNumb}</h1>
                            <h1>{props.departmentName}</h1>
                        </div>
                        <ul className="new-order-table order-table-protex">
                            <li>
                                <div>#</div>
                                <div style={{ textAlign: "left" }}>Material</div>
                                <div style={{ maxWidth: "140px" }}>Say</div>
                                <div>Əlavə məlumat</div>
                                <div></div>
                                <div style={{ width: "100px" }}>Status</div>
                            </li>
                            {
                                orderContent.map((material, index) =>
                                    <AgreementMaterial
                                        key={material.id}
                                        index={index}
                                        setModal={setModal}
                                        material={material}
                                        setRightBarState={setRightBarState}
                                        setInitData={props.setInitData}
                                        setOperationResult={setOperationResult}
                                        setEmpty={setEmpty}
                                    />
                                )
                            }
                        </ul>
                        {
                            rightBarState.visible &&
                            <RightInfoBar setRightBarState={setRightBarState}>
                                <AgreementsList
                                    id={rightBarState.id}
                                    active={active}
                                />
                            </RightInfoBar>
                        }
                    </>
                    :
                    <EmptyContent />
            }
        </div>
    )
}
export default React.memo(AgreementContent)

const getMaterialState = (result) => {
    if (result === 30)
        return "Razılaşmada"
    else if (result === 31)
        return "Razılaşdırılıb"
    else if (result === 20)
        return "Təhvil verilib"
    else if (result === 77)
        return "Ödəniş razılaşdırılıb"
    else
        return ""
}
const AgreementMaterial = (props) => {
    const [materialState, setMaterialState] = useState(props.material);
    const stateText = getMaterialState(materialState.result);
    const fetchPost = useFetch("POST")
    const handleInfoClick = () => {
        props.setRightBarState({ visible: true, id: materialState.id })
    }
    const showHistory = () => {
        const data = { pid: materialState.product_id, sid: materialState.sub_gl_category_id, t: materialState.title }
        window.history.replaceState(data, "", window.location.href)
        props.setModal({
            visible: true,
            title: materialState.title,
            productid: materialState.product_id,
            subGlCategory: materialState.sub_gl_category_id
        })
    }
    const sendToAgreement = () => {
        const data = {
            id: materialState.id
        };
        fetchPost("http://192.168.0.182:54321/api/send-to-staging-area", data)
            .then(respJ => {
                if (!respJ.length || !respJ[0].error) {
                    setMaterialState(prev => ({ ...prev, result: 30 }))
                    props.setOperationResult(prev => ({ ...prev, ...{ visible: true, desc: "Əməliyyat uğurla tamamlandı" } }));
                    if (respJ.length !== 0 && respJ[0].order_status) {
                        props.setInitData(prev => ({ ...prev }))
                        props.setEmpty()
                    }
                } else if (respJ.length > 2 || respJ[0].error)
                    props.setOperationResult({ visible: true, desc: respJ[0].error })
            })
            .catch(ex => console.log(ex))
    }
    return (
        <li>
            <div>{props.index + 1}</div>
            <div onClick={showHistory} style={{ cursor: "pointer" }}>{materialState.title}</div>
            <div style={{ maxWidth: "140px" }}>{materialState.amount}</div>
            <div>{materialState.comment}</div>
            <div>
                {
                    materialState.result !== 31 && materialState.result !== 77 && materialState.result !== 20 && materialState.result !== 25 &&
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", width: "100%" }} >
                        <div
                            style={{ backgroundColor: "#f8942a", color: "white", padding: "10px 20px", cursor: "pointer" }}
                            onClick={sendToAgreement}
                        >
                            Razılaşmaya
                        </div>
                    </div>
                }
            </div>
            <div style={{ width: "100px" }}>
                {stateText}
                <span style={{ padding: "6px", cursor: "pointer" }}>
                    <FaInfoCircle size="14" color="royalblue" onClick={handleInfoClick} />
                </span>
            </div>
        </li>
    )
}