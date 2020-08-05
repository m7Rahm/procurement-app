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
		const prevMonth = month - 1 === 0 ? 12 : month - 1
		const nextMonth = month !== 12 ? month + 1 : 1;
		const nCurrentYear = month === 12 ?
			year + 1 :
			month === 1 ?
				year - 1 :
				year;
		const offset = dayOfWeek === 0 ? 7 : dayOfWeek
		for (let i = offset - 1; i >= 0; i--) {
			days[0][i] = { date: pr, className: 'not-current-month-days', val: `${nCurrentYear}/${prevMonth}/${pr}` };
			pr--;
		}
		for (let i = offset; i < currentDate.getDate() + offset; i++) {
			k++;
			days[Math.trunc(i / 7)][i % 7] = { date: k, className: '', val: `${year}/${month}/${k}` };
		}
		let nxt = 0;
		for (let i = currentDate.getDate() + offset; i < 42; i++) {
			nxt++;
			days[Math.trunc(i / 7)][i % 7] = { date: nxt, className: 'not-current-month-days', val: `${nCurrentYear}/${nextMonth}/${nxt}` };
		}
		return days;
	}
	const [date, setDate] = useState({
		date: new Date(),
		days: getDays(props.year, props.month + 1)
	});

	const handleClick = (val) => {
		console.log(val);
		calendarRef.current.style.display = 'none'
	}
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
	const handleFocusLose = (e) => {
		// const relatedTarget = e.relatedTarget;
		props.active.current = calendarRef.current;
		props.active.current.customName = props.name;

	}
	const handleInputFocus = () => {
		calendarRef.current.style.display = 'block';
	}
	return (
		<>
		<span>
			<input type="text" name={props.name}  onBlur={handleFocusLose}  className="date-picker" onClick={handleInputFocus} />
			<span>Başlanğıc</span>
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
										week.map((day, index) => <td onClick={() => handleClick(day.val)} className={day.className} key={index}>{day.date}</td>)
									}
								</tr>
							)
						}
					</tbody>
					<tfoot>
						<tr>
							<td colSpan="5"></td>
							<td colSpan="2"><div>None</div></td>
						</tr>
					</tfoot>
				</table>
			</div>
		</>
	)
}
export default Calendar;

