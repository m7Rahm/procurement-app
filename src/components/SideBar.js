import React, { useRef, useState, useEffect } from 'react'
import VisaCard from '../components/VisaCard'
import {
	IoIosArchive,
	IoIosMailOpen
} from 'react-icons/io';

const SideBar = (props) => {
	const checkedAmount = useRef(0);
	const iconsPanel = useRef(null);
	const [visas, setVisas] = useState([])
	const [iconsVisible, setIconsVisible] = useState(false);
	useEffect(() => {
		fetch('http://172.16.3.101:54321/api/visas?from=0&until=20')
		.then(resp => resp.json())
		.then(respJ =>setVisas(respJ))
		.catch(err => console.log(err))
	}, [])
	return (
		<div className='side-bar'>
			{
				iconsVisible &&
				<div ref={iconsPanel}>
					<IoIosArchive color="dodgerblue" title="Arxiv et" size="25"/>
					<IoIosMailOpen color="dodgerblue" title="Oxunmuş et" size="25"/>
				</div>
			}
			<ul>
				{
					visas.map((visa) => {
						const active = props.active === visa.number ? true : false
						return <VisaCard
							key={visa.order_id}
							iconsPanel={iconsPanel}
							checkedAmount={checkedAmount}
							setIconsVisible={setIconsVisible}
							setActive={props.setActive}
							active={active}
							number={visa.order_id}
							isOpened={visa.is_read}
							from={visa.sender_full_name}
							category={visa.assignment}
							deadline={visa.deadline}
							remark={visa.comment}
							date={visa.date_time}
						/>
					})
				}
			</ul>
		</div>
	)
}
export default SideBar