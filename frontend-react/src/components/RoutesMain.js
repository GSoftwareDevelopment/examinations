import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { Scrollbars } from "react-custom-scrollbars";
import AppNavbar from "./Layout/AppNavbar";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import Examinations from "./Pages/Examinations";
import Measurements from "./Pages/Measurements";

export default class Main extends Component {
	render() {
		return (
			<React.Fragment>
				<AppNavbar />
				<Scrollbars autohide="true">
					<main role="main" className="mediaPagePadding">
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
		);
	}
}
