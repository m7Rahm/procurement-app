import React, { useRef, useEffect } from 'react';
import Calendar from './Calendar';

// const CalendarHOC = (Component) => (props) => {
//     return (
//         <Component {...props}/>
//     )
// }
const SearchBox = (props, ref) => {
    const date = new Date();
    const activeCalendar = useRef(null);
    // const handleInputFocus = (ref, name) => {
    //     ref.current.id = name
    //     ref.current.style.display = 'block'
    //     activeCalendar.current = ref.current;
    // }
    
    // const handleBlur = (e, calendar) => {
    //     const relatedNode = e.relatedTarget;
    //     console.log(relatedNode);
    //     if (!relatedNode || (relatedNode.id !== 'left' && relatedNode.id !== 'right' && !relatedNode.classList.contains('date-picker'))){
    //         calendar.current.style.display = 'none'
    //     }
    // }
    useEffect(() => {
		const handleClick = (e) => {
            const target = e.target;
            if(activeCalendar.current)
			console.log(target.name, activeCalendar.current.customName)
            if (activeCalendar.current && ((!target.closest('table') && !target.classList.contains('date-picker')) ||
                (target.classList.contains('date-picker') &&  target.name !== activeCalendar.current.customName))) {
				activeCalendar.current.style.display = 'none'
                
            }
		}
		document.addEventListener('click', handleClick, false);
		return () => document.removeEventListener('click', handleClick, false);
	}, []);
    return (
        <div style={{ display: 'none' }} ref={ref} className="advanced-search-bar">
            <div>
                <label>deadline</label>
                {/* <input type="text" name="deadline" className="date-picker" onClick={() => handleInputFocus(deadlineCalRef, "deadline")} /> */}
                <Calendar name="deadline" active={activeCalendar} year={date.getFullYear()} month={date.getMonth()} />
            </div>
            <div>
                {/* <span> */}
                <Calendar name="end" active={activeCalendar} year={date.getFullYear()} month={date.getMonth()} />
                    {/* <span>Son</span> */}
                {/* </span> */}
                {/* <span> */}
                <Calendar name="start" active={activeCalendar} year={date.getFullYear()} month={date.getMonth()} />

                    {/* <input className="date-picker" name="start" onClick={() => handleInputFocus(startEndCalRef, "start")} type="text" /> */}
                    {/* <span>Başlanğıc</span> */}
                {/* </span> */}
            </div>
            <div className="search-ribbon">
                <div>Axtar</div>
                <div>Filteri təmizlə</div>
            </div>
        </div>
    )
}
export default React.forwardRef(SearchBox)