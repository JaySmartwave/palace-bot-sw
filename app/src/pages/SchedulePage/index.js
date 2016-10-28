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
import { Link } from 'react-router';
import moment from 'moment';

let options = {
  organisationId: '5800471acb97300011c68cf7',
};
let venueId = '57f4681dbb6c3c23633eecc2';

class SchedulePage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.state = {
      isMobile: false,
      events: []
    };

  }
  componentWillMount () {

  }
  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleMobile);
    }
     
  // Get All Events In Venue In Organisation 
  PartyBot.events.getEventsInOrganisation(options, function(err, response, body) {
      console.log('Error: ' + err);
      console.log('Status Code: ' + response.statusCode);
      console.log(body);
      if(!err && response.statusCode == 200) {
        this.setState({events: body});
      }
    }.bind(this));

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
      <Heading align='center'> Event Schedule </Heading>
      </Box>
      <Header justify='between'>
      <Heading> </Heading>
      <Menu direction='row' align='center' responsive={false}>
        <Link to={'/events/add'}>
          <Button className={styles.addBut} label="Add" icon={<AddIcon />} onClick={this.testFunc} />
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
      {this.state.events.map((result) => (
        <tr key={result._id}>
        <td>{result.name}</td>
        <td><img src={result.image} width="200" /></td>
        <td>{result.description}</td>
        <td>{moment('10/17/2016', 'MM/DD/YYYY').format('dddd, MM/DD/YYYY')}</td>
        <td>
        	<Box justify="center" align="center">
            <Button className={styles.button} label="Edit Event" icon={<EditIcon />} onClick={this.testFunc} />
            <Link to={'editTables'} activeClassName="active">
            <Button className={styles.button} label="Edit Tables" icon={<EditIcon />} onClick={this.testFunc} />
            </Link>
        	</Box>
        </td>
        </tr>
      ))}
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
