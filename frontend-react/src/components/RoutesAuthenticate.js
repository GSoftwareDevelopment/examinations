import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import "./authenticate.scss";

import AuthenticateStore, { AuthorizeMessage } from "../stores/authenticate";

import LoginForm from "./Pages/authenticate/LoginForm";
import RegisterForm from "./Pages/authenticate/RegisterForm";

export default class Authenticate extends Component {
	render() {
		return AuthenticateStore.state === "pending" ? (
			<AuthorizeMessage />
		) : (
			<Switch>
				<Route exact path="/" component={LoginForm} />
				<Route exact path="/login" component={LoginForm} />
				<Route exact path="/register" component={RegisterForm} />
				<Redirect to="/" />
			</Switch>
		);
	}
}
