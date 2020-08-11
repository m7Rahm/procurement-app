import React, { useEffect, useReducer, useRef } from 'react';
import Calendar from './Calendar';

const advancedSearchReducser = (state, action) => {
    const type = action.type;
    switch (type) {
        case 'setUserName':
            return { ...state, userName: action.payload }
        case 'setStartDate':
            return { ...state, startDate: action.payload }
        case 'setEndDate':
            return { ...state, endDate: action.payload }
        case 'setDocType':
            return { ...state, docType: action.payload }
        case 'setDeadline':
            return { ...state, deadline: action.payload }
        case 'reset':
            return { userName: '', startDate: '', endDate: '', deadline: '', docType: 0 }
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
        document.addEventListener('click', handleClick, false);
        return () => document.removeEventListener('click', handleClick, false);
    }, []);
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
                props.setVisas(respJ);
            })
			.catch(err => console.log(err))
    }
    const resetState = () => {
        dispatch({ type: 'reset' })
    }
    const handleTextInputChange = (e) => {
        const value = e.target.value
        dispatch({ type: 'setUserName', payload: value })
    }
    const handleSelectChange = (e) => {
        const value = e.target.value
        dispatch({ type: 'setDocType', payload: value })
    }
    return (
        <div ref={ref} className="advanced-search-bar">
            <div>
                <input type="text" value={searchState.userName} onChange={handleTextInputChange} placeholder="Işçinin adını daxil edin.."/>
            </div>
            <div>
                <Calendar
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
                    dispatch={dispatch}
                    placeholder="Son"
                    value={searchState.endDate}
                    actionType="setEndDate"
                    active={activeCalendar}
                    year={date.getFullYear()}
                    month={date.getMonth()}
                />
                <Calendar
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