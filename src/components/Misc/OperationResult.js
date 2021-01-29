import React, { useCallback, useEffect, useRef } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
const OperationResult = (props) => {
    const {
        operationDesc,
        setOperationResult,
        icon: Icon = IoIosCloseCircle,
        iconColor = "#D93404",
        backgroundColor = 'transparent'
    } = props;
    const count = useRef(0);
    const setOperationResultCallback = useCallback(setOperationResult, []);
    const operationResultRef = useRef(null);
    useEffect(() => {
        if (operationResultRef.current)
            operationResultRef.current.addEventListener('animationend', () => {
                count.current += 1;
                if (count.current === 2) {
                    count.current = 0;
                    setOperationResultCallback(prev => ({ ...prev, visible: false, desc: '' }))
                }
            }, false)
    }, [setOperationResultCallback])
    return (
        <div ref={operationResultRef} style={{ backgroundColor: backgroundColor }} className="operation-result">
            <div>
                <Icon color={iconColor} size="88" />
            </div>
            <h1 style={{ color: '#343a40', fontSize: '24px' }}>{operationDesc}</h1>
        </div>
    )
}
export default OperationResult