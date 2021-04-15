import React, { useEffect, useReducer, useRef } from 'react';
import Calendar from '../Misc/Calendar';
const advancedSearchReducser = (state, action) => {
    const type = action.type;
    switch (type) {
        case 'setUserName': {
            const searchParamsRef = action.ref;
            const newState = { ...state, userName: action.payload }
            searchParamsRef.current = newState;
            return newState
        }
        case 'setStartDate': {
            const searchParamsRef = action.ref;
            const newState = { ...state, startDate: action.payload }
            searchParamsRef.current = newState;
            return newState
        }
        case 'setEndDate': {
            const searchParamsRef = action.ref;
            const newState = { ...state, endDate: action.payload }
            searchParamsRef.current = newState;
            return newState
        }
        case 'setDocType': {
            const searchParamsRef = action.ref;
            const newState = { ...state, docType: action.payload }
            searchParamsRef.current = newState;
            return newState
        }
        case 'setDeadline': {
            const searchParamsRef = action.ref;
            const newState = { ...state, deadline: action.payload }
            searchParamsRef.current = newState;
            return newState
        }
        case 'reset': {
            const searchParamsRef = action.ref;
            const newState = { userName: '', startDate: '', endDate: '', deadline: '', docType: 0 }
            searchParamsRef.current = { ...newState, startDate: null, endDate: null };
            return newState
        }
        default:
            return state
    }
}
const SearchBox = (props, ref) => {
    const date = new Date();
    const { updateList } = props;
    const activeCalendar = useRef(null)
    const [searchState, dispatch] = useReducer(advancedSearchReducser, {
        userName: '',
        startDate: '',
        endDate: '',
        deadline: '',
        docType: -3
    })
    useEffect(() => {
        const handleClick = (e) => {
            const target = e.target;
            if (activeCalendar.current && ((!target.closest('table') && !target.classList.contains('date-picker')) ||
                (target.classList.contains('date-picker') && target.name !== activeCalendar.current.customName))) {
                activeCalendar.current.style.display = 'none';
            }
        }
        ref.current.addEventListener('animationend', function () {
            if (this.classList.contains('advanced-search-bar-hide')) {
                this.style.display = 'none';
            }
        }, false);
        document.addEventListener('click', handleClick, false);
        return () => document.removeEventListener('click', handleClick, false);
    }, [ref]);
    const handleSearchClick = () => {
        const data = {
            userName: searchState.userName,
            startDate: searchState.startDate === '' ? null : searchState.startDate,
            endDate: searchState.endDate === '' ? null : searchState.endDate,
            docType: searchState.docType,
            from: 0,
            until: 20
        }
        updateList(data)
    }
    const resetState = () => {
        dispatch({ type: 'reset', ref: props.searchParamsRef })
    }
    const handleTextInputChange = (e) => {
        const value = e.target.value
        dispatch({ type: 'setUserName', payload: value, ref: props.searchParamsRef })
    }
    const handleSelectChange = (e) => {
        const value = e.target.value
        dispatch({ type: 'setDocType', payload: value, ref: props.searchParamsRef })
    }
    return (
        <div ref={ref} className="advanced-search-bar">
            <div>
                <input type="text" value={searchState.userName} onChange={handleTextInputChange} placeholder="Işçinin adını daxil edin.." />
            </div>
            <div>
                <Calendar
                    searchParamsRef={props.searchParamsRef}
                    dispatch={dispatch}
                    placeholder="Son"
                    value={searchState.endDate}
                    actionType="setEndDate"
                    active={activeCalendar}
                    year={date.getFullYear()}
                    month={date.getMonth()}
                />
                <Calendar
                    searchParamsRef={props.searchParamsRef}
                    dispatch={dispatch}
                    placeholder="Başlanğıc"
                    value={searchState.startDate}
                    actionType="setStartDate"
                    active={activeCalendar}
                    year={date.getFullYear()}
                    month={date.getMonth()}
                />
            </div>
            <div>
                <select style={{ padding: "6px" }} value={searchState.docType} onChange={handleSelectChange}>
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
    )
}
export default React.memo(React.forwardRef(SearchBox))