import React, { useRef, useState, useEffect, useCallback, useContext } from 'react'
import VisaCard from './VisaCard'

import {
	BsArrowUpShort,
} from 'react-icons/bs'

import IconsPanel from '../Search/IconsPanel';
import Pagination from '../Misc/Pagination';
import { TokenContext } from '../../App'
const SideBar = (props) => {
	const { updateList } = props
	const tokenContext = useContext(TokenContext);
	const token = tokenContext[0];
	const notifIcon = useRef(null);
	const activePageRef = useRef(0)
	const checkedAmountRef = useRef([]);
	const iconsPanelRef = useRef(null);
	const [visas, setVisas] = useState({ count: 0, visas: [] });
	const activeRef = useRef({ style: { background: '' } });
	const [iconsVisible, setIconsVisible] = useState(false);
	const searchParamsRef = useRef({ userName: '', startDate: null, endDate: null, deadline: '', docType: -3 })
	const mountFunc = useCallback(props.mountFunc, []);
	const refreshVisas = (from) => {
		const searchRefData = {
		userName: searchParamsRef.current.userName,
		startDate: searchParamsRef.current.startDate,
		endDate: searchParamsRef.current.endDate,
		docType: searchParamsRef.current.docType,
	}
	const data = { ...searchRefData, from, until: 20 }
		updateList(data, token, setVisas, notifIcon )
	}
	useEffect(() => {
		mountFunc(setVisas, notifIcon, token)
	}, [mountFunc, token]);
	return (
		<div className='side-bar'>
			<div ref={iconsPanelRef}>
				<IconsPanel
					searchParamsRef={searchParamsRef}
					isDraft={props.isDraft}
					token={token}
					iconsVisible={iconsVisible}
					checkedAmountRef={checkedAmountRef}
					setVisas={setVisas}
					updateList={updateList}
					activePageRef={activePageRef}
				/>
			</div>
			<div onClick={() => refreshVisas(0)} ref={notifIcon} className="new-visa-notification">
				<BsArrowUpShort size="20" style={{ verticalAlign: 'sub', marginRight: '8px' }} />
				Yeni bildiriş
			</div>
			<ul>
				{
					visas.visas.map((visa) => {
						return (
							<VisaCard
								key={visa.id}
								id={visa.id}
								token={token}
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
								isPinned={visa.is_pinned}
								category={visa.assignment}
								deadline={visa.deadline}
								remark={visa.comment}
								date={visa.date_time}
								priceOffProcessed={visa.processed}
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
export default React.memo(SideBar, () => true)