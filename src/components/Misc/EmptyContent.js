import React from 'react'
const EmptyContent = () => {
    return (
        <div style={{ marginTop: '100px' }}>
            <img
                src='/Konvert.svg'
                alt="blah"
                height="70"
                style={{ marginBottom: '20px' }} />
            <br />
            <span style={{ color: 'gray', fontSize: 20 }}>Baxmaq üçün sənədi seçin</span>
        </div>
    )
}
export default React.memo(EmptyContent)