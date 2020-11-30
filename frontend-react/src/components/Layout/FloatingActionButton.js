import React, { Component } from "react";
import { Dropdown, Button } from "react-bootstrap";
import "./fab.scss";

export default class FloatingActionButton extends Component {
	render() {
		let prevAction = null;

		return (
			<nav className="cornerButton">
				<Button
					className="rounded-circle p-2 m-0"
					style={{ transform: "translateX(+5em)", zIndex: 2 }}
					variant="primary"
					onClick={this.props.onClick}
				>
					{this.props.mainActionContent}
				</Button>

				{this.props.dropdown && (
					<Dropdown drop="up">
						<Dropdown.Toggle
							variant="light"
							id="dropdown-basic"
							className={this.props.dropdown.trigger.className}
							style={this.props.dropdown.trigger.style}
						>
							{this.props.dropdown.trigger.content}
						</Dropdown.Toggle>

						<Dropdown.Menu bsPrefix="fab-dropdown bg-dark">
							{this.props.dropdown.header && (
								<Dropdown.Header>{this.props.dropdown.header}</Dropdown.Header>
							)}
							{this.props.dropdown.items.map((item, index) => {
								if (item.disabled) return null;
								if (item.text) {
									prevAction = item.text;
									return (
										<Dropdown.Item key={index} className={item.className} onClick={item.onClick}>
											{item.text}
										</Dropdown.Item>
									);
								} else {
									if (prevAction === null) return null;
									prevAction = null;
									return <Dropdown.Divider key={index} />;
								}
							})}
						</Dropdown.Menu>
					</Dropdown>
				)}
			</nav>
		);
	}
}
