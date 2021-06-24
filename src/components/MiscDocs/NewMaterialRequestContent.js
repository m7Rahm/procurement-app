import React, { lazy, useEffect, useState } from "react"
import useFetch from "../../hooks/useFetch";
import { NewMaterialRequestRow } from "./NewMaterialRequest";
import { FiChevronRight } from "react-icons/fi"
import { useHistory } from "react-router";
import Modal from "../Misc/Modal"
const NewMaterialFillForm = lazy(() => import("./NewMaterialFillForm"));
const NewMaterialRequestContent = (props) => {
    const { docid, docType } = props;
    const [docState, setDocState] = useState([]);
    const history = useHistory();
    const [modalState, setModalState] = useState({ content: null, visible: false, title: "" });
    const [modalContentProps, setModalContentProps] = useState({})
    const [units, setUnits] = useState([]);
    const fetchGet = useFetch("GET");
    const handleInfoClick = (id, name, unit) => {
        setModalContentProps({ units: units, title: name, unit: unit, id: id, setDocState })
        setModalState({ visible: true, content: NewMaterialFillForm, title: name })
    }
    const closeModal = () => {
        setModalState({ visible: false, content: null, title: "" })
    }
    useEffect(() => {
        const abortController = new AbortController();
        if (docid) {
            fetchGet(`http://192.168.0.182:54321/api/misc-new-material-request?docid=${docid}`, abortController)
                .then(respJ => {
                    if (respJ.length !== 0) {
                        setDocState(respJ)
                    }
                })
                .catch(ex => console.log(ex))
            fetchGet('http://192.168.0.182:54321/api/cluster-names')
                .then(respJ => setUnits(respJ))
                .catch(ex => console.log(ex))
        }
    }, [fetchGet, docid, docType]);
    const handleNavigationToMaterials = () => {
        history.push("/admin/materials", null)
    }
    return (
        <div style={{ marginTop: "10px" }}>
            {
                modalState.visible &&
                <Modal changeModalState={closeModal} childProps={modalContentProps} title={modalState.title}>
                    {modalState.content}
                </Modal>
            }
            <div style={{ padding: "1rem 20px", overflow: "hidden" }}>
                {
                    docState.length &&
                    <div style={{ float: "left", fontSize: "1.5rem" }}>{docState[0].number}</div>
                }
                {
                    props.referer === "inbox" &&
                    <div style={{ float: "right", fontSize: "1.5rem", cursor: "pointer" }} onClick={handleNavigationToMaterials}>
                        Məhsullar siyahısına keç
                    <span style={{ float: "right", fontSize: "1.5rem", verticalAlign: "middle" }} >
                            <FiChevronRight size="1.5rem" />
                        </span>
                    </div>
                }
            </div>
            <ul style={{ clear: "both" }} className="new-order-table">
                <li>
                    <div>#</div>
                    <div>Məhsul</div>
                    <div>Ölçü vahidi</div>
                    <div>Əlavə məlumat</div>
                    <div></div>
                </li>
                {
                    docState.map((material, index) =>
                        <NewMaterialRequestRow
                            index={index}
                            key={material.id}
                            id={material.id}
                            name={material.title}
                            unit={material.unit}
                            comment={material.comment}
                            units={units}
                            handleInfoClick={handleInfoClick}
                            referer={props.referer}
                            result={material.material_result}
                        />
                    )
                }
            </ul>
        </div>
    )
}
export default NewMaterialRequestContent