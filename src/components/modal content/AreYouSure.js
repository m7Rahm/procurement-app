import React from "react"

const AreYouSure = (props) => {
    const { text, onCancel, onAccept } = props;

    return (
        <div className="are-you-sure">
            <h1>{text} əminsinizmi?</h1>
            <div className="buttons-ribbon">
                <div onClick={onCancel}>Imtina et</div>
                <div onClick={onAccept}>Bəli</div>
            </div>
        </div>
    )
}
export default AreYouSure