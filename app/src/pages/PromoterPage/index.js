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
import { Link } from 'react-router'

let organisationId = '5800471acb97300011c68cf7';

const getAllParams = {
    organisationId: organisationId
};

class PromoterPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.state = {
      isMobile: false,
      promoters: []
    };

  }
  componentWillMount () {

  }
  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleMobile);
    }
    PartyBot.promoters.getPromoters(getAllParams, function(err, response, body) {
        console.log("Error: "+err);
        console.log("Response: "+response.statusCode || null);
        console.log("Body: "+JSON.stringify(body, null, 2) || null);
       if(response.statusCode == 200) {
          this.setState({promoters: body});
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
  render() {
    const { router, } = this.context;
    const { isMobile, } = this.state;
    return (
      <div className={styles.container}>
      <Box pad={{ vertical: 'medium' }}>
      <Heading align='center'> Promoters Setup </Heading>
      </Box>
      <Header justify='between'>
      <Heading> </Heading>
      <Menu direction='row' align='center' responsive={false}>
        <Link to={'/promoters/add'} activeClassName="active">
          <Button className={styles.addBut} label="Add" icon={<AddIcon />} onClick={() => {}} />
        </Link>
      </Menu>
      </Header>
      <Table selectable={false}>
      <thead>
      <tr>
      <th> Name </th>
      <th> Venue</th>
      <th> Code </th>
      <th> </th>
      </tr>
      </thead>
      <tbody>
    {this.state.promoters.map((result) => (
      <tr key={result._id}>
      <td> {`${result.name.first} ${result.name.last}`} </td>
      <td> {result.image} </td>
      <td> {result.promoter_code} </td>
      <td>
      	<Box justify="center" align="center">
          <Link to={`promoters/${result._id}`}>
            <Button label="Edit" icon={<EditIcon />} onClick={() => {}} />
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

PromoterPage.contextTypes = {
  router: PropTypes.object.isRequired,
  promoters: PropTypes.array
};

export default cssModules(PromoterPage, styles);
