import React from 'react'
import VisaCard from '../components/VisaCard'
const SideBar = (props) => {
	return (
		<div className='side-bar'>
			<ul style={{ listStyle: 'none', margin: '50px 0px 0px 0px', padding: '0px' }}>
				{
					props.visas.map((visa) =>
						<li onClick={() => props.setActive(_ => visa.number)} key={Math.random()}>
							<VisaCard
								isOpened={visa.isOpened}
								from={visa.from}
								category={visa.category}
								deadline={visa.deadline}
								remark={visa.remark}
								date={visa.date}
							/>
						</li>
					)
				}
			</ul>
		</div>
	)
}
export default SideBar