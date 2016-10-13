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
import CheckmarkIcon from 'grommet/components/icons/base/Checkmark';
import CloseIcon from 'grommet/components/icons/base/Close';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Search from 'grommet/components/Search';
import FilterIcon from 'grommet/components/icons/base/Filter';
import Select from 'react-select';

class TableBookingsPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.state = {
      isMobile: false,
      tableBooking: []
    };

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
  	   	<Heading align="center">
            Event Name
        </Heading>
        <Heading align="center" tag="h3">
            Table Bookings
      	</Heading>
      </Box>
      <Table selectable={false}>
      <thead>
      <tr>
      <th> Name </th>
      <th> Table Type</th>
      <th> Table Name </th>
  	  <th> Date/Time Inquired </th>
      <th> Status </th>
      </tr>
      </thead>
      <tbody>
    {/*this.state.venues.map((result) => (
      <tr key={id}>
      <td> {name} </td>
      <td> {promoter} </td>
      <td> {status} </td>
      <td>
      	<Box justify="center" align="center">
    		{this.guest.status !== 'Approved' ? 
				<Button className={styles.button} label="Approve" icon={<CheckmarkIcon />} onClick={this.testFunc} />
				<Button className={styles.button} label="Decline" icon={<CloseIcon />} onClick={this.testFunc} />
	        : 
		        null
	    	}
      	</Box>
      </td>
      </tr>
      ))*/}
      <tr>
      <td> name </td>
      <td> table type </td>
      <td> table name </td>
      <td> date/time </td>
      <td>
      	<Box justify="center" align="center">
				<Button className={styles.button} label="Approve" icon={<CheckmarkIcon />} onClick={this.testFunc} />
				<Button className={styles.button} label="Decline" icon={<CloseIcon />} onClick={this.testFunc} />
      	</Box>
      </td>
      </tr>
      <tr>
      <td> name </td>
      <td> table type </td>
      <td> table name </td>
      <td> date/time </td>
      <td>
    	<Box justify="center" align="center">
      	Approved
      	</Box>
      </td>
      </tr>
      <tr>
      <td> name </td>
      <td> table type </td>
      <td> table name </td>
      <td> date/time </td>
      <td>
      	<Box justify="center" align="center">
				<Button className={styles.button} label="Approve" icon={<CheckmarkIcon />} onClick={this.testFunc} />
				<Button className={styles.button} label="Decline" icon={<CloseIcon />} onClick={this.testFunc} />
      	</Box>
      </td>
      </tr>
    </tbody>
    </Table>
    </div>
    );
  }
}

TableBookingsPage.contextTypes = {
  router: PropTypes.object.isRequired,
  tableBooking: PropTypes.array
};

export default cssModules(TableBookingsPage, styles);
