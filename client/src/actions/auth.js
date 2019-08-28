import axios from 'axios';
import { setAlert } from './alert';
import { REGISTER_SUCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR } from './type';
import setAuthToken from '../utils/setAuthToken';


//Load User

export const loadUser = () => async dispatch => {
    
    if (localStorage.token)
        setAuthToken(localStorage.token);

    try {
        const res = await axios.get('http://localhost:5000/api/auth');

        //console.log(res);
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })

    } catch (error) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

export const register = ({ name, email, password }) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }

    // const config = {
    //     headers: {
    //         'content-type': 'application/json',
    //         'Access-Control-Allow-Origin':'*'
    //     }
    // }

    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post('http://localhost:5000/api/users', body, config);

        dispatch({
            type: REGISTER_SUCESS,
            payload: res.data
        })
    } catch (err) {

        const errors = err.response.data.errors;

        if (errors) {
            dispatch(setAlert(errors, 'danger'));
            //errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: REGISTER_FAIL
        })
    }

}