import React, { useState, useEffect, useRef } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
const StagingAreaMaterials = (props) => {
    const [stagingAreaMaterials, setStagingAreaMaterials] = useState([])
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/get-agreement-in-staging-area', {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setStagingAreaMaterials(respJ))
            .catch(ex => console.log(ex))
    }, [props.token])
    return (
        stagingAreaMaterials.length !== 0 ?
        <ul className="new-order-table">
            <li>
                <div>#</div>
                <div>Ad</div>
                <div>Say</div>
                <div></div>
            </li>
            {
                stagingAreaMaterials.map((material, index) =>
                    <StagingAreaMaterialsSum
                        material={material}
                        key={material.id}
                        token={props.token}
                        index={index}
                        setStagingAreaMaterials={setStagingAreaMaterials}
                    />
                )
            }
        </ul>
        : <h3>Məhsul tapılmadı..</h3>
    )
}
export default StagingAreaMaterials

const StagingAreaMaterialsSum = (props) => {
    const rowRef = useRef(null);
    const handleMaterialDelete = () => {
        const data = JSON.stringify({
            materialid: props.material.id
        });
        console.log(data);
        fetch('http://172.16.3.101:54321/api/remove-material-from-staging-area', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + props.token,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            body: data
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].operation_result === 'success') {
                    rowRef.current.classList.add('delete-row');
                    rowRef.current.addEventListener('animationend', () => {
                        props.setStagingAreaMaterials(prev => prev.filter(material => material.id !== props.material.id))
                    })
                }
            })
    }
    return (
        <li ref={rowRef} style={{ cursor: 'default' }}>
            <div>{props.index + 1}</div>
            <div>{props.material.title}</div>
            <div>{props.material.amount}</div>
            <div><FaTrashAlt color="red" cursor="pointer" onClick={handleMaterialDelete} /></div>
        </li >
    )
}