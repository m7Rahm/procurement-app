import React from 'react'
const Search = (props) => {
	const { setLoading, updateList, setSearchData, searchData } = props
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setSearchData(prev => ({ ...prev, [name]: value }))
	}
	const handleSearch = () => {
		setLoading(true)
		updateList(0)
	}
	return (
		<div style={{ backgroundColor: '#188bc0' }}>
			<div className="wrapper">
				<div className='search-container'>
					<div>
						<label htmlFor='status'>Status</label>
						<br />
						<select name='status' onChange={handleChange} value={searchData.status} style={{ height: '35px', float: 'left' }}>
							<option value='-3'>-</option>
							<option value='-1'>Etiraz</option>
							<option value='50'>Gözlənilir</option>
							<option value='1'>Təsdiq</option>
							<option value='0'>Baxılır</option>
							<option value='30'>Anbarda</option>
							<option value='50'>Tamamlanmışdır</option>
						</select>
					</div>
					<div>
						<label htmlFor='dateFrom'>Başlanğıc</label>
						<br />
						<input
							onChange={handleChange}
							value={searchData.dateFrom}
							placeholder='Tarix'
							name='dateFrom'
							type='date'
							style={{ height: '35px', float: 'left' }}
						/>
					</div>
					<div>
						<label htmlFor='dateTill'>Son</label>
						<br />
						<input
							onChange={handleChange}
							value={searchData.dateTill}
							placeholder='Tarix'
							name='dateTill'
							type='date'
							style={{ height: '35px', float: 'left' }}
						/>
					</div>
					<div>
						<label htmlFor='ordNumb' >Nömrə</label>
						<br />
						<input
							onChange={handleChange}
							value={searchData.ordNumb}
							placeholder='Nömrə'
							name='ordNumb'
							type='text'
							style={{ height: '35px', float: 'left' }}
						/>
					</div>
					<div style={{ textAlign: 'left', height: '55px', display: 'flex', minWidth: '180px', flexDirection: 'column-reverse' }}>
						<button
							onClick={handleSearch}
							style={{
								height: '35px',
								marginBottom: '1.5px',
								cursor: 'pointer',
								color: 'white',
								fontWeight: '600',
								padding: '3px 6px',
								float: 'left',
								minWidth: '180px',
								fontFamily: 'sans-serif',
								border: 'none',
								backgroundColor: '#ffae00'
							}}>
							AXTAR
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
export default Search