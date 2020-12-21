import React, { useCallback, useEffect, useRef } from 'react'
const OperationResult = (props) => {
    const { operationDesc, show, setOperationResult, icon: Icon, backgroundColor, iconColor } = props;
    const count = useRef(0);
    const setOperationResultCallback = useCallback(setOperationResult, [])
    const operationResultRef = useRef(null);
    const color = backgroundColor ? backgroundColor : '#D93404';
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
        <div ref={operationResultRef} style={{ backgroundColor: color }} className="operation-result">
            <div>
                <Icon color={iconColor} size="88" />
            </div>
            {operationDesc}
        </div>
    )
}
export default OperationResult