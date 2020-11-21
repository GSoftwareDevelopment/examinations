import { observer } from "mobx-react";

import * as Icon from "react-bootstrap-icons";
import { Badge, Button, OverlayTrigger, Popover } from "react-bootstrap";

/**
 * @typedef propsListItem
 * @property {Object} props.item Item object definition
 * @property {string} props.item._id Unique item identificator
 * @property {string} props.item.name item name
 * @property {string} props.item.description Description to item
 * @property {boolean} props.selected
 * @property {boolean} props.selectable
 * @property {string} props.badge
 * @property {function} props.onSelect event for selecting item
 * @property {function} props.onItemDelete
 * @property {function} props.onItemEdit
 * @property {function} props.onItemChoice
 */
/**
 * Single list item
 * @param {zpropsListItem} props Component properties
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
			key={id}
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
			{props.selectable ? (
				<div key={"item-description-" + id} className="form-check">
					<input
						className="form-check-input"
						type="checkbox"
						name="selectedItems"
						onChange={handleChange}
					/>
					<div className="ml-3">
						<div key="item-name">{name}</div>
						{description ? (
							<div key="item-descriptio" className="small text-muted">
								{description}
							</div>
						) : null}
					</div>
				</div>
			) : (
				<div key={"item-description-" + id}>
					<div>{name}</div>
					{description ? (
						<div className="small text-muted">{description}</div>
					) : null}
				</div>
			)}

			{props.badge ? (
				props.badge > 0 ? (
					<Badge key={"item-badge-" + id} variant="info">
						{parseInt(props.badge).toString()}
					</Badge>
				) : (
					<Badge key={"item-badge-" + id} variant="warning">
						Brak badań
					</Badge>
				)
			) : null}

			<nav key={"item-nav-" + id}>
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
