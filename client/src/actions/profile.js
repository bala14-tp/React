import axios from 'axios';
import { GET_PROFILE, PROFILE_ERROR } from './type';
import { setAlert } from './alert';

export const getCurrentProfile = () => async dispacth => {

    try {
        const res = await axios.get('http://localhost:5000/api/profile/me');

        dispacth({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispacth({
            type: PROFILE_ERROR,
            payload: { msg: err.response.data.msg, status: err.response.status }
        })

        //console.log((err.response))
        dispacth(setAlert(err.response.data.msg, 'danger'));
    }
}


export const createProfile = (formData, history, edit = false) => async dispacth => {
    try {

        const config = {
            header: {
                'content-Type': 'application/json'
            }
        };

        await axios.post('http://localhost:5000/api/profile/', formData, config);

        history.push('/dashboard');

        dispacth(setAlert((edit ? "Profile Updated" : "Profile Saved"), "success"));

    } catch (err) {

        dispacth({
            type: PROFILE_ERROR,
            payload: { msg: err.response.data.msg, status: err.response.status }
        });

        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispacth(setAlert(error.msg, 'danger')));
        }
    }
}

