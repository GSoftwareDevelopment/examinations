import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react";
import UserStore from "../../stores/user";

import { Dropdown, NavItem } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

class SidebarProfile extends Component {
	render() {
		return (
			<Dropdown alignRight as={NavItem} className="sidebar-profile">
				<Dropdown.Toggle variant="dark" className="noCaret my-0 p-0 shadow-none">
					{UserStore.data && UserStore.data.image ? (
						<img
							className="rounded-circle mr-2"
							src={UserStore.data.image}
							style={{ maxHeight: "32px" }}
							alt=""
						/>
					) : (
						<Icon.PersonFill size="16" className="mr-2" />
					)}
					{UserStore.data ? UserStore.data.displayName : null}
				</Dropdown.Toggle>
				<Dropdown.Menu>
					<Dropdown.Item as={NavLink} to="/profile">
						Twój Profil
					</Dropdown.Item>
					<Dropdown.Divider />
					<Dropdown.Item
						onClick={() => {
							UserStore.logout();
						}}
					>
						Wyloguj
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		);
	}
}

export default observer(SidebarProfile);
