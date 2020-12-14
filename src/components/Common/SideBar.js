import React, { useRef, useState, useEffect, useCallback, useContext } from 'react'
import VisaCard from './VisaCard'

import {
	BsArrowUpShort,
} from 'react-icons/bs'

import IconsPanel from '../Search/IconsPanel';
import Pagination from '../Misc/Pagination';
import { TokenContext } from '../../App'

const SideBar = (props) => {
	const { updateList, setActive, activeRef } = props;
	const tokenContext = useContext(TokenContext);
	const token = tokenContext[0].token;
	const notifIcon = useRef(null);
	const activePageRef = useRef(0)
	const checkedAmountRef = useRef([]);
	const iconsPanelRef = useRef(null);
	const [visas, setVisas] = useState({ count: 0, visas: [] });
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
export default React.memo(SideBar, () => true)