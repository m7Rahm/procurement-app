import React, { useEffect, useState, useCallback, useRef } from "react"
import CalendarUniversal from "../Misc/CalendarUniversal"
import useFetch from "../../hooks/useFetch"
import { FaArrowRight } from "react-icons/fa";
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const ProductHistory = (props) => {
    const [history, setHistory] = useState([])
    const { productid, subGlCategory } = props
    const fetchPost = useFetch("POST")
    const searchStateRef = useRef({
        dateFrom: '',
        dateTo: ''
    })
    const handleInputChange = useCallback((name, value) => {
        searchStateRef.current[name] = value
    }, [])
    useEffect(() => {
        const date = new Date();
        const prevYear = date.getMonth() <= 2
        const month = !prevYear ? date.getMonth() - 2 : date.getMonth() + 10;
        const year = prevYear ? date.getFullYear() - 1 : date.getFullYear();
        const dateFrom = `${year}-${month < 10 ? "0" + month : month}-01`
        const data = { productid: productid, subGlCategoryid: subGlCategory, dateFrom, dateTo: "" }
        fetchPost("http://192.168.0.182:54321/api/get-product-history", data)
            .then(resp => setHistory(resp))
            .catch(ex => console.log(ex))
    }, [fetchPost, productid, subGlCategory]);
    const navigateToContract = (id) => {
        window.location.href = "/contracts/express-contracts?i=" + id
    }
    const handleSearch = () => {
        if ((/^\d{4}([-])\d{2}\1\d{2}$/gi.test(searchStateRef.current.dateTo) || searchStateRef.current.dateTo === "")
            &&
            (/^\d{4}([-])\d{2}\1\d{2}$/gi.test(searchStateRef.current.dateFrom) || searchStateRef.current.dateFrom === "")) {
            const data = { productid: productid, subGlCategoryid: subGlCategory, ...searchStateRef.current }
            fetchPost("http://192.168.0.182:54321/api/get-product-history", data)
                .then(resp => setHistory(resp))
                .catch(ex => console.log(ex))
        }
    }
    return (
        <div style={{ backgroundColor: "white", paddingBottom: "30px" }}>
            <div className="product-history-search-container">
                <div style={{ position: "relative" }}>
                    <CalendarUniversal
                        year={year}
                        month={month}
                        placeholder="Tarixdən"
                        name="dateFrom"
                        searchStateRef={searchStateRef}
                        handleInputChange={handleInputChange}
                    />
                </div>
                <div style={{ position: "relative" }}>
                    <CalendarUniversal
                        year={year}
                        month={month}
                        placeholder="Tarixədək"
                        name="dateTo"
                        searchStateRef={searchStateRef}
                        handleInputChange={handleInputChange}
                    />
                </div>
                <div>
                    <div onClick={handleSearch}>AXTAR</div>
                </div>
            </div>
            <ul className="product-history">
                <li>
                    <div>#</div>
                    <div>Tarix</div>
                    <div>Qiymət</div>
                    <div>Vendor</div>
                    <div>Müqavilə №</div>
                </li>
                {
                    history.filter(info => info.is_out === 0).map((info, index) =>
                        <li key={index}>
                            <div>{index + 1}</div>
                            <div>{info.date}</div>
                            <div>{`${info.price} ${info.currency}`}</div>
                            <div>{info.vendor}</div>
                            <div onClick={() => navigateToContract(info.contract_id)}>
                                {info.contract_num}
                                <FaArrowRight color="#ffae00" style={{ float: "right" }} />
                            </div>
                        </li>
                    )
                }
            </ul>
        </div>
    )
}
export default ProductHistory