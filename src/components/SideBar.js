import React, { useRef, useState, useEffect } from 'react'
import VisaCard from '../components/VisaCard'
import {
	IoIosArchive,
	IoIosMailOpen,
} from 'react-icons/io';
import {
	BsArrowUpShort
} from 'react-icons/bs'
import {
	GoChevronDown
} from 'react-icons/go'
import SearchBox from './SearchBox';

const SideBar = (props) => {
	const searchBoxRef = useRef(null)
	const notifIcon = useRef(null);
	const webSocketRef = useRef(props.webSocketRef.current);
	const checkedAmount = useRef(0);
	const iconsPanel = useRef(null);
	const [visas, setVisas] = useState([])
	const [iconsVisible, setIconsVisible] = useState(false);
	const onAdvSearchClick = () => {
		if (searchBoxRef.current.style.display === 'none') {
			searchBoxRef.current.classList.remove('advanced-search-bar-hide');
			searchBoxRef.current.style.display = 'block';
		}
		else {
			searchBoxRef.current.classList.add('advanced-search-bar-hide')
		}
		searchBoxRef.current.addEventListener('animationend', function () {
			if (this.classList.contains('advanced-search-bar-hide'))
				this.style.display = 'none';
		}, false);
	}
	useEffect(() => {
		fetch('http://172.16.3.101:54321/api/visas?from=0&until=20')
			.then(resp => resp.json())
			.then(respJ => setVisas(respJ))
			.catch(err => console.log(err))
		webSocketRef.current.onmessage = (msg) => {
			// console.log(msg)
			const data = JSON.parse(msg.data);
			if (data.action === 'newOrder') {
				notifIcon.current.style.display = 'block';
			}
		}
	}, []);
	const updateList = () => {
		fetch('http://172.16.3.101:54321/api/visas?from=0&until=20')
			.then(resp => resp.json())
			.then(respJ => {
				setVisas(respJ);
				notifIcon.current.style.animation = 'visibility-hide 0.2s ease-in both';
				notifIcon.current.addEventListener('animationend', function () {
					this.style.display = 'none';
					this.style.animation = 'animation: show-up 0.2s ease-in both';
				})
			})
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
				{
					!iconsVisible &&
					<div>
						<input type="text" placeholder="Axtarış.." />
						<GoChevronDown size="24" onClick={onAdvSearchClick} />
						<SearchBox ref={searchBoxRef} />
					</div>
				}
			</div>
			<div onClick={updateList} ref={notifIcon} className="new-visa-notification">
				<BsArrowUpShort size="20" style={{ verticalAlign: 'sub', marginRight: '8px' }} />
				Yeni bildiriş
			</div>
			<ul>
				{
					visas.map((visa) => {
						const active = props.active && props.active[0].id === visa.id ? true : false
						return <VisaCard
							key={visa.id}
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