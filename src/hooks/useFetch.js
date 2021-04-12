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
                    const contentType = resp.headers.get("content-type");
                    if (resp.status === 401)
                        logout()
                    else if (resp.status === 403)
                        throw new Error(403)
                    else if (contentType && contentType.indexOf("application/json") !== -1)
                        return resp.json()
                    else
                        throw new Error(500)
                })
        }
    return useCallback(func, [token])
}

export default useFetch