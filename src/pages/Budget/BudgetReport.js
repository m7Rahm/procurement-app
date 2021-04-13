import React, { useEffect, useState } from "react"
import useFetch from "../../hooks/useFetch";
import { months } from "../../data/data"
import { FaFileExcel } from "react-icons/fa";
const date = new Date()
const month = months.find(month => Number(month.value) === date.getMonth() + 1);
const year = date.getFullYear()
const BudgetReport = () => {
    const [rows, setRows] = useState([]);
    const fetchPost = useFetch("POST");
    useEffect(() => {
        const data = { period: `${year}${month.value}` }
        fetchPost("http://192.168.0.182:54321/api/budget-report", data)
            .then(resp => {
                setRows(resp)
            })
            .catch(ex => console.log(ex))
        return () => {
        }
    }, [fetchPost]);
    const exportToExcel = () => {
        const tableBody = rows.map(row =>
            `<tr>
                <td>${row.in}</td>
                <td>${row.code}</td>
                <td>${row.name}</td>
                <td>${row.pl}</td>
                <td>${row.fa}</td>
            </tr>
            `
        ).reduce((con, curr) => con += curr, "")
        const excelTableData = `<html xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:WorksheetOptions>
                                <x:Panes></x:Panes>
                            </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
        </head>
            <body>
        <table>
        <thead>
            <tr >
                <th style="background-color: tomato"></th>
                <th style="background-color: tomato"></th>
                <th style="font-size: 20px; color: white; background-color: tomato" rowSpan="2">Inzibati xərclər</th>
                <th style="width: 120px; color: white; background-color: tomato">Plan</th>
                <th style="width: 120px; color: white; background-color: tomato">Fakt</th>
            </tr>
            <tr>
                <th style="width: 50px; color: white; background-color: tomato">#</th>
                <th style="width: 120px; color: white; background-color: tomato">Kod</th>
                <th style="width: 120px; color: white; background-color: tomato" colSpan="2">Mart</th>
            </tr>
        </thead>
        <tbody>
            ${tableBody}
        </tbody>
    </table>
    </body>
    </html>
    `
        const url = "data:application/vnd.ms-excel;charset=utf-8,\uFEFF" + encodeURIComponent(excelTableData);
        window.open(url)
    }
    return (
        <>
            <div className="dashboard app">
                <ReportSearch setRows={setRows} fetchPost={fetchPost} />
                <div className="budget-report-container">
                    <div>
                        <ul className="budget-report" >
                            <li style={{ backgroundColor: "tomato", padding: "6px 0px" }}>
                                <div>#</div>
                                <div>Kod</div>
                                <div style={{ backgroundColor: "tomato" }}>Inzibati xərclər</div>
                                <div>Plan</div>
                                <div>Fakt</div>
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
                        <FaFileExcel onClick={exportToExcel} cursor="pointer" color="#1d6f42" title="Export to Excel" size="40" />
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
        </li>
    )
}

const ReportSearch = (props) => {
    const { fetchPost, setRows } = props
    const [searchSate, setSearchState] = useState({ period: `${year}${month.value}`, month: month.value, year })
    const handleMonthSelect = (value) => {
        setSearchState(prev => {
            const data = { period: `${prev.year}${value}` }
            fetchPost("http://192.168.0.182:54321/api/budget-report", data)
                .then(resp => {
                    console.log(resp)
                    setRows(resp)
                })
                .catch(ex => console.log(ex))
            return ({ ...prev, period: `${prev.year}${value}`, month: value })
        })
    }
    const handleChange = (e) => {
        const value = e.target.value;
        setSearchState(prev => {
            const data = { period: `${value}${prev.month}` }
            fetchPost("http://192.168.0.182:54321/api/budget-report", data)
                .then(resp => {
                    setRows(resp)
                })
                .catch(ex => console.log(ex))
            return ({ ...prev, period: `${value}${prev.month}`, year: value })
        })
    }
    return (
        <div style={{ maxWidth: "1156px", margin: "auto" }}>
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
            <select style={{ float: "right", padding: "6px" }} value={searchSate.year} onChange={handleChange}>
                <option value={year} >{year}</option>
                <option value={year - 1} >{year - 1}</option>
            </select>
        </div>
    )
}