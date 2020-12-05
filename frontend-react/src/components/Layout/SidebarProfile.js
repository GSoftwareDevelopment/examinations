import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react";
import ProfileStore from "../../stores/profile";

import { Dropdown, NavItem } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

class SidebarProfile extends Component {
	render() {
		return (
			<Dropdown alignRight as={NavItem} className="sidebar-profile">
				<Dropdown.Toggle variant="dark" className="noCaret my-0 p-0 shadow-none">
					{ProfileStore.image ? (
						<img
							className="rounded-circle mr-2"
							src={ProfileStore.image}
							style={{ maxHeight: "32px" }}
							alt=""
						/>
					) : (
						<Icon.PersonFill size="16" className="mr-2" />
					)}
					{ProfileStore.displayName}
				</Dropdown.Toggle>
				<Dropdown.Menu>
					<Dropdown.Item as={NavLink} to="/profile">
						Twój Profil
					</Dropdown.Item>
					<Dropdown.Divider />
					<Dropdown.Item
						onClick={() => {
							ProfileStore.logout();
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
