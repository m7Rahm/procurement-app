import React, { useState, useRef } from 'react'
const CalendarUniversal = (props) => {
    const calendarRef = useRef(null);
    const ref = useRef(null);
    const [value, setValue] = useState("")
    const handleFocusLose = (e) => {
        if (!e.relatedTarget || !e.relatedTarget.classList.contains(props.name))
            calendarRef.current.style.display = 'none'
    }
    const handleInputFocus = () => {
        calendarRef.current.style.display = 'block';
    }
    const handleDatePickerChange = (e) => {
        let value = e.target.value;
        setValue(value)
        props.handleInputChange(props.name, value)
    }
    return (
        <div className="calendar-container">
            <div className="calendar-head">
                <span>
                    <input
                        name={props.name}
                        type="text"
                        autoComplete="off"
                        ref={ref}
                        value={value}
                        onChange={handleDatePickerChange}
                        onBlur={handleFocusLose}
                        className={"date-picker " + props.name}
                        onFocus={handleInputFocus}
                    />
                    <label htmlFor={"date-picker " + props.name}>{props.placeholder}</label>
                </span>
            </div>
            <Calendar
                calendarRef={calendarRef}
                name={props.name}
                handleInputChange={props.handleInputChange}
                setValue={setValue}
                year={props.year}
                month={props.month}
            />
        </div>
    )
}
export default React.memo(CalendarUniversal);
const Calendar = React.memo((props) => {
    const [date, setDate] = useState({
        date: new Date(),
        days: getDays(props.year, props.month + 1)
    });
    const handleDateInc = () => {
        setDate(prev => {
            const month = prev.date.getMonth() + 2 > 12 ? 1 : prev.date.getMonth() + 2;
            const year = month === 1 ? prev.date.getFullYear() + 1 : prev.date.getFullYear();
            const days = getDays(year, month);
            return {
                date: new Date(`${year}/${month}/01`),
                days: days
            }
        })
    }
    const handleDateDec = () => {
        setDate(prev => {
            const month = prev.date.getMonth() <= 0 ? 12 : prev.date.getMonth();
            const year = month === 12 ? prev.date.getFullYear() - 1 : prev.date.getFullYear();
            const days = getDays(year, month);
            return {
                date: new Date(`${year}/${month}/01`),
                days: days
            }
        })
    }
    const handleClick = (value) => {
        props.calendarRef.current.style.display = 'none';
        props.setValue(value)
        props.handleInputChange(props.name, value)
    }
    const clearDate = () => {
        props.calendarRef.current.style.display = 'none'
        props.setValue("")
        props.handleInputChange(props.name, '')
    }
    return (
        <div ref={props.calendarRef} tabIndex="1" className={"calendar " + props.name} style={{ left: '50%', transform: 'translate(-50%, 0)' }}>
            <table>
                <thead>
                    <tr>
                        <td colSpan={5}>
                            {`${months[date.date.getMonth()]} ${date.date.getFullYear()}`}
                        </td>
                        <td>
                            <button id="left" onBlur={props.handleFocusLose} className={`arrows ${props.name}`} onClick={handleDateDec}>
                            </button>
                        </td>
                        <td>
                            <button id="right" onBlur={props.handleFocusLose} className={`arrows ${props.name}`} onClick={handleDateInc}>
                            </button>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>B</th>
                        <th>B.E</th>
                        <th>Ç.A</th>
                        <th>Ç</th>
                        <th>C.A</th>
                        <th>C</th>
                        <th>Ş</th>
                    </tr>
                    {
                        date.days.map((week, index) =>
                            <tr key={index}>
                                {
                                    week.map((day, index) =>
                                        <td onClick={() => handleClick(day.val)} className={day.className} key={index}>
                                            {day.date}
                                        </td>
                                    )
                                }
                            </tr>
                        )
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="5"></td>
                        <td colSpan="2"><div onClick={clearDate}>Sıfırla</div></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
})
const getDays = (year, month) => {
    const dayOfWeek = new Date(year, month - 1, 1).getDay();
    const currentDate = new Date(year, month, 0);
    const prevD = new Date(year, month - 1, 0);
    let days = [Array(7), Array(7), Array(7), Array(7), Array(7), Array(7)];
    let k = 0;
    let pr = prevD.getDate();
    const prevMonth = month - 1 === 0 ? 12 : month - 1;
    const prevMonthFormat = prevMonth < 10 ? '0' + prevMonth : prevMonth
    const nextMonth = month !== 12 ? month + 1 : 1;
    const nextMonthFormat = nextMonth < 10 ? '0' + nextMonth : nextMonth;
    const nCurrentYear = month === 12 ?
        year + 1 :
        month === 1 ?
            year - 1 :
            year;
    const offset = dayOfWeek === 0 ? 7 : dayOfWeek
    for (let i = offset - 1; i >= 0; i--) {
        days[0][i] = { date: pr, className: 'not-current-month-days', val: `${nCurrentYear}-${prevMonthFormat}-${pr < 10 ? '0' + pr : pr}` };
        pr--;
    }
    for (let i = offset; i < currentDate.getDate() + offset; i++) {
        k++;
        days[Math.trunc(i / 7)][i % 7] = { date: k, className: '', val: `${year}-${month < 10 ? '0' + month : month}-${k < 10 ? '0' + k : k}` };
    }
    let nxt = 0;
    for (let i = currentDate.getDate() + offset; i < 42; i++) {
        nxt++;
        days[Math.trunc(i / 7)][i % 7] = { date: nxt, className: 'not-current-month-days', val: `${month === 1 ? nCurrentYear + 1 : nCurrentYear}-${nextMonthFormat}-${nxt < 10 ? '0' + nxt : nxt}` };
    }
    return days;
}
const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
