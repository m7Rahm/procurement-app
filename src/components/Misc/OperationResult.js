import React, { useCallback, useEffect, useRef } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
const OperationResult = (props) => {
    const { operationDesc, show, setOperationResult } = props;
    const count = useRef(0);
    const setOperationResultCallback = useCallback(setOperationResult, [])
    const operationResultRef = useRef(null);

    useEffect(() => {
        if (operationResultRef.current)
            operationResultRef.current.addEventListener('animationend', () => {
                count.current += 1;
                if (count.current === 2) {
                    count.current = 0;
                    setOperationResultCallback({ visible: false, desc: '' })
                }
            }, false)
    }, [show, setOperationResultCallback])
    return (
        <div ref={operationResultRef} style={{ backgroundColor: '#D93404' }} className="operation-result">
            <div>
                <IoIosCloseCircle size="88" />
            </div>
            {operationDesc}
        </div>
    )
}
export default OperationResult