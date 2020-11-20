import { observer } from "mobx-react";

import * as Icon from "react-bootstrap-icons";
import { Badge, Button, OverlayTrigger, Popover } from "react-bootstrap";

/**
 * Single entry of examination
 * @param {Object} props Component properties
 * @param {Object} props.item Examination object definition
 * @param {string} props.item._id Unique examination identificator
 * @param {string} props.item.name Examination name
 * @param {string} props.item.description Description to examination
 * @param {function} props.onSelect event for selecting item
 */
const ListItem = observer((props) => {
	const { _id: id, name, description } = props.item;

	const handleChange = (e) => {
		props.onSelect({ id, state: e.target.checked });
	};

	const ConfirmDelete = (onConfirm) => {
		return (
			<Popover id="popover-basic">
				<Popover.Title as="h3">Potwierdź operację</Popover.Title>
				<Popover.Content>
					<Button
						block
						variant="danger"
						size="sm"
						onClick={() => {
							onConfirm();
						}}
					>
						USUŃ
					</Button>
				</Popover.Content>
			</Popover>
		);
	};

	return (
		<div
			className={
				"row-item px-3 d-flex flex-row justify-content-between align-items-center" +
				(props.choiced === true ? " bg-dark text-white" : "")
			}
			style={{ cursor: props.onChoiceItem ? "pointer" : "default" }}
			onClick={
				props.onChoiceItem
					? () => {
							props.onChoiceItem(id);
					  }
					: null
			}
		>
			<div className="form-check">
				{props.selection && (
					<input
						className="form-check-input"
						type="checkbox"
						name="selectedItems"
						onChange={handleChange}
					/>
				)}
				<div className="ml-3">
					<div>{name}</div>
					{description ? (
						<div className="small text-muted">{description}</div>
					) : null}
				</div>
			</div>
			<div className="d-flex flex-row justify-content-end ml-auto"></div>
			{props.badge ? (
				props.badge > 0 ? (
					<Badge variant="info">{parseInt(props.badge).toString()}</Badge>
				) : (
					<Badge variant="warning">Brak badań</Badge>
				)
			) : null}
			<nav>
				{props.onClickEdit && (
					<Button
						variant="light"
						size="sm"
						className="p-2"
						onClick={(e) => {
							e.stopPropagation();
							props.onClickEdit(id);
						}}
					>
						<Icon.PencilSquare size="20" />
					</Button>
				)}
				{props.onClickDelete && (
					<OverlayTrigger
						trigger="click"
						overlay={ConfirmDelete(() => {
							props.onClickDelete(id);
						})}
						placement="left"
						rootClose
					>
						<Button variant="light" size="sm" className="p-2">
							<Icon.Trash size="20" />
						</Button>
					</OverlayTrigger>
				)}
			</nav>
		</div>
	);
});

export default ListItem;
