import axios from 'axios';
import { setAlert } from './alert';
import { REGISTER_SUCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCESS, LOGIN_FAIL, LOGOUT } from './type';
import setAuthToken from '../utils/setAuthToken';


//Load User

export const loadUser = () => async dispatch => {

    if (localStorage.token)
        setAuthToken(localStorage.token);

    try {
        const res = await axios.get('http://localhost:5000/api/auth');

        console.log(res);
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


//Register User
export const register = ({ name, email, password }) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }

    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post('http://localhost:5000/api/users', body, config);

        dispatch({
            type: REGISTER_SUCESS,
            payload: res.data
        })

        dispatch(loadUser());
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

//Login User

export const loginUser = ({ email, password }) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }

    const body = JSON.stringify({ email, password });
    console.log(body);
    try {
        const res = await axios.post('http://localhost:5000/api/auth', body, config);
        console.log(res);
        dispatch({
            type: LOGIN_SUCESS,
            payload: res.data
        })

        dispatch(loadUser());
        dispatch(setAlert("User succesfully logined", "success"));
    } catch (err) {

        const errors = err.response.data.errors;

        if (errors) {
            //dispatch(setAlert(errors, 'danger'));
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: LOGIN_FAIL
        })
    }
}

//LogOut /Clear Profile

export const logout = () => dispatch => {
    dispatch({ type: LOGOUT })
}