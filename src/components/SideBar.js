import React, { useRef, useState, useEffect, useCallback } from 'react'
import VisaCard from '../components/VisaCard'

import {
	BsArrowUpShort,
} from 'react-icons/bs'

import IconsPanel from './IconsPanel';

const SideBar = (props) => {
	const notifIcon = useRef(null);
	const checkedAmountRef = useRef([]);
	const iconsPanelRef = useRef(null);
	const [visas, setVisas] = useState([]);
	const activeRef = useRef({ style: { background: '' } });
	const [iconsVisible, setIconsVisible] = useState(false);
	console.log(visas)
	
	const mountFunc = useCallback(props.mountFunc, []);
	// console.log(mountFunc);
	useEffect(() => {
		mountFunc(setVisas, notifIcon)
	}, [mountFunc]);
	const updateList = () => {
		const data = {
			userName: '',
			deadline: '',
			startDate: null,
			endDate: null,
			docType: 0,
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
			<div ref={iconsPanelRef}>
					<IconsPanel checkedAmountRef={checkedAmountRef} setVisas={setVisas}/>
			</div>
			<div onClick={updateList} ref={notifIcon} className="new-visa-notification">
				<BsArrowUpShort size="20" style={{ verticalAlign: 'sub', marginRight: '8px' }} />
				Yeni bildiriş
			</div>
			<ul>
				{
					visas.map((visa) => {
						// const isActive = active === visa.id ? true : false
						return <VisaCard
							key={visa.id}
							id={visa.id}
							iconsPanelRef={iconsPanelRef}
							checkedAmount={checkedAmountRef}
							iconsVisible={iconsVisible}
							setIconsVisible={setIconsVisible}
							// setAsetActive={setActive}
							setActiveVisa={props.setActive}
							activeRef={activeRef}
							number={visa.ord_numb}
							isOpened={visa.is_read}
							from={visa.sender_full_name}
							empVersion={visa.emp_version_id}
							// senderid={visa.sender_id}
							isPinned={visa.is_pinned}
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
export default React.memo(SideBar, () => true)