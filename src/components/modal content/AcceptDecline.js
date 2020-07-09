import React from 'react'

const AcceptDecline = (props) => {
    const placeholder = props.accept
        ? "Əlavə qeydlərinizi daxil edin.."
        : "Etirazın səbəbini göstərin"
    return (
        <div className="accept-decline">
            <div>
                <textarea required={!props.accept} placeholder={placeholder}></textarea>
                {
                    props.accept &&
                    <select>
                        <option> A </option>
                        <option> B </option>
                        <option> C </option>
                    </select>
                }
            </div>
            <div style={{ backgroundColor: props.backgroundColor }}>
                Göndər
                </div>
        </div>
    )
}
export default AcceptDecline