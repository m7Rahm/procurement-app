import React, { useRef, useState } from 'react'
import {
    GoChevronDown
} from 'react-icons/go'
import {
    FcHighPriority,
    FcLowPriority,
    FcMediumPriority
} from 'react-icons/fc'
import {
    FaTimes
} from 'react-icons/fa'
import SearchBox from './SearchBox';
const IconsPanel = (props) => {
    const searchBoxRef = useRef(null);
    const {
        updateList,
        token,
        checkedAmountRef,
        setVisas,
        iconsVisible,
        searchParamsRef,
        activePageRef
    } = props;
    const [searchBoxState, setSearchBoxState] = useState(false);
    const setBulkPriority = (priority) => {
        const data = JSON.stringify({
            visaCards: checkedAmountRef.current.map(id =>
                [id, 0, priority]),
            update: 1
        })
        fetch(`http://172.16.3.101:54321/api/change-visa-state`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Authorization': 'Bearer ' + token
            },
            body: data
        })
            .then(resp => {
                if (resp.status === 200)
                    return resp.json()
                else
                    throw new Error('Internal Server Error');
            })
            .then(respJ => {
                const totalCount = respJ[0] ? respJ[0].total_count : 0;
                setVisas({ count: totalCount, visas: respJ });
            })
            .catch(error => console.log(error));
    }
    const onAdvSearchClick = () => {
        if (!searchBoxState)
            setSearchBoxState(true);
        else if (searchBoxRef.current.style.display === 'none') {
            searchBoxRef.current.classList.remove('advanced-search-bar-hide');
            searchBoxRef.current.style.display = 'block';
        }
        else {
            searchBoxRef.current.classList.add('advanced-search-bar-hide')
        }
    }
    return (
        <>
            {
                iconsVisible ?
                    <>
                        <FaTimes onClick={() => setBulkPriority(0)} title="" size="25" />
                        <FcLowPriority onClick={() => setBulkPriority(1)} title="Aşağı prioritet" size="25" />
                        <FcMediumPriority onClick={() => setBulkPriority(2)} title="Orta prioritet" size="25" />
                        <FcHighPriority onClick={() => setBulkPriority(3)} title="Yüksək prioritet" size="25" />
                    </>
                    : <div>
                        <GoChevronDown size="24" onClick={onAdvSearchClick} />
                        {
                            searchBoxState &&
                            <SearchBox
                                searchParamsRef={searchParamsRef}
                                setVisas={setVisas}
                                updateList={updateList}
                                token={token}
                                activePageRef={activePageRef}
                                ref={searchBoxRef}
                            />
                        }
                    </div>
            }
        </>
    )
}
export default IconsPanel