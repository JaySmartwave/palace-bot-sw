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
      <Sidebar size="medium" colorIndex="neutral-1" fixed seperator="right">
        <AppHeader {...this.props} />
        <Menu primary>
          <IndexLink
            to="/home"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            Home
          </IndexLink>
          <Link
            to="geo-spatial"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            Geospatial View
          </Link>
          <Link
            to="key-metrics"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            Key Metrics
          </Link>
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
          <Link
            to="events"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            Events
          </Link>          
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
          <Link
            to="alerts"
            activeClassName="active"
            onClick={() => onToggleNav()}
          >
            Alerts
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
