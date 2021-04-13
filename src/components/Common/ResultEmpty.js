import React from "react"

const ResultEmpty = () => {
    return (
        <div className="result-empty">
            <img
                src='/NoDocuments.svg'
                alt="blah"
                height="400"
                style={{ margin: "auto", display: "block" }} />
            <h1>Sənəd tapılmadı</h1>
        </div>
    )
}
export default React.memo(ResultEmpty)