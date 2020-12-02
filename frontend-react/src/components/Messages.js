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
		content={
			<div className="mt-4 jumbotron d-flex flex-column align-items-center">
				<Icon.InfoSquare size="64" className="mb-3" />
				<p>
					Wybierz element z <strong>Listy grup</strong>, aby zobaczyć badania przypisane do tej
					grupy.
				</p>
			</div>
		}
	/>
);

export const messageNoValuesDefinitions = (
	<InfoBox
		content={
			<div className="jumbotron d-flex flex-column align-items-center mb-0">
				<Icon.EmojiDizzy size="64" className="mb-3" />
				<p>Brak definicji wartości określających badanie.</p>
			</div>
		}
	/>
);
