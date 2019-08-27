import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {

    const [FormData, setFormData] = useState({
        password: '',
        email: ''
    });

    const {password, email } = FormData;

    const onchange = (e) => {
        setFormData({ ...FormData, [e.target.name]: e.target.value });
    }

    const Save = (e) => {
        e.preventDefault();
        console.log(FormData);
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

export default Login;