import React, { useState } from "react"
import NewBudgetRequest from "../../pages/Budget/NewBudgetRequest"
import NewMaterialRequest from "../MiscDocs/NewMaterialRequest"

const NewOtherDocModal = (props) => {
    const [docType, setDocType] = useState(props.docType);
    const [pageVisible, setPageVisible] = useState(props.docType);
    const handleForwardNavigation = () => {
        if(docType !== 0)
            setPageVisible(true)
    }
    const handleDocTypeChange = (e) => {
        const value = e.target.value;
        setDocType(value)
    }
    const handleBackClick = () => {
        props.modalWrapperRef.current.style.width = "40rem"
        setPageVisible(false)
    }
    return (
        <div>
            {
                !props.docType &&
                < div className="navigation-button-container">
                    {
                        pageVisible ?
                            <div name="back" onClick={handleBackClick} className="navigation-button">Geriyə</div>
                            : <div name="forward" onClick={handleForwardNavigation} className="navigation-button">Davam et</div>
                    }
                </div>
            }
            {// eslint-disable-next-line
                docType == 1 && pageVisible ?
                    <NewBudgetRequest
                        modalWrapperRef={props.modalWrapperRef}
                        setInitData={props.setInitData}
                        closeModal={props.closeModal}
                    />
                    // eslint-disable-next-line
                    : docType == 3 && pageVisible ?
                        <NewMaterialRequest
                            modalWrapperRef={props.modalWrapperRef}
                            setInitData={props.setInitData}
                            closeModal={props.closeModal}
                        />
                        : !pageVisible ?
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
                                {
                                    props.docTypes.map(doc =>
                                        <div key={doc.val}>
                                            <input checked={// eslint-disable-next-line
                                                docType == doc.val} onChange={handleDocTypeChange} type="radio" name="doc-type" value={doc.val} />
                                            <label>{doc.text}</label>
                                        </div>
                                    )
                                }
                                {/* <input checked={docType === "3"} onChange={handleDocTypeChange} type="radio" name="doc-type" value="3" /><label>Yeni Məhsul</label> */}
                            </div>
                            : <>
                            </>
            }
        </div >
    )
}

export default NewOtherDocModal