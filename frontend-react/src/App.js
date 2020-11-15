import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { observer } from 'mobx-react';
import UserStore from './stores/user';

import './App.scss';
import { Scrollbars } from 'react-custom-scrollbars';

import AppNavbar from './components/Layout/AppNavbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

import Dashboard from './components/Pages/Dashboard';
import Profile from './components/Pages/Profile';
import Examinations from './components/Pages/Examinations';
import Measurements from './components/Pages/Measurements';

class App extends React.Component {

  async componentDidMount () {
    await UserStore.checkAuthenticate();
  }

  render () {
    return (
      <Router>
        {( UserStore.state === 'logged' )
          ? <React.Fragment>
            <AppNavbar />
            <Scrollbars autohide="true">
              <main className="m-3" role="main" style={{ paddingTop: '3.5em' }}>
                <Switch>
                  <Route exact path="/dashboard" component={Dashboard} />
                  <Route exact path="/profile" component={Profile} />
                  <Route exact path="/examinations" component={Examinations} />
                  <Route exact path="/measurements" component={Measurements} />
                  <Redirect to="/dashboard" />
                </Switch>
              </main>
            </Scrollbars>
          </React.Fragment>
          : ( UserStore.state === 'pending' )
            ? null
            : <React.Fragment>
              <Switch>
                <Route exact path="/" component={LoginForm} />
                <Route exact path="/login" component={LoginForm} />
                <Route exact path="/register" component={RegisterForm} />
                <Redirect to="/" />
              </Switch>
            </React.Fragment>
        }
      </Router>
    );
  }
}

export default observer( App );
