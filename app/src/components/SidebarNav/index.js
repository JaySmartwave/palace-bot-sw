import React, { PropTypes, Component } from 'react';
import Split from 'grommet/components/Split';
import Sidebar from 'grommet/components/Sidebar';
import Menu from 'grommet/components/Menu';
import { AppHeader } from 'components';
import { Link, IndexLink } from 'react-router';

class SidebarNav extends Component {
  constructor() {
    super();
    this.renderMenu = this.renderMenu.bind(this);
  }
  renderMenu() {
    const {
      onToggleNav,
    } = this.props;
    return (
      <Sidebar size="medium" colorIndex="light-2" fixed separator="right">
        <AppHeader {...this.props} />
        <Menu primary>
          <IndexLink
            to="/dashboards"
            activeClassName="active"
          >
            Dashboard
          </IndexLink>
          <Menu separator="bottom"/>          
          <Link
            to="/venues"
            activeClassName="active"
          >
            Venues
          </Link>
          <Link
            to="/event-schedule"
            activeClassName="active"
          >
            Event Schedule
          </Link>
          <Link
            to="/table-types"
            activeClassName="active"
          >
            Table Types
          </Link>
          <Link
            to="/tables"
            activeClassName="active"
          >
            Tables
          </Link>
          <Link
            to="/tickets"
            activeClassName="active"
          >
            Tickets
          </Link>        
          <Link
            to="/promoters"
            activeClassName="active"
          >
            Promoters
          </Link>
          <Menu separator="bottom"/>
          <Link
            to="/alerts"
            activeClassName="active"
          >
            Alerts
          </Link>
          <Menu separator="bottom"/>
          <Link
            to="/ai-module"
            activeClassName="active"
          >
            AI Module
          </Link>
          <Menu separator="bottom"/>
        </Menu>
      </Sidebar>
    );
  }
  render() {
    const {
      navActive,
      children,
    } = this.props;
    return (
      <Split flex="right" priority={navActive ? 'left' : 'right'}>
        {navActive && this.renderMenu()}
        <main>
          {children}
        </main>
      </Split>
    );
  }
}


SidebarNav.propTypes = {
  children: PropTypes.node.isRequired,
  navActive: PropTypes.bool.isRequired,
  onToggleNav: PropTypes.func.isRequired,
};

export default SidebarNav;
