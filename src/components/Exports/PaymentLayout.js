import React, { useEffect, useState } from "react"
import { Document, Page, Text, View, StyleSheet, PDFViewer, Font, Image } from '@react-pdf/renderer';
import { useLocation } from "react-router";
import useFetch from "../../hooks/useFetch";
Font.register({
    family: "Roboto",
    src:
        "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
});
const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        display: "flex",
        fontFamily: "Roboto",
        backgroundColor: "white"
    },
    section: {
        margin: 10,
        padding: 10,
        // flex: 1
    },
    title: {
        textAlign: "center",
        padding: "10px",
        color: "gray"
    },
    headerText: {
        flex: 1,
        textAlign: "center",
        color: "white",
        fontSize: "14px"
    },
    materialRowText: {
        flex: 1,
        textAlign: "center",
        fontSize: "13px"
    },
    header: {
        padding: "6px 0px",
        display: "flex",
        backgroundColor: "royalblue",
        flexDirection: "row"
    },
    materialRow: {
        display: "flex",
        fontSize: "12px",
        backgroundColor: "gainsboro",
        flexDirection: "row"
    },
    materialsTable: {
        margin: "10px",
        border: "1px solid gray"
    },
    participants: {
        margin: "10px",
        border: "1px solid gray"
    },
    participantsHeader: {
        backgroundColor: "#D93404",
        flexDirection: "row",
        display: "flex",
    }
});
const getResultText = (result) => {
    if (result === 0)
        return 'Baxılır..'
    else if (result === -1)
        return 'Etiraz Edildi'
    else if (result === 1)
        return 'Təsdiq Edildi'
    else if (result === 2)
        return 'Redaytəyə Qaytarıldı'
    else if (result === 3)
        return 'Redaktə Edildi'
}
// Create styles
const PaymentLayout = () => {
    const state = useLocation().state
    const { docType, docid, number } = state ? state : {}
    const [participants, setParticipants] = useState([])
    const fetchGet = useFetch("GET");
    useEffect(() => {
        fetchGet(`http://192.168.0.182:54321/api/doc-participants?id=${docid}&doctype=${docType}`)
            .then(respJ => setParticipants(respJ))
            .catch(ex => console.log(ex))
    }, [docid, docType, fetchGet])
    return (
        state && state.materials.current
            ? <div style={{
                margin: "auto",
                paddingTop: "100px",
                height: "100vh",
            }}>
                <PDFViewer style={{ width: "100%", height: "100%" }}>
                    <Document>
                        <Page size="A4" style={styles.page}>
                            <Text style={styles.title}>{number}</Text>
                            <Image style={{ height: "20px", width: "20px" }} src="/logo192.png" />
                            <View style={styles.materialsTable}>
                                <View style={styles.header}>
                                    <Text style={{ width: "50px", textAlign: "center", color: "white" }}></Text>
                                    <Text style={styles.headerText}>Ad</Text>
                                    <Text style={styles.headerText}>Say</Text>
                                    <Text style={styles.headerText}>Vendor</Text>
                                    <Text style={styles.headerText}>VÖEN</Text>
                                    <Text style={styles.headerText}>Müqavilə №</Text>
                                </View>
                                {
                                    state.materials.current.map((material, index) =>
                                        <View key={material.id} style={{ ...styles.materialRow, backgroundColor: index % 2 === 0 ? "white" : "gainsboro" }}>
                                            <Text style={{ width: "50px", textAlign: "center" }}>{index + 1}</Text>
                                            <Text style={styles.materialRowText}>{material.material_name}</Text>
                                            <Text style={styles.materialRowText}>{material.amount}</Text>
                                            <Text style={styles.materialRowText}>{material.vendor_name}</Text>
                                            <Text style={styles.materialRowText}>{material.voen}</Text>
                                            <Text style={styles.materialRowText}>{material.contract_number}</Text>
                                        </View>
                                    )
                                }
                            </View>
                            <View style={styles.section}>
                                <Text>Iştirakçılar</Text>
                            </View>
                            <View style={styles.participants}>
                                <View style={styles.participantsHeader}>
                                    <Text style={styles.headerText}>Ad Soyad</Text>
                                    <Text style={styles.headerText}>Status</Text>
                                    <Text style={styles.headerText}>Tarix</Text>
                                    <Text style={styles.headerText}>Qeyd</Text>
                                </View>
                                {
                                    participants.map((participant, index) =>
                                        <View style={styles.materialRow} key={index}>
                                            <Text style={styles.materialRowText}>{participant.full_name}
                                                {/* <div style={{ fontWeight: '600', fontSize: 11, color: '#777777' }}>{participant.department_name}</div> */}
                                            </Text>
                                            <Text style={styles.materialRowText}>{getResultText(participant.result)}</Text>
                                            <Text style={styles.materialRowText}>{participant.action_date_time}</Text>
                                            <Text style={styles.materialRowText}>{participant.comment}</Text>
                                        </View>
                                    )
                                }
                            </View>
                        </Page>
                    </Document>
                </PDFViewer>
            </div>
            : <></>
    )
};
export default PaymentLayout