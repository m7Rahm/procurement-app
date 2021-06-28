import React, { useContext, useEffect, useRef, useState } from "react"
import { FaCheck, FaInfo, FaTimes, FaTrashAlt } from "react-icons/fa"
import useFetch from "../../hooks/useFetch"
import { WebSocketContext } from "../../pages/SelectModule"
const itemInit = { id: Date.now(), name: "", unit: "1", comment: "", className: "" }

const NewMaterialRequest = (props) => {
    const fetchGet = useFetch("GET");
    const fetchPost = useFetch("POST");
    const [materials, setMaterials] = useState([itemInit]);
    const [units, setUnits] = useState([]);
    const textareaRef = useRef(null);
    const webSocket = useContext(WebSocketContext)
    useEffect(() => {
        props.modalWrapperRef.current.style.width = "50rem";
        fetchGet('http://192.168.0.182:54321/api/cluster-names')
            .then(respJ => setUnits(respJ))
            .catch(ex => console.log(ex))
    }, [props.modalWrapperRef, fetchGet]);
    const handleRowDelete = (e) => {
        const target = e.target.closest("li");
        const id = target.id;
        target.classList.add("delete-row");
        target.addEventListener('animationend', () => setMaterials(prev => prev.filter(material => material.id !== id)))
    }
    const addNewMaterial = () => {
        setMaterials(prev => [...prev, { ...itemInit, id: Date.now(), class: 'new-row' }])
    }
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const target = e.target.closest("li");
        const id = target.id;
        // eslint-disable-next-line
        setMaterials(prev => prev.map(material => material.id == id ? ({ ...material, [name]: value }) : material));
    }
    const handleSendClick = () => {
        const mats = materials.map(material => [material.name, material.unit, material.comment])
        const data = {
            materials: mats,
            comment: textareaRef.current.value
        }
        fetchPost("http://192.168.0.182:54321/api/new-misc-material-req", data)
            .then(respJ => {
                const message = {
                    message: "notification",
                    receivers: respJ.map(receiver => ({ id: receiver.receiver_id, notif: "nO" })),
                    data: undefined
                }
                props.closeModal();
                props.setInitData(prev => ({ ...prev }))
                webSocket.send(JSON.stringify(message))
            })
            .catch(ex => console.log(ex))
    }
    return (
        <div>
            <ul className="new-order-table">
                <li>
                    <div>#</div>
                    <div>Məhsul</div>
                    <div>Ölçü vahidi</div>
                    <div>Əlavə məlumat</div>
                    <div style={{ fontSize: "20px", cursor: "pointer" }} onClick={addNewMaterial}>+</div>
                </li>
                {
                    materials.map((material, index) =>
                        <NewMaterialRequestRow
                            index={index}
                            id={material.id}
                            className={material.class}
                            name={material.name}
                            handleChange={handleChange}
                            handleRowDelete={handleRowDelete}
                            unit={material.unit}
                            comment={material.comment}
                            units={units}
                            key={material.id}
                            referer="new-request"
                        />
                    )
                }
            </ul>
            <textarea ref={textareaRef} style={{ display: "block", width: "calc(100% - 40px)", margin: "auto" }} />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div className="send-order" onClick={handleSendClick}>
                    Göndər
                </div>
            </div>
        </div>
    )
}

export default NewMaterialRequest

export const NewMaterialRequestRow = (props) => {
    return (
        <li id={props.id} className={props.className}>
            <div>{props.index + 1}</div>
            <div><input name="name" disabled={props.referer !== "new-request"} value={props.name} onChange={props.handleChange} placeholder="Məhsulun adı" /></div>
            <div>
                <select name="unit" disabled={props.referer !== "new-request"} value={props.unit} onChange={props.handleChange}>
                    {
                        props.units.map(unit =>
                            <option value={unit.id} key={unit.id}>{unit.title}</option>
                        )
                    }
                </select>
            </div>
            <div><input name="comment" disabled={props.referer !== "new-request"} value={props.comment} onChange={props.handleChange} placeholder="Əlavə məlumat" /></div>
            <div>
                {
                    props.referer === "new-request" ?
                        <FaTrashAlt cursor="pointer" onClick={props.handleRowDelete} title="Sil" color="#ff4a4a" />
                        : props.result === 1
                            ? <FaCheck cursor="pointer" />
                            : props.result === -1
                                ? <FaTimes cursor="pointer" />
                                : props.referer === "inbox"
                                    ? <FaInfo onClick={() => props.handleInfoClick(props.id, props.name, props.unit)} cursor="pointer" />
                                    : null
                }
            </div>
        </li>
    )
}