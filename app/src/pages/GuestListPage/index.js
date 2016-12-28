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
import Layer from 'grommet/components/Layer';
import Section from 'grommet/components/Section';
import CloseIcon from 'grommet/components/icons/base/Close';
import csv from 'json2csv';
import _ from 'underscore';

const FILTER = [ 
{ value: 'all', label: 'All' }, 
{ value: 'approved', label: 'Approved' }, 
{ value: 'pending', label: 'Pending' },
];

class GuestListPage extends Component {
  constructor(props) {
    super(props);
    this.handleMobile = this.handleMobile.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.checkToggle = this.checkToggle.bind(this);
    this.state = {
      isMobile: false,
      selectedGuest: [],
      guestList: [],
      filter: FILTER,
      activeFilter: 'all', 
      isAllSelected: false,
      displayModal: false,
      modalAction: 'Updating...',
      event_id: props.params.event_id,
      event_date: props.params.event_date,
    };

  }
  componentWillMount () {

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

    let paramsGet = {
      organisationId: '5800471acb97300011c68cf7',
      event_id: this.state.event_id,
      event_date: this.state.event_date
    };

    PartyBot.orders.getOrders(paramsGet, (err, response, body) => {
      if(!err && response.statusCode == 200) {
        this.setState({selectedGuest: body});
      }
    });

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

  onFilterChange = (event) => {
    let filterId = event.nativeEvent.target.selectedIndex;
    let filterCode = event.nativeEvent.target[filterId].value;

    this.setState({
      activeFilter: filterCode
    });
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
    // TO DO:
    // add/remove id to/from [selectedGuest]
  }

  closeSetup = () => {
    this.setState({displayModal: false});
    // this.context.router.push(`/guest-lists/${this.state.event_id}/date/${this.state.event_date}`);
    window.location.reload();
  }

  exportToCSV = () => {
    let filtered = this.state.selectedGuest
    .filter((value) => { 
      if(this.state.activeFilter == 'all') {
        return true;
      } else {
        return this.state.activeFilter == value.status } 
      });

    let mapped = [];
    filtered.map((value, index) => {
      let particulars = _.findWhere(value.particulars, { label: 'party' });
      particulars.value.map((value2, index2) => {
        value.invited = value2;
        mapped.push(_.omit(value, ['particulars', 'order_items']));
      });
    });

    // console.log(data);
    let data = csv({ 
      data: mapped
    });
    window.open('data:text/csv;charset=UTF-8,' + encodeURIComponent(data));
  }

  updateOrderStatus(orderId, status, event) {
    event.preventDefault();
    let params = {
      orderId: orderId,
      status: 'approved'
    };
    this.setState({
      displayModal: true,
      modalAction: "Updating..."
    });
    PartyBot.orders.udpateOrder(params, (error, response, body) => {
      
      if(!error && response.statusCode == 200) {
        this.setState({
          displayModal: true,
          modalAction: "Order approved"
        });
      } else {
        this.setState({
          displayModal: true,
          modalAction: "Update Failed"
        });
      }

    });
  };


  render() {
    const { router, } = this.context;
    const { isMobile, } = this.state;
    return (
      <div className={styles.container}>
        {this.state.displayModal !== false ?
          <Layer align="center">
            <Header>
              {this.state.modalAction}.
            </Header>
            <Section>
              <Button label="Close" onClick={this.closeSetup} plain={true} icon={<CloseIcon />}/>
            </Section>
          </Layer>
          : null
        }
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
            <select name="filter" defaultValue="all"
            onChange={this.onFilterChange}
            className={styles.filSel}>
              {this.getFilterOptions()}
            </select>
          </Heading>
          <Menu direction='row' align='center' responsive={false}>
            <Button className={styles.expBut} label="Export to CSV" icon={<DocumentCsvIcon />} onClick={this.exportToCSV} />
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
              <th>Name</th>
              <th>Promoter</th>
              <th>Status</th>
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
          {this.state.selectedGuest
            .filter((value) => { 
              if(this.state.activeFilter == 'all') {
                return true;
              } else {
                return this.state.activeFilter == value.status } 
              })
            .map((value) =>(
              <tr key={value._id}>
              {value.status === 'pending' ?
                <td>
                <Box align="center">
                  <CheckBox id={value._id} onChange={() => {}} checked={this.state.isAllSelected}/>
                </Box>
                </td>
                : 
                <td></td>
              }
              <td>{value._user_name/*value.order_items.map(item => item.name)*/}</td>
              <td>{value.promoter? value.promoter.name.first+' '+value.promoter.name.last: `N/A`}</td>
              <td>{value.status}</td>
              <td>
                <Box justify="center" align="center">
                  {value.status === 'pending' ?
                  <Button label="Approve" icon={<CheckmarkIcon />} onClick={this.updateOrderStatus.bind(this, value._id, "approved")} />
                  :
                  ""
                  }
                </Box>
              </td>
            </tr>
            )
          )}
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
