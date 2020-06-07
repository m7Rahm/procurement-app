import React from 'react'
export default () => {
    return (
        <div style={{ backgroundColor: '#188bc0' }}>
            <div className="wrapper">
                <div className='search-container'>
                    <div style={{ textAlign: 'left', height: '55px' }}>
                        <label htmlFor='status' style={{ color: 'white', fontWeight: 'bold', marginBottom: '10px' }}>Status</label>
                        <br />
                        <input placeholder='Status' name='status' type='time' style={{ height: '35px', float: 'left' }}></input>
                    </div>
                    <div style={{ textAlign: 'left', height: '55px' }}>
                        <label htmlFor='Tarix' style={{ color: 'white', fontWeight: 'bold', marginBottom: '10px' }}>Tarix</label>
                        <br />
                        <input placeholder='Tarix' name='status' type='time' style={{ height: '35px', float: 'left' }}></input>
                    </div>
                    <div style={{ textAlign: 'left', height: '55px' }}>
                        <label htmlFor='number' style={{ color: 'white', fontWeight: 'bold', marginBottom: '10px' }}>Nömrə</label>
                        <br />
                        <input placeholder='Nömrə' name='number' type='time' style={{ height: '35px', float: 'left' }}></input>
                    </div>
                    <div style={{ textAlign: 'left', height: '55px' }}>
                        <label htmlFor='Deadline' style={{ color: 'white', fontWeight: 'bold', marginBottom: '10px' }}>Deadline</label>
                        <br />
                        <input placeholder='Deadline' name='deadline' type='time' style={{ height: '35px', float: 'left' }}></input>
                    </div>
                    <div style={{ textAlign: 'left', height: '55px' }}>
                        <label htmlFor='teyinat' style={{ color: 'white', fontWeight: 'bold', marginBottom: '10px' }}>Təyinatı</label>
                        <br />
                        <input placeholder='Təyinatı' name='teyinat' type='time' style={{ height: '35px', float: 'left' }}></input>
                    </div>
                    <div style={{ textAlign: 'left', height: '55px', display: 'flex', minWidth: '180px', flexDirection: 'column-reverse' }}>
                        <button style={{ height: '35px', marginBottom: '1.5px', color: 'white', fontWeight: '600', padding: '3px 6px', float: 'left', minWidth: '180px', fontFamily: 'sans-serif', border: 'none', backgroundColor: '#ffae00' }}> AXTAR</button>
                    </div>
                </div>
            </div>
        </div>
    )
}