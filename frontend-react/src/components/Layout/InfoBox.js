import React from "react";

const InfoBox = (props) => {
	if (props.content !== null)
		return (
			<div className={props.className ? props.className : "text-center py-3"}>
				{props.icon}
				{props.content}
			</div>
		);
	else return null;
};

export default InfoBox;
