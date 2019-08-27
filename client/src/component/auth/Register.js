import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'

//import Axios from 'axios';

const Register = ({ setAlert }) => {

    const [FormData, setFormData] = useState({
        name: '',
        password: '',
        password2: '',
        email: ''
    });

    const { name, password, password2, email } = FormData;

    const onchange = (e) => {
        setFormData({ ...FormData, [e.target.name]: e.target.value });
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password != password2) {
            //console.log('Password not matching');
            setAlert('Password not matching', 'danger');
        }
        else {
            // const config = {
            //     headers: {
            //         'Content-type': 'application/json'
            //     }
            // }

            // const newUser = { name, password, email };

            // const body = JSON.stringify(newUser);

            // const res = await Axios.post('api/users', body, config);

            // console.log(res);

            console.log("Data Inserted")
        }
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="text" placeholder="Name" name="name" required value={name} onChange={e => onchange(e)} />
                </div>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onchange(e)} required />
                    <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
                    >
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        value={password} onChange={e => onchange(e)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        minLength="6"
                        value={password2} onChange={e => onchange(e)}
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="login.html">Sign In</Link>
            </p>
        </Fragment>
    )
}


Register.propTypes={
    //ptfr
    setAlert:PropTypes.func.isRequired
}

export default connect(null, { setAlert })(Register);