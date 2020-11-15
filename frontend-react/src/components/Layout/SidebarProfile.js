import React, { Component } from 'react';
import { observer } from 'mobx-react';
import UserStore from '../../stores/user';

import { Dropdown, NavItem, NavLink } from 'react-bootstrap';

class SidebarProfile extends Component {
    render () {
        return (
            <Dropdown alignRight as={NavItem}>
                <Dropdown.Toggle as={NavLink}>
                    <img
                        className="rounded-circle mr-2"
                        src={UserStore.data ? UserStore.data.image : null}
                        style={{ maxHeight: '32px' }}
                        alt=""
                    />
                    {UserStore.data ? UserStore.data.displayName : null}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item href="/profile">Twój Profil</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => { UserStore.logout() }}>Wyloguj</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown> )
    }
}

export default observer( SidebarProfile )