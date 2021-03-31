import React, { useEffect, useState } from "react"
import Modal from "../Misc/Modal"
const DecomInventoryNumbers = (props) => {
    const { docid } = props;
    const [invenNums, setInvenNums] = useState([]);
    useEffect(() => {
        let mounted = true;
        const abortController = new AbortController();
        if (mounted && docid)
            fetch("http://192.168.0.182:54321/api/decomission-inven-nums?d=" + docid, {
                signal: abortController.signal,
                headers: {
                    "Authorization": "Bearer " + props.token
                }
            })
                .then(resp => resp.json())
                .then(respJ => {
                    if (mounted)
                        setInvenNums(respJ)
                })
                .catch(ex => console.log(ex))
        return () => {
            abortController.abort();
            mounted = false;
        }
    }, [docid, props.token]);

    return (
        props.visible &&
        <Modal style={{ width: "200px", minWidth: "auto" }} childProps={{ nums: invenNums }} changeModalState={props.closeModal}>
            {Nums}
        </Modal>
    )
}
const Nums = (props) => {
    const { nums } = props
    return (
        <ul>
            {
                nums.map(num =>
                    <li key={num.id}>
                        {num.inventory_num}
                    </li>
                )
            }
        </ul>
    )
}
export default DecomInventoryNumbers