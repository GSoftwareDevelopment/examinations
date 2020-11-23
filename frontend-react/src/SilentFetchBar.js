import { observer } from "mobx-react";
import "./progressbar.scss";

import ExaminationsStore from "./stores/examinations";
import GroupsStore from "./stores/groups";
import ValuesStore from "./stores/values";

const SilentFetchBar = observer(() => {
	if ([ExaminationsStore, GroupsStore, ValuesStore].find((store) => store.state === "pending"))
		return (
			<div className="progress bg-secondary custom-progress">
				<div className="indeterminate"></div>
			</div>
		);
	else return null;
});

export default SilentFetchBar;
