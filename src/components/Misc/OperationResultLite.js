import React from "react"

const OperationResultLite = (props) => {
    return (
        props.state === true &&
        <div className="operation-result-lite">
            {props.text}
        </div>
    )
}

export default OperationResultLite