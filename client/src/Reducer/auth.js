import { REGISTER_SUCESS, REGISTER_FAIL } from '../actions/type';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case REGISTER_SUCESS:
            localStorage.setItem('jwttoken', payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            }
        case REGISTER_FAIL:
            localStorage.removeItem('jwttoken');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            }
        default:
            return false;
    }
}