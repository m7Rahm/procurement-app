import React, { useState, useRef } from 'react'

const Calendar = (props) => {
	const calendarRef = useRef(null);
	const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
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
		const nextMonthFormat = nextMonth < 10 ? '0' + nextMonth : nextMonth
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
			days[Math.trunc(i / 7)][i % 7] = { date: nxt, className: 'not-current-month-days', val: `${nCurrentYear}-${nextMonthFormat}-${nxt < 10 ? '0' + nxt : nxt}` };
		}
		return days;
	}
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
	const handleFocusLose = () => {
		props.active.current = calendarRef.current;
		props.active.current.customName = props.actionType;

	}
	const handleInputFocus = () => {
		calendarRef.current.style.display = 'block';
	}
	const handleDatePickerChange = e => {
		const value = e.target.value;
		props.dispatch({ type: props.actionType, payload: value, ref: props.searchParamsRef })
	}
	const handleClick = (value) => {
		props.dispatch({ type: props.actionType, payload: value, ref: props.searchParamsRef });
		calendarRef.current.style.display = 'none'
	}
	const clearDate = () => {
		props.dispatch({ type: props.actionType, payload: '', ref: props.searchParamsRef });
		calendarRef.current.style.display = 'none'
	}
	return (
		<>
			<span>
				<input
					name={props.actionType}
					type="text"
					onChange={handleDatePickerChange}
					value={props.value}
					onBlur={handleFocusLose}
					className="date-picker"
					onClick={handleInputFocus}
				/>
				<span>{props.placeholder}</span>
			</span>
			<div ref={calendarRef} className="calendar">
				<table>
					<thead>
						<tr>
							<td colSpan={5}>
								{`${months[date.date.getMonth()]} ${date.date.getFullYear()}`}
							</td>
							<td>
								<button id="left" className="arrows" onClick={handleDateDec}>
								</button>
							</td>
							<td>
								<button id="right" className="arrows" onClick={handleDateInc}>
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
											<td onClick={() => handleClick(day.val)} className={props.value === day.val ? 'active' : day.className} key={index}>
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
		</>
	)
}
export default Calendar;

