import React, { useRef, useState, useEffect, useCallback } from 'react'
import VisaCard from '../components/VisaCard'

import {
	BsArrowUpShort,
} from 'react-icons/bs'

import IconsPanel from './IconsPanel';
import Pagination from './Pagination';
import { token } from '../data/data'

const SideBar = (props) => {
	const notifIcon = useRef(null);
	const activePageRef = useRef(0)
	const checkedAmountRef = useRef([]);
	const iconsPanelRef = useRef(null);
	const [visas, setVisas] = useState({count: 0, visas: []});
	const activeRef = useRef({ style: { background: '' } });
	const [iconsVisible, setIconsVisible] = useState(false);
	const searchParamsRef = useRef({userName: '', startDate: null, endDate: null, deadline: '', docType: 0 })
	// console.log(visas)
	const mountFunc = useCallback(props.mountFunc, []);
	useEffect(() => {
		mountFunc(setVisas,notifIcon)
	}, [mountFunc]);

	const updateList = (from) => {
		const searchRefData = {
			userName: searchParamsRef.current.userName,
			startDate: searchParamsRef.current.startDate,
			endDate: searchParamsRef.current.endDate,
			deadline: searchParamsRef.current.deadline,
			docType: searchParamsRef.current.docType,
		}
		const data = { ...searchRefData, from, until: 20}
		console.log(data);
		fetch('http://172.16.3.101:54321/api/visas', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': JSON.stringify(data).length,
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify(data)
		})
			.then(resp => resp.json())
			.then(respJ => {
				const totalCount = respJ[0] ? respJ[0].total_count : 0;
				setVisas({count: totalCount, visas: respJ});
				notifIcon.current.style.animation = 'visibility-hide 0.2s ease-in both';
				notifIcon.current.addEventListener('animationend', function () {
					this.style.display = 'none';
					this.style.animation = 'animation: show-up 0.2s ease-in both';
				})
			})
			.catch(ex => console.log(ex))

	}
	return (
		<div className='side-bar'>
			<div ref={iconsPanelRef}>
				<IconsPanel
					searchParamsRef={searchParamsRef}
					isDraft={props.isDraft}
					iconsVisible={iconsVisible}
					checkedAmountRef={checkedAmountRef}
					setVisas={setVisas}
					mountFunc={mountFunc}
					activePageRef={activePageRef}
				/>
			</div>
			<div onClick={() => updateList(0)} ref={notifIcon} className="new-visa-notification">
				<BsArrowUpShort size="20" style={{ verticalAlign: 'sub', marginRight: '8px' }} />
				Yeni bildiriş
			</div>
			<ul>
				{
					visas.visas.map((visa) => {
						// const isActive = active === visa.id ? true : false
						return <VisaCard
							key={visa.id}
							id={visa.id}
							activeCardRef={props.activeCardRef}
							iconsPanelRef={iconsPanelRef}
							checkedAmount={checkedAmountRef}
							setIconsVisible={setIconsVisible}
							setActiveVisa={props.setActive}
							activeRef={activeRef}
							number={visa.ord_numb}
							isOpened={visa.is_read}
							handleCardClick={props.handleCardClick}
							from={visa.sender_full_name}
							empVersion={visa.emp_version_id}
							// senderid={visa.sender_id}
							isPinned={visa.is_pinned}
							category={visa.assignment}
							deadline={visa.deadline}
							remark={visa.comment}
							date={visa.date_time}
							priceOffProcessed={visa.processed}
						/>
					})
				}
			</ul>
			<Pagination
				count={visas.count}
				activePageRef={activePageRef}
				updateList={updateList}
			/>
		</div>
	)
}
export default React.memo(SideBar, () => true)