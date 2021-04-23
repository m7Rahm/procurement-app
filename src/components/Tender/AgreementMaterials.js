import React, { useState, useEffect, useRef } from "react"
import { FaTrashAlt } from "react-icons/fa"
import useFetch from "../../hooks/useFetch";
const AgreementMaterials = (props) => {
    const [agreementMaterials, setAgreementMaterials] = useState(undefined);
    const fetchFunction = props.fetchFunction;
    const setIsEmpty = props.setIsEmpty
    useEffect(() => {
        fetchFunction()
            .then(respJ => {
                if (respJ.length !== 0) {
                    setAgreementMaterials(respJ)
                }
            })
            .catch(ex => console.log(ex))
    }, [fetchFunction])
    useEffect(() => {
        if (agreementMaterials && agreementMaterials.length === 0)
            setIsEmpty(true)
    }, [agreementMaterials, setIsEmpty])
    return (
        agreementMaterials !== undefined
            ? <div style={{ maxWidth: "550px", margin: "auto", overflow: "visible" }}>
                <ul className="new-order-table">
                    <li style={{ width: "100%", background: "gainsboro" }}>
                        <div>#</div>
                        <div>Ad</div>
                        <div>Say</div>
                        {
                            props.editable &&
                            <div></div>
                        }
                    </li>
                    {
                        agreementMaterials.map((material, index) =>
                            <AgreementMaterialsSum
                                material={material}
                                key={material.id}
                                index={index}
                                editable={props.editable}
                                setAgreementMaterials={setAgreementMaterials}
                            />
                        )
                    }
                </ul>
            </div>
            : <h1>Məhsul tapılmadı..</h1>
    )
}
export default React.memo(AgreementMaterials)

const AgreementMaterialsSum = (props) => {
    const rowRef = useRef(null);
    const fetchPost = useFetch("POST");
    const handleMaterialDelete = () => {
        const data = {
            materialid: props.material.id
        };
        fetchPost("http://192.168.0.182:54321/api/remove-material-from-staging-area", data)
            .then(respJ => {
                if (respJ[0].operation_result === "success") {
                    rowRef.current.classList.add("delete-row");
                    rowRef.current.addEventListener("animationend", () => {
                        props.setAgreementMaterials(prev => prev.filter(material => material.id !== props.material.id))
                    })
                }
            })
    }
    return (
        <li ref={rowRef} style={{ cursor: "default" }}>
            <div>{props.index + 1}</div>
            <div>{props.material.title}</div>
            <div>{props.material.amount}</div>
            {
                props.editable &&
                <div>
                    <FaTrashAlt color="red" cursor="pointer" onClick={handleMaterialDelete} />
                </div>
            }
        </li >
    )
}