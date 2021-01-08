import React, { useState } from 'react'
import AgreementVendors from './AgreementVendors'
const Modal = React.lazy(() => import('../../Misc/Modal'));
const AgreementContent = (props) => {
    const [modalState, setModalState] = useState({ visible: false });
    return (
        <>
            <div className="visa-content-container">
                <AgreementVendors
                    token={props.token}
                    active={props.active}
                    setModalState={setModalState}
                />
                {
                    modalState.visible &&
                    <Modal></Modal>
                }
            </div>
        </>
    )
}
export default AgreementContent