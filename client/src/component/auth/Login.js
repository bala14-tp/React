import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { loginUser } from '../../actions/auth';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';


const Login = ({ loginUser, isAuthenticated }) => {

    const [FormData, setFormData] = useState({
        password: '',
        email: ''
    });

    const { password, email } = FormData;

    const onchange = (e) => {
        setFormData({ ...FormData, [e.target.name]: e.target.value });
    }

    const Save = (e) => {
        e.preventDefault();
        //console.log(FormData);
        loginUser(FormData);
    }

    //Redirect if logged in
    if (isAuthenticated) {
        return <Redirect to='/dashbord' />;
    }

    return (
        <Fragment>
            {/* <div className="alert alert-danger">
                Invalid credentials
            </div> */}
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
            <form className="form" onSubmit={e => { Save(e) }}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email" value={email}
                        required
                        onChange={e => { onchange(e) }}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password" value={password}
                        onChange={e => { onchange(e) }}
                        required
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </Fragment>
    )
}

Login.propTypes = {
    //ptfr
    //login: PropTypes.func.isRequired
   // isAuthenticated:propTypes.func.isRequired
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { loginUser })(Login);