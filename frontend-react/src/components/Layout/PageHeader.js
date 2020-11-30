import React from "react";

export default function PageHeader(props) {
	return (
		<div className="mx-3 d-flex flex-row justify-content-between align-items-center border-bottom mb-2">
			<h4>{props.name}</h4>
		</div>
	);
}
