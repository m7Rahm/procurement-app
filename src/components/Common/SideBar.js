import React, { useRef, useState, useEffect, useContext } from 'react'
import VisaCard from './VisaCard'

import {
	BsArrowUpShort,
} from 'react-icons/bs'

import IconsPanel from '../Search/IconsPanel';
import Pagination from '../Misc/Pagination';
import { TokenContext } from '../../App'

const SideBar = (props) => {
	const { updateList, setActive, initData, webSocketRef, checkData } = props;
	const tokenContext = useContext(TokenContext);
	const token = tokenContext[0].token;
	const notifIcon = useRef(null);
	const activePageRef = useRef(0);
	const activeRef = useRef({ style: { background: '' } });
	const checkedAmountRef = useRef([]);
	const iconsPanelRef = useRef(null);
	const [visas, setVisas] = useState({ count: 0, visas: [] });
	const [iconsVisible, setIconsVisible] = useState(false);
	const searchParamsRef = useRef({ userName: '', startDate: null, endDate: null, deadline: '', docType: -3 })
	const updateSideBarContent = (data) => {
		updateList(data, token)
		.then(resp => resp.json())
		.then(respJ => {
			const totalCount = respJ[0] ? respJ[0].total_count : 0;
			setVisas({ count: totalCount, visas: respJ });
			if (notifIcon !== undefined) {
				notifIcon.current.style.animation = 'visibility-hide 0.2s ease-in both';
				notifIcon.current.addEventListener('animationend', function () {
					this.style.display = 'none';
					this.style.animation = 'animation: show-up 0.2s ease-in both';
				})
			}
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
		const data = JSON.stringify({ ...searchRefData, from, until: 20 })
		updateSideBarContent(data, token)
	}
	webSocketRef.current.onmessage = (event) => {
		const data = JSON.parse(event.data);
		if (checkData(data)) {
		  notifIcon.current.style.display = 'block';
		}
	  }
	useEffect(() => {
		const data = JSON.stringify(initData);
		updateList(data, token)
			.then(resp => resp.json())
			.then(respJ => {
				const totalCount = respJ[0] ? respJ[0].total_count : 0;
				setVisas({ count: totalCount, visas: respJ })
			})
			.catch(err => console.log(err))
	}, [updateList, initData, token]);
	return (
		<div className='side-bar'>
			<div ref={iconsPanelRef}>
				<IconsPanel
					searchParamsRef={searchParamsRef}
					token={token}
					iconsVisible={iconsVisible}
					checkedAmountRef={checkedAmountRef}
					setVisas={setVisas}
					updateList={updateSideBarContent}
					activePageRef={activePageRef}
				/>
			</div>
			<div onClick={() => refreshVisas(0)} ref={notifIcon} className="new-visa-notification">
				<BsArrowUpShort color="#00acee" size="20" style={{ verticalAlign: 'sub', marginRight: '8px' }} />
				Yeni bildiriş
			</div>
			<ul>
				{
					visas.visas.map((visa) => {
						return (
							<VisaCard
								key={visa.id}
								token={token}
								setActive={setActive}
								iconsPanelRef={iconsPanelRef}
								checkedAmount={checkedAmountRef}
								setIconsVisible={setIconsVisible}
								activeRef={activeRef}
								visa={visa}
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