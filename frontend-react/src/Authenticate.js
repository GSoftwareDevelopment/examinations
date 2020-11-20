import React, { Component } from 'react'
import { Redirect, Route, Switch } from "react-router-dom";

import UserStore, { AuthorizeMessage } from './stores/user';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

export default class Authenticate extends Component {
	render() {
		return ( UserStore.state === 'pending' )
						? <AuthorizeMessage />
						:	<Switch>
								<Route exact path="/" component={LoginForm} />
								<Route exact path="/login" component={LoginForm} />
								<Route exact path="/register" component={RegisterForm} />
								<Redirect to="/" />
							</Switch>
	}
}
