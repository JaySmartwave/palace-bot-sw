import PartyBot from 'partybot-http-client'; // Bots http client
import React, { PropTypes, Component } from 'react';
import cssModules from 'react-css-modules';
import styles from './index.module.scss';
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
import { Link } from 'react-router'


class TableTypesPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.state = {
      organisationId: '5800471acb97300011c68cf7',
      isMobile: false,
      tableTypes: [],
      filter: [],
      activeFilter: '' 
    };
  }

  onFilterChange(event) {
    let filterId = event.nativeEvent.target.selectedIndex;
    let filterCode = event.nativeEvent.target[filterId].value;
    console.log('Selected Venue: ' + filterCode);
    this.setState({
      activeFilter: filterCode
    }.bind(this));
    console.log(this.state.activeFilter);
  }

  getFilterOptions(){

    return this.state.filter.map(function(filter, i) {
      return (
        <option key={i} value={filter.value}> {filter.label} </option>
        );
    }.bind(this));
  }

  getVenues(options) {
    PartyBot.venues.getAllInOrganisation(options, (errors, response, body) => {
      if(response.statusCode == 200) {
        var venues = [];
        body.map((value, index) => {
          this.setState({ filter: this.state.filter.concat([{value: value._id, label: value.name}]) });
        });
      }
    });
  }

  getTableTypes(options) {
    PartyBot.tableTypes.getTableTypesInOrganisation(options, (errors, response, body) => {
      if(response.statusCode == 200) {
        console.log(body);
        this.setState({ tableTypes: body });
      }
    });
  }
  componentWillMount () {

  }
  componentDidMount() {
    const options = {
      organisationId: this.state.organisationId,
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleMobile);
    }
    this.getVenues(options);
    this.getTableTypes(options);
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
  render() {
    const { router, } = this.context;
    const { isMobile, } = this.state;
    return (
      <div className={styles.container}>
      <Box pad={{ vertical: 'medium' }}>
      <Heading align='center'> Table Types Setup </Heading>
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
        <Link to={'/table-types/add'} activeClassName="active">
          <Button className={styles.addBut} label="Add" icon={<AddIcon />} onClick={() => {}} />
        </Link>
      </Menu>
      </Header>
      <Table selectable={false}>
      <thead>
      <tr>
      <th>Name</th>
      <th>Image</th>
      <th>Venue</th>
      <th>Pax</th>
      <th></th>
      </tr>
      </thead>
      <tbody>
      {this.state.tableTypes.map((result) => (
      <tr key={result._id}>
      <td>{result.name}</td>
      <td><img src={result.image} width="200" /></td>
      <td>VENUES</td>
      <td>{result.no_of_pax}</td>
      <td>
        <Link to={`/table-types/${result._id}`}>
          <Button label="Edit" icon={<EditIcon />} onClick={() => {}} />
        </Link>
      </td>
      </tr>
      ))}
      
    </tbody>
    </Table>
    </div>
    );
  }
}

TableTypesPage.contextTypes = {
  router: PropTypes.object.isRequired,
  tableTypes: PropTypes.array
};

export default cssModules(TableTypesPage, styles);
