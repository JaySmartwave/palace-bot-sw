import PartyBot from 'partybot-http-client'; // Bots http client
import React, { PropTypes, Component } from 'react';
import cssModules from 'react-css-modules';
import styles from './index.module.scss';
import { MONTHS } from './constants.js';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Anchor from 'grommet/components/Anchor';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
import Menu from 'grommet/components/Menu';
import Image from 'grommet/components/Image';
import EditIcon from 'grommet/components/icons/base/Edit';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Search from 'grommet/components/Search';
import AddIcon from 'grommet/components/icons/base/Add';
import Select from 'react-select';
import { Link } from 'react-router';
import moment from 'moment';
class SchedulePage extends Component {
  
  constructor(props) {
    super(props);
    this.handleMobile = this.handleMobile.bind(this);
    this.state = {
      organisationId: '5800471acb97300011c68cf7',
      isMobile: false,
      filter: [ { value: 'all', label: 'All' }],
      events: [],
      page:1,
      limit: 25
    };

  }
  componentWillMount () {

  }
  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleMobile);
    } 
    // Get All Events In Venue In Organisation 
    let options = {
      organisationId: this.state.organisationId
    };

    this.getEvents(options);
    this.getVenues(options);
  }
  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleMobile);
    }    
  }

  handleMobile() {
    const isMobile = window.innerWidth <= 768;
    this.setState({
      isMobile,
    });
  }
  
  // getEvents = (options) => {
  //   PartyBot.events.getEventsInOrganisation(options, (err, response, body) => {
  //     if(!err && response.statusCode == 200) {
  //       this.setState({events: body});
  //     }
  //   });
  // }

  getEvents = (options) => {
    PartyBot.events.getSorted(options, (err, response, body) => {
      if(!err && response.statusCode == 200) {
        this.setState({events: body});
      }
    });
  }

  getFilterOptions = () => {

    return this.state.filter.map((filter, i) => {
      return (
        <option key={i} value={filter.value}> {filter.label} </option>
        );
    });
  }

  getVenues = (options) => {
    PartyBot.venues.getAllInOrganisation(options, (errors, response, body) => {
      if(response.statusCode == 200) {
        var venues = [];
        body.map((value, index) => {
          this.setState({ filter: this.state.filter.concat([{value: value._id, label: value.name}]) });
        });
      }
    });
  }

  onFilterChange = (event) => {
    let venue = event.target.value;
    let options = {};
    (venue === 'all') ? options = { organisationId: this.state.organisationId } 
      : options = {
        organisationId: this.state.organisationId,
        venue_id: venue
      }

    this.getEvents(options);
  }

  render() {
    const { router, } = this.context;
    const { isMobile, } = this.state;
    return (
      <div className={styles.container}>
      <Box size={{ width: 'large' }} align='center'>
        <Heading align='center'> Event Schedule </Heading>
      </Box>
      <Header justify='between'>
      <Heading>
        <select name="filter"
          onChange={this.onFilterChange}
          className={styles.filSel}>
          {this.getFilterOptions()}
        </select>
      </Heading>
      <Menu direction='row' align='center' responsive={false}>
        <Link to={'/event-schedule/add'}>
          <Button className={styles.addBut} label="Add" icon={<AddIcon />} onClick={function(){}} />
        </Link>
      </Menu>
      </Header>
      <Table selectable={false}>
      <thead>
      <tr>
      <th>Name</th>
      <th>Image</th>
      <th>Venue</th>
      <th>Date</th>
      <th></th>
      </tr>
      </thead>
      <tbody>
      {this.state.events.map((result) => {
        var date = new Date(result.next_date);
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return (
          <tr key={result._id}>
            <td>{result.name}</td>
            <td><img src={result.image} width="200" /></td>
            <td>{result._venue_id.name}</td>
            <td>{`${MONTHS[monthIndex]} ${day} ${year}`}</td>
            <td>
              <Box justify="center" align="center">
                <Link to={`/event-schedule/${result._id}`} activeClassName="active">
                  <Button className={styles.button} label="Edit Event" icon={<EditIcon />} onClick={() => {}} />
                </Link>
                <Link to={'editTables'} activeClassName="active">
                  <Button className={styles.button} label="Edit Tables" icon={<EditIcon />} onClick={() => {}} />
                </Link>
              </Box>
            </td>
        </tr>
        )
      })}
    </tbody>
    </Table>
    </div>
    );
  }
}

SchedulePage.contextTypes = {
  router: PropTypes.object.isRequired,
  schedule: PropTypes.array
};


export default cssModules(SchedulePage, styles);
