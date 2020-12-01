import { Nav, Modal, Tab } from 'react-bootstrap';

const ModalTabsButtons = ( props ) => ( <Modal.Header className="py-0">
	<Tab.Container
		activeKey={props.activeTab}
		onSelect={( key ) => { props.onTabSelect( key ) }}>
		<Nav as="nav" variant="tabs" className="tabbable h6 flex-row mt-3"
			style={{ transform: "translateY(1px)" }}>
			{props.tabs.map( tab => (
				<Nav.Item key={"tab-" + tab.name}>
					<Nav.Link eventKey={tab.key}>
						{tab.beforeName}
						{tab.name}
						{tab.afterName}
					</Nav.Link>
				</Nav.Item> ) )}
		</Nav>
	</Tab.Container>
</Modal.Header> );

export { ModalTabsButtons }