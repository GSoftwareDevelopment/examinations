import React from "react";
import { Badge } from "react-bootstrap";

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
