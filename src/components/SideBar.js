import React, { useRef, useState, useEffect } from 'react'
import VisaCard from '../components/VisaCard'
import {
	IoIosArchive,
	IoIosMailOpen,
} from 'react-icons/io';
import {
	BsArrowUpShort
} from 'react-icons/bs'

const SideBar = (props) => {
	const checkedAmount = useRef(0);
	const iconsPanel = useRef(null);
	const [visas, setVisas] = useState([])
	const [iconsVisible, setIconsVisible] = useState(false);
	useEffect(() => {
		fetch('http://172.16.3.101:54321/api/visas?from=0&until=20')
			.then(resp => resp.json())
			.then(respJ => setVisas(respJ))
			.catch(err => console.log(err))
	}, []);
	const updateList = () => {
		fetch('http://172.16.3.101:54321/api/visas?from=0&until=20')
			.then(resp => resp.json())
			.then(respJ => setVisas(respJ))
			.catch(err => console.log(err))
	}
	return (
		<div className='side-bar'>

			<div ref={iconsPanel}>
				{
					iconsVisible &&
					<>
						<IoIosArchive color="dodgerblue" title="Arxiv et" size="25" />
						<IoIosMailOpen color="dodgerblue" title="Oxunmuş et" size="25" />
					</>
				}
			</div>
			<div onClick={updateList} className="new-visa-notification">
				<BsArrowUpShort size="20" style={{ verticalAlign: 'sub', marginRight: '8px' }} />
				Yeni bildiriş
			</div>
			<ul>
				{
					visas.map((visa) => {
						const active = props.active && props.active[0].id === visa.id ? true : false
						return <VisaCard
							key={visa.ord_numb}
							iconsPanel={iconsPanel}
							checkedAmount={checkedAmount}
							iconsVisible={iconsVisible}
							setIconsVisible={setIconsVisible}
							setActive={props.setActive}
							active={active}
							number={visa.ord_numb}
							isOpened={visa.is_read}
							from={visa.sender_full_name}
							senderid={visa.sender_id}
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