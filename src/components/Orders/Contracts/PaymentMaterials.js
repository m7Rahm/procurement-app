import React, { useEffect, useState } from "react"
import useFetch from "../../../hooks/useFetch";
const PaymentMaterials = (props) => {
    const [materials, setMaterials] = useState([]);
    const fetchGet = useFetch("GET");
    useEffect(() => {
        let mounted = true;
        const abortController = new AbortController();
        if (mounted && props.pid) {
            fetchGet(`http://192.168.0.182:54321/api/payment-materials?pid=${props.pid}`)
                .then(respJ => {
                    if (mounted){
                        props.materialsRef.current = respJ
                        setMaterials(respJ)
                    }
                })
                .catch(ex => console.log(ex))
        }
        return () => {
            mounted = false;
            abortController.abort();
        }
    }, [fetchGet, props.pid, props.materialsRef])
    return (
        <table className="users-table">
            <thead>
                <tr>
                    <th style={{ textAlign: "center" }}>#</th>
                    <th style={{ textAlign: "center" }}>Ad</th>
                    <th style={{ textAlign: "center" }}>Say</th>
                    <th style={{ textAlign: "center" }}>Vendor</th>
                    <th style={{ textAlign: "center" }}>VÖEN</th>
                    <th style={{ textAlign: "center" }}>Müqavilə №</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    materials.map((material, index) =>
                        <tr key={material.id}>
                            <td style={{ position: "relative" }}>
                                {index + 1}
                            </td>
                            <td>{material.material_name}</td>
                            <td style={{ maxWidth: "50px" }}>
                                {material.amount}
                            </td>
                            <td style={{ minWidth: "200px" }}>
                                {material.vendor_name}
                            </td>
                            <td style={{ minWidth: "200px" }}>
                                {material.voen}
                            </td>
                            <td style={{ position: "relative" }}>
                                {material.contract_number}
                            </td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    )
}

export default PaymentMaterials