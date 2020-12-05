import React, { Component } from "react";
import ProfileStore from "../../stores/profile";
import "../Layout/custom-file.scss";

import { Form, Col, Row, Button, Nav } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import PageHeader from "../Layout/PageHeader";
import { ListHeader } from "../Layout/ListWithActions";

const UserAvatar = (props) => {
	let image;
	const inputRef = React.createRef();

	if (props.avatar !== "") {
		image = <img src={props.avatar} style={{ maxWidth: "100%", height: "auto" }} alt="" />;
	} else {
		image = <Icon.PersonFill size="100%" />;
	}

	const handleFileSelector = (e) => {
		e.persist();
		inputRef.current.click();
	};

	const handleChangeFile = (e) => {
		if (e.target.files.length) {
			const file = e.target.files[0];
			props.onChange(file);
		}
	};

	return (
		<div className="d-flex flex-column justify-content-center align-items-center">
			<div className="avatar-image">{image}</div>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				name="avatar"
				className="custom-file"
				onChange={handleChangeFile}
			/>
			<Button variant="dark" onClick={handleFileSelector}>
				Zmień...
			</Button>
		</div>
	);
};

const InputField = (props) => {
	return (
		<Form.Group as={Row} controlId={props.controlId} className="align-items-center">
			<Form.Label column sm="4">
				{props.label}
			</Form.Label>
			<Col sm="8">
				<Form.Control
					type={props.type}
					name={props.controlId}
					autoComplete="off"
					disabled={props.disabled || false}
					readOnly={props.readOnly || false}
					value={props.value}
					onChange={props.onChange}
				/>
			</Col>
		</Form.Group>
	);
};

export default class Profile extends Component {
	state = {
		avatarURL: ProfileStore.image || "",
		imageFile: null,
		displayName: ProfileStore.displayName,
		firstName: ProfileStore.firstName,
		lastName: ProfileStore.lastName,
		email: ProfileStore.email,
		isChanged: false,
	};

	handleChangeAvatar = (file) => {
		const img = window.URL.createObjectURL(file);

		this.setState({ avatarURL: img, imageFile: file, isChanged: true });
	};

	handleSubmit = async () => {
		await ProfileStore.fetchUpdate(this.state);
	};

	render() {
		return (
			<div className="container-fluid">
				<PageHeader name="Twój profil" />

				<div className="row">
					<div className="col-sm-4 offset-md-1 col-md-3 mb-2">
						<UserAvatar avatar={this.state.avatarURL} onChange={this.handleChangeAvatar} />
					</div>
					<div className="col-sm-8 col-md-7 col-lg-5">
						<ListHeader columns={["Dane profilu"]} />
						<div className="d-flex flex-column px-3">
							<InputField
								controlId="display-name"
								type="text"
								label="Nazwa wyświetlana"
								value={this.state.displayName}
								onChange={(e) => {
									this.setState({ displayName: e.target.value, isChanged: true });
								}}
							/>
							<InputField
								controlId="first-name"
								type="text"
								label="Imię"
								value={this.state.firstName}
								onChange={(e) => {
									this.setState({ firstName: e.target.value, isChanged: true });
								}}
							/>
							<InputField
								controlId="last-name"
								type="text"
								label="Nazwisko"
								value={this.state.lastName}
								onChange={(e) => {
									this.setState({ lastName: e.target.value, isChanged: true });
								}}
							/>
							<InputField
								controlId="email"
								type="email"
								label="e-mail"
								value={this.state.email}
								readOnly={true}
								onChange={(e) => {
									this.setState({ email: e.target.value, isChanged: true });
								}}
							/>
						</div>
						<Nav className="justify-content-end">
							<Nav.Item>
								<Button
									disabled={!this.state.isChanged}
									variant="primary"
									onClick={this.handleSubmit}
								>
									Zapisz
								</Button>
							</Nav.Item>
						</Nav>
					</div>
				</div>
			</div>
		);
	}
}
