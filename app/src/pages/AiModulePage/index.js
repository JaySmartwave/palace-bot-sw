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
import DocumentCsvIcon from 'grommet/components/icons/base/DocumentCsv';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import { Link } from 'react-router'

class AiModulePage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.state = {
      isMobile: false,
      queries: []
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
      <Heading align='center'> AI Module </Heading>
      </Box>
      <Header justify='between'>
      <Heading> </Heading>
      <Menu direction='row' align='center' responsive={false}>
          <Button className={styles.upCsv} label="Upload CSV" icon={<DocumentCsvIcon />} onClick={this.testFunc} />
      </Menu>
      </Header>
     	<Tabs>
		  <Tab title="Unanswered">
		    <Table selectable={false}>
		      <thead>
		      <tr>
		      <th className={styles.queCol}> Query </th>
		      <th> Frequency</th>
		      <th> </th>
		      </tr>
		      </thead>
		      <tbody>
		    {/*this.state.venues.map((result) => (
		      <tr key={id}>
		      <td className={styles.queCol}> {query} </td>
		      <td> {frequency} </td>
		      <td>
		      	<Box justify="center" align="center">
		          <Button label="Edit Reply" icon={<EditIcon />} onClick={this.testFunc} />
		      	</Box>
		      </td>
		      </tr>
		      ))*/}
		      <tr>
		      <td className={styles.queCol}> Where's the venue? </td>
		      <td> 2 </td>
		      <td>
		      	<Box justify="center" align="center">
		          <Button label="Edit Reply" icon={<EditIcon />} onClick={this.testFunc} />
		      	</Box>
		      </td>
		      </tr>
		      <tr>
		      <td className={styles.queCol}> How much is the ticket? </td>
		      <td> 5 </td>
		      <td>
		      	<Box justify="center" align="center">
		          <Button label="Edit Reply" icon={<EditIcon />} onClick={this.testFunc} />
		      	</Box>
		      </td>
		      </tr>
		    </tbody>
		    </Table>
		  </Tab>
		  {/*
			
			If status is answered:

		  */}
			<Tab title="Answered">
		    <Table selectable={false}>
		      <thead>
		      <tr>
		      <th className={styles.queCol}> Query </th>
		      <th> Frequency</th>
		      <th> </th>
		      </tr>
		      </thead>
		      <tbody>
		    {/*this.state.venues.map((result) => (
		      <tr key={id}>
		      <td className={styles.queCol}> {query} </td>
		      <td> {frequency} </td>
		      <td>
		      	<Box justify="center" align="center">
		          <Button label="Edit Reply" icon={<EditIcon />} onClick={this.testFunc} />
		      	</Box>
		      </td>
		      </tr>
		      ))*/}
		      <tr>
		      <td className={styles.queCol}> How to get there from C5? </td>
		      <td> 6 </td>
		      <td>
		      	<Box justify="center" align="center">
		          <Button label="View Reply" icon={<EditIcon />} onClick={this.testFunc} />
		      	</Box>
		      </td>
		      </tr>
		      <tr>
		      <td className={styles.queCol}> Until when can I buy tickets for Overtime? </td>
		      <td> 5 </td>
		      <td>
		      	<Box justify="center" align="center">
		          <Button label="View Reply" icon={<EditIcon />} onClick={this.testFunc} />
		      	</Box>
		      </td>
		      </tr>
		    </tbody>
		    </Table>
		  </Tab>
		</Tabs>
    </div>
    );
  }
}

AiModulePage.contextTypes = {
  router: PropTypes.object.isRequired,
  queries: PropTypes.array
};

export default cssModules(AiModulePage, styles);
