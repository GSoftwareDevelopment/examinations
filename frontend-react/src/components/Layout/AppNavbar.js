import React, { Component } from 'react';

import { observer } from 'mobx-react';

import { Nav, Navbar } from 'react-bootstrap';
import SidebarProfile from './SidebarProfile';

class AppNavbar extends Component {
	render () {
		return (
			<Navbar fixed="top" variant="dark" bg="dark" expand="sm">
				<Navbar.Brand href="#home">Dziennik Badań</Navbar.Brand>
				<Navbar.Toggle aria-controls="navbar-menu" />
				<Navbar.Collapse id="navbar-menu">
					<Nav>
						<Nav.Link eventKey="page-dashboard" href="/dashboard">Pulpit</Nav.Link>
						<Nav.Link eventKey="page-examinations" href="/examinations">Badania</Nav.Link>
						<Nav.Link eventKey="page-measurements" href="/measurements">Pomiary</Nav.Link>
					</Nav>
					<Nav className="ml-auto">
						<SidebarProfile />
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		)
	}
}

export default observer( AppNavbar )