import React, { useRef, useState } from 'react'
import { GoChevronDown } from 'react-icons/go'
import { IoMdBookmark } from 'react-icons/io'
import { FaTimes } from 'react-icons/fa'
import SearchBox from './SearchBox';
import useFetch from '../../hooks/useFetch';
const IconsPanel = (props) => {
    const searchBoxRef = useRef(null);
    const {
        updateList,
        checkedAmountRef,
        setVisas,
        iconsVisible,
        searchParamsRef,
        activePageRef
    } = props;
    const [searchBoxState, setSearchBoxState] = useState(false);
    const fetchPost = useFetch("POST")
    const setBulkPriority = (priority) => {
        const data = {
            visaCards: checkedAmountRef.current.map(id =>
                [id, 0, priority]),
            update: 1
        }
        fetchPost(`http://192.168.0.182:54321/api/change-visa-state`, data)
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
                        <IoMdBookmark onClick={() => setBulkPriority(1)} cursor="pointer" color="#1a73e8" title="Aşağı prioritet" size="25" />
                        <IoMdBookmark onClick={() => setBulkPriority(2)} cursor="pointer" color="#d8eb3e" title="Orta prioritet" size="25" />
                        <IoMdBookmark onClick={() => setBulkPriority(3)} cursor="pointer" color="tomato" title="Yüksək prioritet" size="25" />
                    </>
                    : <div>
                        <GoChevronDown size="24" onClick={onAdvSearchClick} />
                        {
                            searchBoxState &&
                            <SearchBox
                                searchParamsRef={searchParamsRef}
                                setVisas={setVisas}
                                updateList={updateList}
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