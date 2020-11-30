import * as Icon from "react-bootstrap-icons";
import InfoBox from "./Layout/InfoBox";

export const messagesNoElements = <InfoBox content={<div>Brak elementów</div>} />;

export const messageNoExaminationsAndGroups = (
	<InfoBox
		key={`info-noItems`}
		icon={null}
		content={<div>Brak zdefiniowanych badań i grup.</div>}
	/>
);

export const messageGroupHasntExaminations = (
	<InfoBox key={`info-emptyGroup`} icon={null} content={<div>Ta grupa nie posiada badań</div>} />
);

export const messageChoiceGroup = (
	<InfoBox
		icon={<Icon.InfoSquare size="64" />}
		content={
			<div className="mt-4">
				Wybierz element z <strong>Listy grup</strong>, aby zobaczyć badania przypisane do tej grupy.
			</div>
		}
	/>
);

export const messageNoValuesDefinitions = (
	<InfoBox
		icon={<Icon.EmojiDizzy size="64" />}
		content={<div>Brak definicji wartości określających badanie.</div>}
	/>
);
