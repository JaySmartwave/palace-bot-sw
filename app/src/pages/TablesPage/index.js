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

  let organisationId =  "5800471acb97300011c68cf7";
  let venueId = "5800889684555e0011585f3c";

  const getAllParams = {
    organisationId: organisationId,
    venueId: venueId,
    tags: 'table'
  };

class TablesPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.state = {
      isMobile: false,
      tables: []
    };
  }
  componentWillMount () {

  }
  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleMobile);
    }
    PartyBot.products.getProducts(getAllParams, function(errors, response, body) {
    console.log("Errors: "+JSON.stringify(errors, null, 2) || null);
    console.log("Response status code: "+response.statusCode || null);
    console.log("Body: "+JSON.stringify(body) || null);
     if(response.statusCode == 200) {
        this.setState({tables: body});
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
      <Heading align='center'> Tables Setup </Heading>
      </Box>
      <Header justify='between'>
      <Heading> </Heading>
      <Menu direction='row' align='center' responsive={false}>
        <Link to={'/tables/add'} activeClassName="active">
          <Button className={styles.addBut} label="Add" icon={<AddIcon />} onClick={this.testFunc} />
        </Link>
      </Menu>
      </Header>
      <Table selectable={false}>
      <thead>
      <tr>
      <th> Type </th>
      <th> Name </th>
      <th> Venue </th>
      <th> Price </th>
      <th> </th>
      </tr>
      </thead>
      <tbody>
      {this.state.tables.map((result) => (
      <tr key={result._id}>
      <td> {result.slug} </td>
      <td> {result.name} </td>
      <td> {result.description} </td>
      <td> {result.price} </td>
      <td>
          <Button label="Edit" icon={<EditIcon />} onClick={this.testFunc} />
      </td>
      </tr>
      ))}
      {/*<tr>
      <td> type </td>
      <td> name </td>
      <td> venue </td>
      <td> price </td>
      <td>
      	<Box justify="center" align="center">
          <Button label="Edit" icon={<EditIcon />} onClick={this.testFunc} />
      	</Box>
      </td>
      </tr>
      <tr>
      <td> type </td>
      <td> name </td>
      <td> venue </td>
      <td> price </td>
      <td>
		<Box justify="center" align="center">
          <Button label="Edit" icon={<EditIcon />} onClick={this.testFunc} />
      	</Box>
      </td>
      </tr>
      <tr>
      <td> type </td>
      <td> name </td>
      <td> venue </td>
      <td> price </td>
      <td>
      	<Box justify="center" align="center">
          <Button label="Edit" icon={<EditIcon />} onClick={this.testFunc} />
      	</Box>
      </td>
      </tr>*/}
    </tbody>
    </Table>
    </div>
    );
  }
}

TablesPage.contextTypes = {
  router: PropTypes.object.isRequired,
  tables: PropTypes.array
};

export default cssModules(TablesPage, styles);
