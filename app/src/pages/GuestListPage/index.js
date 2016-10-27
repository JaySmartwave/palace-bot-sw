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
import CheckBox from 'grommet/components/CheckBox';
import CheckmarkIcon from 'grommet/components/icons/base/Checkmark';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Search from 'grommet/components/Search';
import DocumentCsvIcon from 'grommet/components/icons/base/DocumentCsv';
import ActionsIcon from 'grommet/components/icons/base/Actions';

const FILTER = [ 
    { value: '001', label: 'Approved' }, 
    { value: '002', label: 'Pending' },
  ];
      
const EXAMPLE = [ //test 
    { id: '001', name: 'Oscar', promoter: 'Jolibee', status: 'Pending'}, 
    { id: '002', name: 'BJ', promoter: 'KFC', status: 'Pending'},
    { id: '003', name: 'Jay', promoter: 'Jolibee', status: 'Pending'},
    { id: '004', name: 'David', promoter: 'KFC', status: 'Approved'}, 
    { id: '005', name: 'Barbo', promoter: 'Jolibee', status: 'Pending'},
    { id: '006', name: 'Mendoza', promoter: 'KFC', status: 'Approved'},
  ];

class GuestListPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.checkToggle = this.checkToggle.bind(this);
    this.state = {
      isMobile: false,
      selectedGuest: [],
      guestList: [],
      filter: FILTER,
      example: EXAMPLE, //test
      activeFilter: '', 
      isAllSelected: false
     };

  }
  componentWillMount () {

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
  	console.log(this.state.selectedGuest);
  }

  selectAll(){
    var active = !this.state.isAllSelected;
    this.setState({
      isAllSelected: active,
    });
    // TO DO:
    //add/remove id to/from [selectedGuest]
  }

  checkToggle(){
      console.log(this.prop.id);
      // TO DO:
      // add/remove id to/from [selectedGuest]
  }

  render() {
    const { router, } = this.context;
    const { isMobile, } = this.state;
    return (
      <div className={styles.container}>
      <Box pad={{ vertical: 'medium' }}>
  	   	<Heading align="center">
            Event Name
        </Heading>
        <Heading align="center" tag="h3">
            Guest List
      	</Heading>
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
          <Button className={styles.expBut} label="Export to CSV" icon={<DocumentCsvIcon />} onClick={this.testFunc} />
      </Menu>
      </Header>
      <Table selectable={false}>
      <thead>
      <tr>
      <th> 
        <Box align="center">
          <CheckBox name="label" onChange={this.selectAll} />
        </Box>
      </th>
      <th> Name </th>
      <th> Promoter</th>
      <th> Status </th>
      <th> 
        <Box align="center">
        {this.state.selectedGuest.length > 1 ?
          <Menu icon={<ActionsIcon />} label="Actions">
            <Anchor>
              Accept
            </Anchor>
            <Anchor>
              Decline
            </Anchor>
          </Menu>
        :
          null
        }
        </Box>
      </th>
      </tr>
      </thead>
      <tbody>
    {/*this.state.venues.map((result) => (
      <tr key={id}>
      <td> <CheckBox id="{result.name}" name="label" onChange={...} checked={this.state.isAllSelected} /> </td>
      <td> {name} </td>
      <td> {promoter} </td>
      <td> {status} </td>
      <td>
      	<Box justify="center" align="center">
    		{this.guest.status !== 'Approved' ? 
				<Button label="Approve" icon={<CheckmarkIcon />} onClick={this.testFunc} />
	        : 
		        null
	    	}
      	</Box>
      </td>
      </tr>
      ))*/}
      {this.state.example.map((sample) => (
        <tr key={sample.id}>
        {sample.status === 'Pending' ? 
              <td>
                <Box align="center">
                  <CheckBox id={sample.id} onChange={this.testFunc} checked={this.state.isAllSelected}/>
                </Box>
              </td>
          : 
              <td> </td>
        }
        <td> {sample.name} </td>
        <td> {sample.promoter} </td>
        <td> {sample.status} </td>
        <td>
          <Box justify="center" align="center">
          {sample.status === 'Pending' ? 
          <Button label="Approve" icon={<CheckmarkIcon />} onClick={this.testFunc} />
            : 
              <td> </td>
          }
          </Box>
        </td>
        </tr>
        )) 
      }
    </tbody>
    </Table>
    </div>
    );
  }
}

GuestListPage.contextTypes = {
  router: PropTypes.object.isRequired,
  guestList: PropTypes.array
};

export default cssModules(GuestListPage, styles);
