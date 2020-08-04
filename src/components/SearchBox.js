import React from 'react'
import Calendar from './Calendar'
const SearchBox = (props) => {
    const date = new Date();
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
                    <Calendar year={date.getFullYear()} month={date.getMonth()} />
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