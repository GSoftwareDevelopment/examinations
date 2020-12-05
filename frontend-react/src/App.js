import React, { Component } from "react";
import { HashRouter } from "react-router-dom";

import { observer } from "mobx-react";

import AuthenticateStore from "./stores/authenticate";
import "./App.scss";

import Main from "./components/RoutesMain";
import Authenticate from "./components/RoutesAuthenticate";

import Errors from "./components/Layout/Errors";

class App extends Component {
	async componentDidMount() {
		await AuthenticateStore.checkAuthenticate();
	}

	render() {
		return (
			<HashRouter>
				{AuthenticateStore.state === "logged" ? <Main /> : <Authenticate />}
				<Errors />
			</HashRouter>
		);
	}
}

export default observer(App);
