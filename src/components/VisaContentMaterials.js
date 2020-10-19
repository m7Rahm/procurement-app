import React from 'react'

const TableRow = (props) => {
	// const importanceText = ['orta', 'vacib', 'çox vacib'];
	return (
		<li>
			<div>{props.index + 1}</div>
			<div style={{ textAlign: 'left' }}>
				{props.materialName}
			</div>
			{/* <div>
				<span>
					{props.model}
				</span>
			</div> */}
			{/* <div style={{ position: 'relative', width: '170px', maxWidth: '200px' }}>
				<div id={props.id} style={{ height: '100%', textAlign: 'left', boxShadow: `${props.isActive ? '0px 0px 0px 1.6px royalblue' : ''}` }} className={`importance-div`}>
					{importanceText[props.importance - 1]}
				</div>
			</div> */}
			<div style={{ maxWidth: '140px' }}>
				<div style={{ backgroundColor: 'transparent', padding: '0px 15px' }}>
					<div style={{ width: '40px', textAlign: 'center', padding: '0px 2px', margin: 'auto', flex: 1 }}>
						{props.amount}
					</div>
				</div>
			</div>
			<div>
				<span style={{ width: '100%' }} >
					{props.additionalInfo}
				</span>
			</div>
		</li>
	)
}

const VisaContentMaterials = (props) => {
	return (
		<ul className="new-order-table order-table-protex">
			<li>
				<div>#</div>
				<div style={{ textAlign: 'left' }}>Material</div>
				{/* <div>Model</div> */}
				{/* <div style={{ width: '170px', maxWidth: '200px' }}>Vaciblik</div> */}
				<div style={{ maxWidth: '140px' }}>Say</div>
				<div>Əlavə məlumat</div>
			</li>
			{
				props.orderContent.map((material, index) =>
					<TableRow
						index={index}
						id={material.material_id}
						key={index}
						amount={material.amount}
						model={material.model}
						additionalInfo={material.material_comment}
						importance={material.importance}
						materialName={material.material_name}
					/>
				)
			}
		</ul>
	)
}

export default React.memo(VisaContentMaterials)