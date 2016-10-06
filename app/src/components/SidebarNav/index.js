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
          {/*<IndexLink
            to="/home"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            Home
          </IndexLink>
          <Link
            to="data"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            Data
          </Link>
          <Link
            to="about"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            About
          </Link>
          <Menu separator="bottom"/>*/}
          <IndexLink
            to="home"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            Events
          </IndexLink>
          <Menu separator="bottom"/>          
          <Link
            to="venues"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            Venues
          </Link>
          <Link
            to="tables"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            Tables
          </Link>
          <Link
            to="schedules"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            Event Schedule
          </Link>          
          <Link
            to="promoters"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            Promoters
          </Link>
          <Menu separator="bottom"/>
          <Link
            to="alerts"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            Alerts
          </Link>
          <Menu separator="bottom"/>
          <Link
            to="manageVenues"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            Add/Edit Venues
          </Link>
          <Link
            to="manageTables"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            Add/Edit Tables
          </Link>
          <Link
            to="manageEvents"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            Add/Edit Events
          </Link>
          <Link
            to="managePromoters"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            Add/Edit Promoters
          </Link>
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
