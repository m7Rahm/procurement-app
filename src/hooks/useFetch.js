import { useCallback, useContext } from "react"
import { TokenContext } from "../App"

const useFetch = (method) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const logout = tokenContext[2];

    const func = method === "GET"
        ? (url, abortController) => {
            const aController = abortController || new AbortController()
            return fetch(url, {
                signal: aController.signal,
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
                .then(resp => {
                    if (resp.status === 401)
                        logout()
                    else
                        return resp.json()
                })
        }
        : (url, data, abortController) => {
            const apiData = JSON.stringify(data);
            const aController = abortController || new AbortController()
            return fetch(url, {
                method: "POST",
                signal: aController.signal,
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json",
                    "Content-Length": apiData.length
                },
                body: apiData
            })
                .then(resp => {
                    if (resp.status === 401)
                        logout()
                    else
                        return resp.json()
                })
        }
    return useCallback(func, [token])
}

export default useFetch