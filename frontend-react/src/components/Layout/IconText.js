import React from "react";
import { Badge } from "react-bootstrap";

export const IconText = (props) => (
	<span>
		{props.icon} <span>{props.text}</span>
	</span>
);

export const IconTextBadge = (props) => {
	const isBadge = props.badge;
	return (
		<React.Fragment>
			<IconText icon={props.icon} text={props.text} />
			{isBadge && (
				<Badge pill variant="danger">
					{props.badge}
				</Badge>
			)}
		</React.Fragment>
	);
};
