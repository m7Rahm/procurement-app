import React, { useEffect, useReducer, useRef } from 'react';
import Calendar from './Calendar';

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
    const activeCalendar = useRef(null)
    const [searchState, dispatch] = useReducer(advancedSearchReducser, { userName: '', startDate: '', endDate: '', deadline: '', docType: 0 })
    useEffect(() => {
        const handleClick = (e) => {
            const target = e.target;
            // if (activeCalendar.current)
            //     console.log(target.name, activeCalendar.current.customName)
            if (activeCalendar.current && ((!target.closest('table') && !target.classList.contains('date-picker')) ||
                (target.classList.contains('date-picker') && target.name !== activeCalendar.current.customName))) {
                activeCalendar.current.style.display = 'none';
                // console.log('none')
            }
        }
        ref.current.addEventListener('animationend', function () {
            console.log('entered')
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
            deadline: searchState.deadline,
            startDate: searchState.startDate === '' ? null : searchState.startDate,
            endDate: searchState.endDate === '' ? null : searchState.endDate,
            docType: searchState.docType,
            from: 0,
            until: 20
        }
        fetch('http://172.16.3.101:54321/api/visas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length
            },
            body: JSON.stringify(data)
        })
            .then(resp => resp.json())
            .then(respJ => {
                ref.current.classList.add('advanced-search-bar-hide');
                const totalCount = respJ[0] ? respJ[0].total_count : 0;
                props.setVisas({ count: totalCount, visas: respJ });
            })
            .catch(err => console.log(err))
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
                    value={searchState.deadline}
                    actionType="setDeadline"
                    active={activeCalendar}
                    placeholder="Deadline"
                    year={date.getFullYear()}
                    month={date.getMonth()}
                />
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
                <select value={searchState.docType} onChange={handleSelectChange}>
                    <option value={0}>Bütün sənədlər</option>
                    <option value={1}>Yalnız vizalar</option>
                    <option value={2}>Yalnız rəy üçün</option>
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