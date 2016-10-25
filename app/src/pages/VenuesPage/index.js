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

let options = {
  organisationId: '5800471acb97300011c68cf7',
};
class VenuesPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.state = {
      isMobile: false,
      venues: []
    };

  }
  componentWillMount () {
    console.log(options);
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleMobile);
    }
    PartyBot.venues.getAllInOrganisation(options, function(err, response, body) {
      console.log('Error: ' + err);
      console.log('Status Code: ' + response.statusCode);      
      console.log(body);
      if(!err && response.statusCode == 200) {
        this.setState({venues: body});
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
      <Heading align='center'> Venues Setup </Heading>
      </Box>
      <Header justify='between'>
      <Heading> </Heading>
      <Menu direction='row' align='center' responsive={false}>
      <Link to={'/venues/add'} activeClassName="active">
      <Button className={styles.addBut} label="Add" icon={<AddIcon />} onClick={this.testFunc} />
      </Link>
      </Menu>
      </Header>
      <Table selectable={false}>
      <thead>
      <tr>
      <th>Name</th>
      <th>Image</th>
      <th>Address</th>
      <th></th>
      </tr>
      </thead>
      <tbody>
    {/* Kailangan ng key sa mga repeating elements.. like <li>, <ol>, <tr>, <dd> ..etc*/}
    {this.state.venues.map((venueData, i) => (
      <tr key={i}>
      <td>{venueData.name}</td>
      <td><img src={venueData.image} width="200" /></td>
      <td></td>
      <td>
      <Box justify="center" align="center">
      <Link to={'manageVenues/' + venueData._id} activeClassName="active">
      <Button label="Edit" icon={<EditIcon />} onClick={this.testFunc} />
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

VenuesPage.contextTypes = {
  router: PropTypes.object.isRequired,
  venues: PropTypes.array
};
export default cssModules(VenuesPage, styles);
