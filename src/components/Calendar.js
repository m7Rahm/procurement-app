import React, { useState } from 'react'

const Calendar = (props) => {
	const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
	const getDays = (year, month) => {
		const dayOfWeek = new Date(year, month - 1, 1).getDay();
		const currentDate = new Date(year, month, 0);
		const prevD = new Date(year, month - 1, 0);
		let days = [Array(7).fill(''), Array(7).fill(''), Array(7).fill(''), Array(7).fill(''), Array(7).fill(''), Array(7).fill('')];
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
		for(let i = offset - 1; i >= 0; i --){
			days[0][i] = {date: pr, className: 'not-current-month-days', val: `${nCurrentYear}/${prevMonth}/${pr}`};
			pr--;
		}
		for (let i = offset; i < currentDate.getDate() + offset; i++) {
			k++;
			days[Math.trunc(i / 7)][i % 7] = {date: k, className: '', val: `${year}/${month}/${k}`};
		}
		let nxt = 0;
		for (let i = currentDate.getDate() + offset; i < 42; i++) {
			nxt ++;
			days[Math.trunc(i / 7)][i % 7] = {date: nxt, className: 'not-current-month-days', val: `${nCurrentYear}/${nextMonth}/${nxt}`};
		}
		return days;
	}
	const [date, setDate] = useState({
		date: new Date(),
		days: getDays(props.year, props.month + 1)
	});

	const handleClick = (val) => console.log(val)
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
	return (
		<div className="calendar">
			<div>
				<table>
					<thead>
						<tr>
							<td colSpan={5}>
								{`${months[date.date.getMonth()]} ${date.date.getFullYear()}`}
							</td>
							<td>
								<button id="left" onClick={handleDateDec}>
									{/* <MdChevronLeft onClick={handleDateDec} /> */}
								</button>
							</td>
							<td>
								<button id="right" onClick={handleDateInc}>
									{/* <MdChevronRight onClick={handleDateInc} /> */}
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
		</div>
	)
}
export default Calendar;

