import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './component/layout/Navbar';
import Landing from './component/layout/Landing';
import Login from './component/auth/Login';
import Register from './component/auth/Register';
import './App.css';

const App = () => {
  return (
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <switch>
            <Route exact path="/Login" component={Login} />
            <Route exact path='/Register' component={Register} />
          </switch>
        </section>
      </Fragment>
    </Router>
  );
}

export default App;
