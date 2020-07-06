import React from 'react'
const Search = () => {
	return (
		<div style={{ backgroundColor: '#188bc0' }}>
			<div className="wrapper">
				<div className='search-container'>
					<div>
						<label htmlFor='status'>Status</label>
						<br />
						<select name='status' type='time' style={{ height: '35px', float: 'left' }}>
							<option>Etiraz</option>
							<option>Gözlənilir</option>
							<option>Təsdiq</option>
							<option>Baxılır</option>
							<option>Anbarda</option>
							<option>Tamamlanmışdır</option>
						</select>
					</div>
					<div>
						<label htmlFor='Tarix'>Tarix</label>
						<br />
						<input placeholder='Tarix' name='status' type='date' style={{ height: '35px', float: 'left' }}></input>
					</div>
					<div>
						<label htmlFor='number' >Nömrə</label>
						<br />
						<input placeholder='Nömrə' name='number' type='text' style={{ height: '35px', float: 'left' }}></input>
					</div>
					<div>
						<label htmlFor='Deadline'>Deadline</label>
						<br />
						<input placeholder='Deadline' name='deadline' type='date' style={{ height: '35px', float: 'left' }}></input>
					</div>
					<div>
						<label htmlFor='teyinat'>Təyinatı</label>
						<br />
						<select name='status' type='time' style={{ height: '35px', float: 'left' }}>
							<option>İnformasiya Texnologiyaları</option>
							<option>Təsərrüfat</option>
							<option>Sistem İdarəetməsi</option>
							<option>Mühasibatlıq</option>
						</select>
					</div>
					<div style={{ textAlign: 'left', height: '55px', display: 'flex', minWidth: '180px', flexDirection: 'column-reverse' }}>
						<button style={{ height: '35px', marginBottom: '1.5px', cursor:'pointer', color: 'white', fontWeight: '600', padding: '3px 6px', float: 'left', minWidth: '180px', fontFamily: 'sans-serif', border: 'none', backgroundColor: '#ffae00' }}> AXTAR</button>
					</div>
				</div>
			</div>
		</div>
	)
}
export default Search