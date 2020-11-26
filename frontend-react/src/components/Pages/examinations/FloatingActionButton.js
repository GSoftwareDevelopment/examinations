import React, { Component } from "react";
import { Dropdown, Button } from "react-bootstrap";

export default class FloatingActionButton extends Component {
	render() {
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

						<Dropdown.Menu>
							{this.props.dropdown.header && (
								<Dropdown.Header>{this.props.dropdown.header}</Dropdown.Header>
							)}
							{this.props.dropdown.items.map((item, index) => {
								if (item) {
									return (
										<Dropdown.Item
											key={index}
											className={item.className}
											disabled={item.disabled}
											onClick={() => {
												item.onClick();
											}}
										>
											{item.icon} {item.text}
										</Dropdown.Item>
									);
								} else {
									return <Dropdown.Divider />;
								}
							})}
						</Dropdown.Menu>
					</Dropdown>
				)}
			</nav>
		);
	}
}
