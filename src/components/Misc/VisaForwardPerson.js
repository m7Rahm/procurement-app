import React, { useRef } from 'react'
import {
    IoIosClose
} from 'react-icons/io'
const VisaForwardPerson = (props) => {
    const elem = useRef(null);
    const handleClick = (emp) => {
        props.handleSelectChange(emp);
    }
    const onDragStart = () => {
        setTimeout(() => { elem.current.style.opacity = "0" }, 1)
        props.draggedElement.current = { props: props, elem: elem }
    }
    const onDragEnd = (e) => {
        elem.current.style.opacity = "1"
    }
    const onDragEnter = (e) => {
        const parent = e.target.parentElement;
        const draggedElement = props.draggedElement.current.props.emp;
        if ((e.target.classList.contains("forwarded-person-card") || parent.classList.contains("forwarded-person-card")) && props.id !== draggedElement.id)
            props.setReceivers(prev => {
                const draggedIndex = prev.findIndex(card => card.id === draggedElement.id);
                const elementsBeforeIndex = prev.slice(0, draggedIndex > props.index ? props.index : props.index + 1);
                const before = elementsBeforeIndex.filter(card => card.id !== draggedElement.id)
                const elementsAfterIndex = prev.slice(draggedIndex > props.index ? props.index : props.index + 1);
                const after = elementsAfterIndex.filter(card => card.id !== draggedElement.id)
                return [...before, draggedElement, ...after]
            })
    }
    return (
        <div
            ref={elem}
            className="forwarded-person-card"
            draggable="true"
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            style={{
                left: "0px"
            }}
        >
            <div onClick={() => handleClick(props.emp)}>
                <IoIosClose size="18" />
            </div>
            <div
                style={{ cursor: "pointer" }}
            >
                {props.emp.full_name}
            </div>
        </div>
    )
}
export default VisaForwardPerson