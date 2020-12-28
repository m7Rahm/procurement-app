import React, { useRef } from 'react';

const TenderSearchBox = (props) => {
    const iconsPanelRef = useRef(null);
    const handleSearchClick = () => {

    }
    const resetState = () => {
    }
    const handleTextInputChange = (e) => {
    }
    const handleSelectChange = (e) => {
    }
    return (

        <div ref={iconsPanelRef}>
            <div className="advanced-search-bar">
                <div>
                    <input type="text" onChange={handleTextInputChange} placeholder="Işçinin adını daxil edin.." />
                </div>
                <div>
                    Coming soon
            </div>
                <div>
                    <select onChange={handleSelectChange}>
                        <option value={-3}>Hamısı</option>
                        <option value={0}>Gözləyən</option>
                        <option value={-1}>Etiraz edilmiş</option>
                        <option value={1}>Təsdiq edilmiş</option>
                    </select>
                </div>
                <div className="search-ribbon">
                    <div onClick={handleSearchClick}>Axtar</div>
                    <div onClick={resetState}>Filteri təmizlə</div>
                </div>
            </div>
        </div>
    )
}
export default React.memo(TenderSearchBox)