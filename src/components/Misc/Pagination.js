import React, { useState, useEffect } from 'react'
import {
    MdChevronLeft,
    MdChevronRight
} from 'react-icons/md'
const Pagination = (props) => {
    const { count, activePageRef, updateList } = props;
    const active = activePageRef.current;
    const pageCount = Math.ceil(count / 20) <= 1 ? 0 : Math.ceil(count / 20);
    const [pages, setPages] = useState([]);
    useEffect(() => {
        const elemCount = pageCount > 4 ? 4 : pageCount;
        const arr = [];
        if (active === 0) {
            for (let i = 0; i < elemCount; i++) {
                arr.push(active + i);
            }
            setPages(arr)
        }
        else if ((active >= 2 && active + 3 <= pageCount)) {
            for (let i = 0; i < elemCount; i++) {
                arr.push(active + i - 1);
            }
            setPages(arr)
        }
    }, [active, pageCount])

    const handlePageCardClick = (page) => {
        activePageRef.current = page;
        updateList(page * 20)
    }
    const handleNavigationToLeft = () => {
        const active = activePageRef.current - 1;
        activePageRef.current = active;
        updateList(active * 20)
    }
    const handleNavigationToRight = () => {
        const active = activePageRef.current + 1;
        activePageRef.current = active;
        updateList(active * 20)
    }
    return (
        <div id="pagination" className="pagination">
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
            <MdChevronRight style={{ visibility: active + 2 < pageCount && pageCount !== 0 ? 'visible' : 'hidden' }} onClick={handleNavigationToRight} size="25" />
        </div>
    )
}
export default Pagination