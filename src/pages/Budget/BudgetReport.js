import React, { useContext, useEffect, useState } from "react"
import useFetch from "../../hooks/useFetch";
import { months } from "../../data/data"
import { FaFileExcel } from "react-icons/fa";
import { TokenContext } from "../../App";
const date = new Date()
const month = months.find(month => Number(month.value) === date.getMonth() + 1);
const year = date.getFullYear();
const exportToExcel = (rows) => {
    const month = rows.length !== 0 ? months.find(month => Number(month.value) === rows[0].month).name : ""
    const tableBody = rows.map(row =>
        `<tr>
            <td>${row.in}</td>
            <td>${row.code}</td>
            <td>${row.name}</td>
            <td>${row.pl}</td>
            <td>${row.fa}</td>
            <td>${row.pl - row.fa}</td>
        </tr>
        `
    ).reduce((con, curr) => con += curr, "")
    const excelTableData = `
            <thead>
                <tr>
                    <th style="background-color: tomato"></th>
                    <th style="background-color: tomato"></th>
                    <th style="font-size: 20px; color: white; background-color: tomato" rowSpan="2">Inzibati xərclər</th>
                    <th style="width: 120px; color: white; background-color: tomato">Plan</th>
                    <th style="width: 120px; color: white; background-color: tomato">Fakt</th>
                    <th style="width: 120px; color: white; background-color: tomato">Fərq</th>
                </tr>
                <tr>
                    <th style="width: 50px; color: white; background-color: tomato">#</th>
                    <th style="width: 120px; color: white; background-color: tomato">Kod</th>
                    <th style="width: 120px; color: white; background-color: tomato" colSpan="3">${month}</th>
                </tr>
            </thead>
            <tbody>
                ${tableBody}
            </tbody>
`
    const year = document.getElementById("year").value;

    var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    var ctx = { worksheet: `${month}-${year}` || 'Worksheet', table: excelTableData }
    const link = document.getElementById("a");
    link.href = uri + base64(format(template, ctx))
    link.download = `${month}-${year}.xls`;
    link.click();
}
const BudgetReport = () => {
    const [rows, setRows] = useState([]);
    const userData = useContext(TokenContext)[0].userData;
    const { structureid } = userData.userInfo
    const fetchPost = useFetch("POST");
    useEffect(() => {
        let mounted = true;
        const abortController = new AbortController();
        const data = { period: `${year}${month.value}`, structureid }
        if (mounted)
            fetchPost("http://192.168.0.182:54321/api/budget-report", data, abortController)
                .then(resp => {
                    setRows(resp)
                })
                .catch(ex => console.log(ex))
        return () => {
            abortController.abort();
            mounted = false
        }
    }, [fetchPost, structureid]);
    return (
        <>
            <div className="app">
                <ReportSearch setRows={setRows} structureid={structureid} fetchPost={fetchPost} />
                {// eslint-disable-next-line
                    <a id="a" style={{ display: "none" }} download={month} href="#" target="_blank" />
                }
                <div className="budget-report-container">
                    <div>
                        <ul className="budget-report" style={{ margin: "0px" }}>
                            <li style={{ backgroundColor: "tomato", padding: "6px 0px" }}>
                                <div>#</div>
                                <div>Kod</div>
                                <div style={{ backgroundColor: "tomato" }}>Inzibati xərclər</div>
                                <div>Plan</div>
                                <div>Fakt</div>
                                <div>Fərq</div>
                            </li>
                            {
                                rows.map(row =>
                                    <BudgetReportRow
                                        key={row.code}
                                        code={row.code}
                                        name={row.name}
                                        planned={row.pl}
                                        fact={row.fa}
                                        index={row.in}
                                    />
                                )
                            }
                        </ul>
                    </div>
                    <div
                        style={{
                            position: "fixed",
                            zIndex: 2,
                            bottom: "50px",
                            right: "50px"
                        }}
                    >
                        <FaFileExcel onClick={() => exportToExcel(rows)} cursor="pointer" color="#1d6f42" title="Export to Excel" size="40" />
                        <br />
                    </div>
                </div>
            </div>
        </>
    )
}
export default BudgetReport

const BudgetReportRow = (props) => {
    const { index, code, name, planned, fact } = props;
    return (
        <li >
            <div>{index}</div>
            <div>{code}</div>
            <div style={{ border: "1px solid white" }}>{name}</div>
            <div>{planned}</div>
            <div>{fact}</div>
            <div>{planned - fact}</div>
        </li>
    )
}

const ReportSearch = (props) => {
    const { fetchPost, setRows, structureid } = props;
    const fetchGet = useFetch("GET");
    const [searchSate, setSearchState] = useState({ period: `${year}${month.value}`, month: month.value, year, structureid })
    const [departments, setDepartments] = useState([]);
    useEffect(() => {
        fetchGet('http://192.168.0.182:54321/api/departments')
            .then(respJ => setDepartments(respJ))
            .catch(ex => console.log(ex));
    }, [fetchGet])
    const handleMonthSelect = (value) => {
        setSearchState(prev => {
            const data = { period: `${prev.year}${value}`, structureid: prev.structureid }
            fetchPost("http://192.168.0.182:54321/api/budget-report", data)
                .then(resp => {
                    setRows(resp)
                })
                .catch(ex => console.log(ex))
            return ({ ...prev, period: `${prev.year}${value}`, month: value })
        })
    }
    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setSearchState(prev => {
            const newState = name === "year" ? { ...prev, period: `${value}${prev.month}`, year: value } : { ...prev, structureid: value }
            const data = { period: newState.period, structureid: newState.structureid }
            fetchPost("http://192.168.0.182:54321/api/budget-report", data)
                .then(resp => {
                    setRows(resp)
                })
                .catch(ex => console.log(ex))
            return newState
        })
    }

    return (
        <div style={{ maxWidth: "1156px", margin: "auto", marginBottom: "10px", overflow: "hidden" }}>
            <div className="months">
                {
                    months.map(month =>
                        <div
                            key={month.name}
                            style={{ backgroundColor: searchSate.month === month.value ? '#0495ce' : '' }}
                            onClick={() => handleMonthSelect(month.value)}
                        >
                            {month.name}
                        </div>
                    )
                }
            </div>
            <select style={{ float: "right", padding: "6px" }} id="year" name="year" value={searchSate.year} onChange={handleChange}>
                <option value={year} >{year}</option>
                <option value={year - 1} >{year - 1}</option>
            </select>
            <select style={{ float: "right", padding: "6px", marginRight: "10px" }} name="department" value={searchSate.structureid} onChange={handleChange}>
                {
                    departments.map(department =>
                        <option value={department.id} key={department.id}>{department.name}</option>
                    )
                }
            </select>
        </div>
    )
}