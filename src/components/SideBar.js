import React, { useRef, useState } from 'react'
import VisaCard from '../components/VisaCard'
import {
	IoIosArchive,
	IoIosMailOpen
} from 'react-icons/io';

const SideBar = (props) => {
	const checkedAmount = useRef(0);
	const iconsPanel = useRef(null);
	const [iconsVisible, setIconsVisible] = useState(false);
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
					props.visas.map((visa) => {
						const active = props.active === visa.number ? true : false
						return <VisaCard
							key={visa.number}
							iconsPanel={iconsPanel}
							checkedAmount={checkedAmount}
							setIconsVisible={setIconsVisible}
							setActive={props.setActive}
							active={active}
							number={visa.number}
							isOpened={visa.isOpened}
							from={visa.from}
							category={visa.category}
							deadline={visa.deadline}
							remark={visa.remark}
							date={visa.date}
						/>
					})
				}
			</ul>
		</div>
	)
}
export default SideBar