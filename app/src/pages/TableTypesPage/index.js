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

  const FILTER = [ //Venue?
    { value: '001', label: 'Venue A' }, 
    { value: '002', label: 'Venue B' },
  ];


class TableTypesPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.state = {
      isMobile: false,
      tables: [],
      filter: FILTER,
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


  componentWillMount () {

  }
  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleMobile);
    }
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
  testFunc() {
  	console.log('test');
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
        <Link to={'/manageTableTypes'} activeClassName="active">
          <Button className={styles.addBut} label="Add" icon={<AddIcon />} onClick={this.testFunc} />
        </Link>
      </Menu>
      </Header>
      <Table selectable={false}>
      <thead>
      <tr>
      <th> Name </th>
      <th> Venue </th>
      <th> Pax </th>
      <th> </th>
      </tr>
      </thead>
      <tbody>
      {/* this.state.tables.map((result) => (
      <tr key={result._id}>
      <td> {result.name} </td>
      <td> {result.venue} </td> //multiple?? 
      <td> {result.pax} </td>
      <td>
          <Button label="Edit" icon={<EditIcon />} onClick={this.testFunc} />
      </td>
      </tr>
      ))*/}
      <tr>
      <td> name </td>
      <td> venue </td>
      <td> pax </td>
      <td>
      	<Box justify="center" align="center">
          <Button label="Edit" icon={<EditIcon />} onClick={this.testFunc} />
      	</Box>
      </td>
      </tr>
      <tr>
      <td> name </td>
      <td> venue </td>
      <td> pax </td>
      <td>
		<Box justify="center" align="center">
          <Button label="Edit" icon={<EditIcon />} onClick={this.testFunc} />
      	</Box>
      </td>
      </tr>
      <tr>
      <td> name </td>
      <td> venue </td>
      <td> pax </td>
      <td>
      	<Box justify="center" align="center">
          <Button label="Edit" icon={<EditIcon />} onClick={this.testFunc} />
      	</Box>
      </td>
      </tr>
    </tbody>
    </Table>
    </div>
    );
  }
}

TableTypesPage.contextTypes = {
  router: PropTypes.object.isRequired,
  tablesTypes: PropTypes.array
};

export default cssModules(TableTypesPage, styles);
