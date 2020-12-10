import React, { useRef, useState } from 'react'
import {
    AiTwotonePushpin
} from 'react-icons/ai'
import {
    GoChevronDown
} from 'react-icons/go'
import {
    IoIosArchive,
    IoIosMailOpen,
} from 'react-icons/io';
import SearchBox from './SearchBox';
const IconsPanel = (props) => {
    const searchBoxRef = useRef(null);
    const { updateList, token } = props;
    const [searchBoxState, setSearchBoxState] = useState(false);
    const handleBulkDelete = () => {
        console.log(props.checkedAmountRef.current);
        const data = {
            visaCards: props.checkedAmountRef.current.map(visaCard =>
                [visaCard.val, 1, visaCard.isRead, visaCard.isPinned, visaCard.number, visaCard.empVersion]),
            update: 1
        }
        fetch(`http://172.16.3.101:54321/api/change-visa-state`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length,
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
            .then(resp => {
                if(resp.status === 200)
                    resp.json()
                else
                    throw new Error('Internal Server Error');
            })
            .then(respJ => {
                const totalCount = respJ[0] ? respJ[0].total_count : 0;
                props.setVisas({ count: totalCount, visas: respJ });
            })
            .catch(error => console.log(error));
    }
    const handleBulkRead = () => {
        const data = {
            visaCards: props.checkedAmountRef.current.map(visaCard =>
                [visaCard.val, 0, 1, visaCard.isPinned, visaCard.number, visaCard.empVersion]
            ), update: 0
        }
        fetch(`http://172.16.3.101:54321/api/change-visa-state`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length,
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
            .then(resp => {
                if(resp.status === 200)
                    resp.json()
                else
                    throw new Error('Internal Server Error');
            })
            .catch(error => console.log(error));
    }
    const handleBulkPin = () => {
        const data = {
            visaCards: props.checkedAmountRef.current.map(visaCard =>
                [visaCard.val, 0, visaCard.isRead, 1, visaCard.number, visaCard.empVersion]),
            update: 1
        }
        fetch(`http://172.16.3.101:54321/api/change-visa-state`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length,
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
            .then(resp => {
                if(resp.status === 200)
                    resp.json()
                else
                    throw new Error('Internal Server Error');
            })
            .then(respJ => {
                const totalCount = respJ[0] ? respJ[0].total_count : 0;
                props.setVisas({ count: totalCount, visas: respJ });
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
                props.iconsVisible ?
                    <>
                        <IoIosArchive onClick={handleBulkDelete} color="dodgerblue" title="Arxiv et" size="25" />
                        <IoIosMailOpen onClick={handleBulkRead} color="dodgerblue" title="Oxunmuş et" size="25" />
                        <AiTwotonePushpin onClick={handleBulkPin} color="dodgerblue" title="Oxunmuş et" size="25" />
                    </>
                    : <div>
                        <GoChevronDown style={{ display: props.isDraft ? 'none' : '' }} size="24" onClick={onAdvSearchClick} />
                        {
                            searchBoxState &&
                            <SearchBox
                                searchParamsRef={props.searchParamsRef}
                                setVisas={props.setVisas}
                                updateList={updateList}
                                token={token}
                                activePageRef={props.activePageRef}
                                ref={searchBoxRef}
                            />
                        }
                    </div>
            }
        </>
    )
}
export default IconsPanel