import React, { useEffect, useState } from "react"
const PaymentMaterials = (props) => {
    const [materials, setMaterials] = useState([]);
    useEffect(() => {
        let mounted = true;
        const abortController = new AbortController();
        if (mounted && props.pid) {
            fetch(`http://192.168.0.182:54321/api/payment-materials?pid=${props.pid}`, {
                signal: abortController.signal,
                headers: {
                    "Authorization": "Bearer " + props.token
                }
            })
                .then(resp => resp.ok ? resp.json() : new Error("Internal Server Error"))
                .then(respJ => {
                    if (mounted)
                        setMaterials(respJ)
                })
                .catch(ex => console.log(ex))
        }
        return () => {
            mounted = false;
            abortController.abort();
        }
    }, [props.token, props.pid])
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