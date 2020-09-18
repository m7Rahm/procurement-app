import React, { useState, useEffect } from 'react'
import {
    MdChevronLeft,
    MdChevronRight
} from 'react-icons/md'
const Pagination = (props) => {
    const active = props.activePageRef.current;
    const count = Math.ceil(props.count / 20) <= 1 ? 0 : Math.ceil(props.count / 20) + 1;
    const [pages, setPages] = useState([]);
    useEffect(() => {
        const elemCount = count > 4 ? 4 : count;
        const arr = [];
        if (active === 0){
            for (let i = 0; i < elemCount; i++) {
                arr.push(active + i);
            }
            setPages(arr)
        }
        else if ((active >= 2 && active + 3 < count)) {
            console.log(active)
            for (let i = 0; i < elemCount; i++) {
                arr.push(active + i - 1);
            }
            setPages(arr)
        }
    }, [active, count])
    // const updateList = useCallback(props.updateList, []);
    // useEffect(() => {
    //     updateList(active * 20)
    // }, [updateList, active]);

    const handlePageCardClick = (page) => {
        props.activePageRef.current = page;
        props.updateList(page * 20)
    }
    const handleNavigationToLeft = () => {
        const active = props.activePageRef.current - 1;
        props.activePageRef.current = active;
        props.updateList(active * 20)
    }
    const handleNavigationToRight = () => {
        const active = props.activePageRef.current + 1;
        props.activePageRef.current = active;
        props.updateList(active * 20)
    }
    return (
        <div className="pagination">
            <MdChevronLeft style={{ visibility: active === 0 ? 'hidden' : 'visible' }} onClick={handleNavigationToLeft} size="25" />
            {
                pages.map((page, index) =>
                    <div
                        className={page === active ? 'active' : ''}
                        key={index}
                        onClick={() => handlePageCardClick(page)}
                    >
                        {page + 1}
                    </div>
                )
            }
            <MdChevronRight style={{ visibility: active + 2 < count && count !== 0 ? 'visible' : 'hidden' }} onClick={handleNavigationToRight} size="25" />
        </div>
    )
}
export default Pagination