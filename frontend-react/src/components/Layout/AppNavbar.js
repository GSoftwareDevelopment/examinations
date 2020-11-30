import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Media from "react-media";
import "./AppNavbar.scss";

import { observer } from "mobx-react";

import * as Icon from "react-bootstrap-icons";
import { Nav, Navbar } from "react-bootstrap";
import SidebarProfile from "./SidebarProfile";
import SilentFetchBar from "./SilentFetchBar.js";

const MainNavigation = () => (
	<React.Fragment>
		<Nav.Link as={NavLink} key="page-dashboard" to="/dashboard">
			<Icon.HouseFill /> Pulpit
		</Nav.Link>
		<Nav.Link as={NavLink} key="page-examinations" to="/examinations">
			<Icon.ListNested /> Badania
		</Nav.Link>
		<Nav.Link as={NavLink} key="page-measurements" to="/measurements">
			<Icon.Thermometer /> Pomiary
		</Nav.Link>
	</React.Fragment>
);

class AppNavbar extends Component {
	render() {
		return (
			<React.Fragment>
				<Navbar fixed="top" variant="dark" bg="dark" expand="sm" className="p-0 flex-column">
					<div className="w-100 px-2">
						<Navbar.Brand href="#home">Dziennik Badań</Navbar.Brand>
						<Navbar.Toggle aria-controls="navbar-menu" className="float-right" />
						<Navbar.Collapse id="navbar-menu">
							<Media queries={{ small: { maxWidth: 575 } }}>
								{(matches) =>
									!matches.small ? (
										<Nav variant="tabs" className="w-100 tabs-dark">
											<MainNavigation />
											<SidebarProfile />
										</Nav>
									) : (
										<Nav variant="" className="w-100">
											<MainNavigation />
											<SidebarProfile />
										</Nav>
									)
								}
							</Media>
						</Navbar.Collapse>
					</div>
					<SilentFetchBar />
				</Navbar>
			</React.Fragment>
		);
	}
}

export default observer(AppNavbar);
