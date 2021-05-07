import React, { useRef, useState, useEffect } from 'react'
import VisaCard from './VisaCard'

import { BsArrowUpShort } from 'react-icons/bs'
import IconsPanel from '../Search/IconsPanel';
import Pagination from '../Misc/Pagination';

const SideBar = (props) => {
	const { updateList, setActive, initData } = props;
	const notifIcon = useRef(null);
	const activePageRef = useRef(0);
	const activeRef = useRef({ style: { background: '' } });
	const checkedAmountRef = useRef([]);
	const iconsPanelRef = useRef(null);
	const [visas, setVisas] = useState({ count: 0, visas: [] });
	const [iconsVisible, setIconsVisible] = useState(false);
	const searchParamsRef = useRef({ userName: '', startDate: null, endDate: null, deadline: '', docType: -3 })
	const updateSideBarContent = (data) => {
		updateList(data)
			.then(respJ => {
				const totalCount = respJ[0] ? respJ[0].total_count : 0;
				setVisas({ count: totalCount, visas: respJ });
			})
			.catch(ex => console.log(ex))
	}
	const refreshVisas = (from) => {
		const searchRefData = {
			userName: searchParamsRef.current.userName,
			startDate: searchParamsRef.current.startDate,
			endDate: searchParamsRef.current.endDate,
			docType: searchParamsRef.current.docType,
		}
		const data = { ...searchRefData, from, until: 20 }
		updateSideBarContent(data)
	}
	useEffect(() => {
		const showNotificationIcon = () => {
			notifIcon.current.style.display = "block";
		}
		window.addEventListener("newOrder", showNotificationIcon, false)
		return () => window.removeEventListener("newOrder", showNotificationIcon)
	}, []);
	useEffect(() => {
		const data = initData;
		updateList(data)
			.then(respJ => {
				const totalCount = respJ[0] ? respJ[0].total_count : 0;
				setVisas({ count: totalCount, visas: respJ })
			})
			.catch(err => console.log(err))
	}, [updateList, initData]);
	const onNotifIconClick = () => {
		notifIcon.current.style.animation = 'visibility-hide 0.2s ease-in both';
		const onAnimationEnd = () => {
			notifIcon.current.style.display = 'none';
			notifIcon.current.style.animation = 'anim-up-to-down 1.5s ease-in both';
			notifIcon.current.removeEventListener('animationend', onAnimationEnd)
		}
		notifIcon.current.addEventListener('animationend', onAnimationEnd, false);
		refreshVisas(0);
	}
	return (
		<div className='side-bar'>
			<div ref={iconsPanelRef}>
				<IconsPanel
					searchParamsRef={searchParamsRef}
					iconsVisible={iconsVisible}
					checkedAmountRef={checkedAmountRef}
					setVisas={setVisas}
					updateList={updateSideBarContent}
					activePageRef={activePageRef}
				/>
			</div>
			<div onClick={onNotifIconClick} ref={notifIcon} style={{ display: "none" }} className="new-visa-notification">
				<span style={{ verticalAlign: "middle" }}>
					<BsArrowUpShort color="#00acee" size="24" style={{ color: "white" }} />
				</span>
				Yeni bildiriş
			</div>
			<ul>
				{
					visas.visas.map((visa) => {
						// eslint-disable-next-line
						return (
							<VisaCard
								key={visa.id}
								setActive={setActive}
								iconsPanelRef={iconsPanelRef}
								checkedAmount={checkedAmountRef}
								setIconsVisible={setIconsVisible}
								activeRef={activeRef}
								id={visa.id}
								senderid={visa.sender_id}
								isOpened={visa.is_read}
								orderid={visa.order_id}
								from={visa.sender_full_name}
								priority={visa.priority}
								remark={visa.comment}
								date={visa.date_time}
							/>
						)
					})
				}
			</ul>
			<Pagination
				count={visas.count}
				activePageRef={activePageRef}
				updateList={refreshVisas}
			/>
		</div>
	)
}
export default React.memo(SideBar)