import React from "react";

export default function PageHeader(props) {
	return (
		<div className="pageHeader">
			<h4 className="my-0">{props.name}</h4>
		</div>
	);
}
