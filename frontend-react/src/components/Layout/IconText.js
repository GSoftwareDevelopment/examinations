import React from "react";
import { Badge } from "react-bootstrap";

export const IconText = (props) => (
	<span>
		<span className="mx-2">{props.icon}</span>
		{props.text}
	</span>
);

export const IconTextBadge = (props) => {
	const isBadge = props.badge;
	return (
		<React.Fragment>
			<IconText icon={props.icon} text={props.text} />
			{isBadge && (
				<Badge pill variant="danger" className="px-2 mx-2">
					{props.badge}
				</Badge>
			)}
		</React.Fragment>
	);
};
