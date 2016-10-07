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
import FilterIcon from 'grommet/components/icons/base/Filter';
import Select from 'react-select';

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
    // Naka Set timeout lang muna to kasi may error  yung API ni sir JC nung ginagawa ko
    // setTimeout(function() {
    //   this.setState({venues: [ 
    //   { _id: 1, name: "Jeirene", slug: "jeirene"},
    //   { _id: 2, name: "Jay", slug: "jay"},
    //   { _id: 3, name: "Oscar", slug: "pogi"},
    //   { _id: 4, name: "Pepe", slug: "ngwasak"}
    //   ] });
    // }.bind(this), 3000); // Importante yung .bind(this) sa callback function para may access ng callback sa this ng current scope

    // Yung '57f3a270f760e4f8ad97eec4' organisationId id sya.. Dalihin niyo nalang sa route para makuha yung id

    PartyBot.venues.getAllInOrganisation('57f3a270f760e4f8ad97eec4', function(err, response, body) {
      console.log('Error: ' + err);
      console.log('Status Code: ' + response.statusCode);      
      console.log(body);
      if(!err && response.statusCode == 200) {
        this.setState({venues: body.venues});
      }
      
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
      <Menu icon={<FilterIcon />} label='Filter'>
      <Anchor href='#' className='active'>   
      First action
      </Anchor>
      <Anchor href='#'>
      Second action
      </Anchor>
      <Anchor href='#'>
      Third action
      </Anchor>
      </Menu>
      <Menu direction='row' align='center' responsive={false}>
      <Search dropAlign={{'right': 'right'}} />
      </Menu>
      </Header>
      <Table selectable={false}>
      <thead>
      <tr>
      <th> Venue Name </th>
      <th> Picture </th>
      <th> Address </th>
      <th> </th>
      </tr>
      </thead>
      <tbody>
    {/* Kailangan ng key sa mga repeating elements.. like <li>, <ol>, <tr>, <dd> ..etc*/}
    {this.state.venues.map((result) => (
      <tr key={result._id}>
      <td> {result.name} </td>
      <td> Some Image </td>
      <td> {result.slug} </td>
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
