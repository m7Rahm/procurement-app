import React from 'react'
import Calendar from './Calendar'
const SearchBox = (props) => {
    return (
        <div>
            <div>
                <label>deadline</label>
                <input type="text" />
            </div>
            <div>
                <span>
                    <input type="text" />
                    <span>Son</span>
                </span>
                <span>
                    <input type="text" />
                    <span>Başlanğıc</span>
                    <Calendar/>
                </span>
            </div>
            <div className="search-ribbon">
                <div>Axtar</div>
                <div>Filteri təmizlə</div>
            </div>
        </div>
    )
}
export default SearchBox