import React, { useState, useRef } from 'react'
import { FaEdit, FaEdge, FaCheck, FaTimes } from 'react-icons/fa'
import { workSectors } from '../../data/data'
import useFetch from '../../hooks/useFetch';

const PotentialVendor = (props) => {
    const [disabled, setDisabled] = useState(true);
    const nameRef = useRef(null);
    const voenRef = useRef(null);
    const sphereRef = useRef(null);
    const fetchPost = useFetch("POST");
    const handleEditStart = () => {
        setDisabled(prev => !prev)
    }
    const revertChanges = () => {
        nameRef.current.value = props.name;
        voenRef.current.value = props.voen;
        sphereRef.current.value = props.sphere;
        setDisabled(prev => !prev)
    }
    const updateVendor = () => {
        const data = {
            id: props.id,
            name: nameRef.current.value,
            voen: voenRef.current.value,
            sphere: sphereRef.current.value
        };
        fetchPost('http://192.168.0.182:54321/api/update-potential-vendor', data)
            .then(respJ => {
                if (respJ[0].operation_result === 'success') {
                    props.setOperationResult({ visible: true, desc: 'Əməliyyat uğurla tamamlandı', icon: FaCheck })
                    setDisabled(true)
                }
            })
            .catch(ex => console.log(ex))
    }
    return (
        <li>
            <div style={{ textAlign: 'center' }}>
                {props.index + 1}
            </div>
            <div>
                <input disabled={disabled} ref={nameRef} defaultValue={props.name} />
            </div>
            <div>
                <input disabled={disabled} ref={voenRef} defaultValue={props.voen} />
            </div>
            <div>
                <select disabled={disabled} ref={sphereRef} defaultValue={props.sphere}>
                    {
                        workSectors.map(sector =>
                            <option key={sector.val} value={sector.val}>{sector.text}</option>
                        )
                    }
                </select>
            </div>
            <div style={{ textAlign: 'center' }}>
                {
                    props.can_be_express &&
                    <FaEdge onClick={() => props.makeExpressVendor(props.id, props.name)} color="rgb(255, 174, 0)" cursor="pointer" />
                }
            </div>
            <div style={{ textAlign: 'center' }}>
                {
                    disabled ?
                        <FaEdit onClick={handleEditStart} cursor="pointer" />
                        : <>
                            <FaCheck onClick={updateVendor} />
                            <FaTimes onClick={revertChanges} />
                        </>
                }
            </div>
        </li>
    )
}

export default React.memo(PotentialVendor)