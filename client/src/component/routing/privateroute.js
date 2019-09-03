//racf
import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';


const privateroute = ({ component: Component, auth: { isAuthenticated, loading }, ...rest }) => (
    <Route
        {...rest}
        render={props => !isAuthenticated && !loading ? (
            <Redirect to='/login' />) : (<Component {...props} />
            )
        }
    />
);

//Normal Way

// const privateroute = (props) => {
//     return (
//         <Route
//             render={() => !props.auth.isAuthenticated && !props.auth.loading ? (
//                 <Redirect to='/login' />) : (<props.component {...props} />
//                 )
//             }
//         />);
// };

// privateroute.prototype = {
//     auth: PropTypes.object.isRequired
// }

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(privateroute);
