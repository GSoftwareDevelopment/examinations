import React, { Component } from "react";
import { Dropdown, Button, Badge } from "react-bootstrap";
import "./fab.scss";

export default class FloatingActionButton extends Component {
	render() {
		let prevAction = null;

		return (
			<nav className="fab">
				<Button variant="primary" onClick={this.props.onClick}>
					{this.props.mainActionContent}
				</Button>

				{this.props.dropdown && (
					<Dropdown drop="up">
						<Dropdown.Toggle variant="white" id="dropdown-basic" className="noCaret badge-overlay">
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

const SelectionBadge = (props) => (
	<React.Fragment>
		{props.value > 0 && (
			<Badge pill variant="danger">
				{props.value}
			</Badge>
		)}
	</React.Fragment>
);

export { SelectionBadge };
