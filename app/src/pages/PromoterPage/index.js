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
      <Heading align='center'> Promoters Setup </Heading>
      </Box>
      <Header justify='between'>
      <Heading> </Heading>
      <Menu direction='row' align='center' responsive={false}>
        <Link to={'managePromoters'} activeClassName="active">
          <Button className={styles.addBut} label="Add" icon={<AddIcon />} onClick={this.testFunc} />
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
    {/*this.state.venues.map((result) => (
      <tr key={id}>
      <td> {name} </td>
      <td> {venue} </td>
      <td> {code} </td>
      <td>
      	<Box justify="center" align="center">
          <Button label="Edit" icon={<EditIcon />} onClick={this.testFunc} />
      	</Box>
      </td>
      </tr>
      ))*/}
      <tr>
      <td> Pam Lee </td>
      <td> Pool Club </td>
      <td> PAM143 </td>
      <td>
      	<Box justify="center" align="center">
          <Button label="Edit" icon={<EditIcon />} onClick={this.testFunc} />
      	</Box>
      </td>
      </tr>
      <tr>
      <td> Denise Yao </td>
      <td> Valkyrie </td>
      <td> DEN123 </td>
      <td>
      	<Box justify="center" align="center">
          <Button label="Edit" icon={<EditIcon />} onClick={this.testFunc} />
      	</Box>
      </td>
      </tr>
      <tr>
      <td> Ara Adriatico </td>
      <td> Revel </td>
      <td> ARA789 </td>
      <td>
      	<Box justify="center" align="center">
          <Button label="Edit" icon={<EditIcon />} onClick={this.testFunc} />
      	</Box>
      </td>
      </tr>
      <tr>
      <td> Marie Shindo </td>
      <td> Valkyrie </td>
      <td> MAR888 </td>
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

PromoterPage.contextTypes = {
  router: PropTypes.object.isRequired,
  promoters: PropTypes.array
};

export default cssModules(PromoterPage, styles);
