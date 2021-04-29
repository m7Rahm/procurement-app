import React, { useState, useEffect, useContext, useCallback, useRef, lazy, Suspense } from "react"
import ForwardDocLayout from "../Misc/ForwardDocLayout"
import ContractFiles from "./ContractFiles"
import { WebSocketContext } from "../../pages/SelectModule"
import PaymentOrderMaterials from "./PaymentOrderMaterials"
import useFetch from "../../hooks/useFetch"
import { TokenContext } from "../../App"
const OperationResult = lazy(() => import("../Misc/OperationResult"))
const NewPayment = (props) => {
    const [operationResult, setOperationResult] = useState({ visible: false, desc: "" })
    const [files, setFiles] = useState([]);
    const [orderState, setOrderState] = useState({ materials: [], numbers: [], all: {} });
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token
    const fetchGet = useFetch("GET");
    const webSocket = useContext(WebSocketContext);
    const fetchAgreements = useCallback((controller) => fetchGet("http://192.168.0.182:54321/api/payment-ready-orders", controller), [fetchGet])
    const getOrderMaterials = useCallback((order) => {
        const { number, id } = order;
        fetchGet(`http://192.168.0.182:54321/api/order-materials?orderid=${id}`)
            .then(respJ => {
                setOrderState(prev => {
                    if (!prev.numbers.find(order => order.number === number)) {
                        let newState = [];
                        if (prev.materials.length === 0)
                            newState = respJ.map(material => ({ ...material, order: material.id }));
                        else {
                            newState = prev.materials.map(mat => {
                                const elem = respJ.find(material => material.material_id === mat.material_id)
                                return { ...mat, order: !mat.order ? mat.id : mat.order, amount: elem ? mat.amount + elem.amount : mat.amount }
                            });
                            const newMaterials = respJ
                                .filter(material => !prev.materials.find(mat => material.material_id === mat.material_id))
                                .map(material => ({ ...material, order: material.id }));
                            newState = [...newState, ...newMaterials]
                        }
                        return { materials: newState, numbers: [...prev.numbers, { id: id, number: number }], all: { ...prev.all, [number]: respJ } }
                    } else
                        return prev
                })
            })
            .catch(ex => console.log(ex))
    }, [fetchGet]);
    const handleSendClick = (users, comment) => {
        const malformedMaterialRow = orderState.materials.find(material => !material.contract_id);
        if (malformedMaterialRow)
            setOperationResult({ visible: true, desc: "Məhsulların siyahısı düzgün doldurulmamışdır" })
        else if (users.length === 0)
            setOperationResult({ visible: true, desc: "Yönləndiriləcək istifadəçilər seçilməyib" })
        else {
            const formData = new FormData();
            const receivers = users.map((user, index) => [user.id, index === 0 ? 1 : 0]);
            const paymentOrders = orderState.numbers.map(order => [order.id, 10]);
            const paymentMaterials = orderState.materials.map(material => [material.material_id, material.amount, material.contract_id]);
            formData.append("paymentMaterials", JSON.stringify(paymentMaterials));
            formData.append("relatedDocs", JSON.stringify(paymentOrders));
            formData.append("receivers", JSON.stringify(receivers));
            formData.append("comment", comment);
            formData.append("type", 3);
            for (let i = 0; i < files.length; i++)
                formData.append("files", files[i])
            fetch("http://192.168.0.182:54321/api/contract-agreement", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token
                },
                body: formData
            })
                .then(resp => resp.json())
                .then(respJ => {
                    if (respJ.length !== 0) {
                        const message = {
                            message: "notification",
                            receivers: respJ.map(receiver => ({ id: receiver.receiver_id, notif: "nP" })),
                            data: undefined
                        }
                        webSocket.send(JSON.stringify(message))
                    }
                    props.closeModal();
                    props.setInitData({
                        result: 0,
                        from: 0,
                        next: 20
                    })
                })
                .catch(ex => console.log(ex))
        }
    }
    const removeFile = useCallback((files) => {
        setFiles(prev => prev.filter(doc => doc.name !== files.name))
    }, [])
    const handleChange = useCallback((e) => {
        const files = { ...e.target.files };
        files.length = e.target.files.length
        e.target.value = null
        setFiles(prev => {
            const newFiles = [];
            let unique = true;
            if (prev.length !== 0) {
                for (let j = 0; j < files.length; j++) {
                    for (let i = 0; i < prev.length; i++) {
                        if (files[j].name === prev[i].name) {
                            unique = false;
                            break;
                        }
                    }
                    if (unique) {
                        const ext = files[j].name.split('.').pop();
                        files[j].ext = ext;
                        newFiles.push(files[j]);
                    }
                    unique = true;
                }
                return [...prev, ...newFiles]
            }
            else {
                for (let i = 0; i < files.length; i++) {
                    const ext = files[i].name.split('.').pop();
                    files[i].ext = ext;
                    newFiles.push(files[i]);
                }
                return newFiles
            }
        })
    }, []);
    return (
        <div>
            <Suspense fallback="">
                {
                    operationResult.visible &&
                    <OperationResult
                        setOperationResult={setOperationResult}
                        operationDesc={operationResult.desc}
                        backgroundColor={"gainsboro"}
                    />
                }
            </Suspense>
            <AgreementsList
                header="Sifarişlər"
                type="1"
                fetchFun={fetchAgreements}
                handleClick={getOrderMaterials}
            />
            <div style={{ float: "right", marginRight: "10px", minWidth: "600px" }}>
                {
                    orderState.materials.length !== 0 &&
                    <PaymentOrderMaterials
                        materials={orderState.materials}
                        numbers={orderState.numbers}
                        setOrderState={setOrderState}
                    />
                }
            </div>
            <div style={{ clear: "both" }}>
                <ContractFiles
                    files={files}
                    addFiles={handleChange}
                    removeFile={removeFile}
                />
            </div>

            <ForwardDocLayout
                handleSendClick={handleSendClick}
            />
        </div>
    )
}
export default NewPayment

const AgreementsList = React.memo((props) => {
    const [documents, setDocuments] = useState({ all: [], available: [], visible: [], offset: 2 });
    const containerRef = useRef(null);
    const fetchFun = props.fetchFun
    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();
        fetchFun(controller)
            .then(respJ => {
                if (mounted)
                    setDocuments({ all: respJ, available: respJ, visible: respJ.slice(0, Math.round(200 / 36)), offset: 2 })
            })
            .catch(ex => console.log(ex))
        return () => {
            controller.abort();
            mounted = false
        }
    }, [fetchFun]);
    const handleVendorSearch = (e) => {
        const value = e.target.value;
        containerRef.current.scrollTop = 0;
        setDocuments(prev => {
            const available = prev.all.filter(document => document.number.toLowerCase().includes(value))
            return ({ ...prev, available: available, visible: available.slice(0, Math.round(200 / 36)), offset: 2 })
        })
    }
    const handleScroll = (e) => {
        const offsetTop = e.target.scrollTop;
        const next = Math.round(200 / 36);
        setDocuments(prev => {
            const offset = Math.round(offsetTop / 36);
            const start = offset > 2 ? offset - 2 : 0;
            const end = start + next + 2 <= prev.available.length ? start + next + 2 : prev.available.length;
            return ({ ...prev, visible: prev.available.slice(start, end), offset: offset > 2 ? offset : 2 })
        })
    }
    return (
        <div style={{ float: "left" }}>
            <h1 style={{ textAlign: "center", fontSize: "22px", marginLeft: "10px" }}>{props.header}</h1>
            <div style={{ width: "312px", padding: "5px 4px" }}>
                <input style={{ display: "block", width: "100%", padding: "3px" }} type="text" onChange={handleVendorSearch} />
                <div style={{ height: "200px", position: "relative", overflow: "auto" }} ref={containerRef} onScroll={handleScroll}>
                    <ul style={{ height: 36 * documents.available.length, width: "100%" }} className="vendors-list">
                        {
                            documents.visible.map((document, index) =>
                                <li
                                    key={`${document.id}-${props.type}`}
                                    onClick={() => props.handleClick(document, props.type)}
                                    style={{ top: (documents.offset + index - 2) * 36 + "px" }}
                                >
                                    {document.number}
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
})
