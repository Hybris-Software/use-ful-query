import { useReducer, useEffect, useRef, useContext } from 'react';
import ApiProviderContext from '../Context/ApiProviderContext';

const status = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
}

const useQuery = ({ url, method = "GET", executeImmediately = false, onSuccess = () => { }, onError = () => { }, onUnauthorized = () => { } }) => {

    const apiClient = useContext(ApiProviderContext);
    const cancelRequest = useRef(false)
    const initialState = { data: undefined, error: undefined, status: executeImmediately ? status.LOADING : status.IDLE }

    const fetchReducer = (state, action) => {
        switch (action.status) {
            case status.LOADING:
                return { ...initialState, status: status.LOADING }
            case status.SUCCESS:
                return { ...initialState, status: status.SUCCESS, data: action.payload }
            case status.ERROR:
                return { ...initialState, status: status.ERROR, error: action.payload }
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(fetchReducer, initialState)

    const executeQuery = (data = {}) => {

        cancelRequest.current = false
        dispatch({ status: status.LOADING })

        apiClient({ url: url, method: method, data: data })
            .then(response => {
                if (cancelRequest.current) return
                dispatch({ status: status.SUCCESS, payload: response })
                onSuccess(response)
            })
            .catch(error => {
                if (cancelRequest.current) return
                dispatch({ status: status.ERROR, payload: error.response })
                if (error.response && error.response.status === 401) {
                    onUnauthorized()
                }
                else {
                    onError(error.response)
                }
            })
    }

    useEffect(() => {
        if (executeImmediately) executeQuery()
        return () => {
            cancelRequest.current = true;
        }
    }, [url])

    return {
        isLoading: state.status === status.LOADING,
        isError: state.status === status.ERROR,
        isSuccess: state.status === status.SUCCESS,
        data: state.data,
        error: state.error,
        executeQuery: executeQuery,
    }
}

export default useQuery;