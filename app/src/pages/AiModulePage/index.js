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
    this.state = {
    	organisationId: '5800471acb97300011c68cf7',
    	isMobile: false,
      filter: [],
    	answered: [],
    	unanswered: [],
      page:1,
      limit:25
    };

  }
  componentWillMount () {

  }
  componentDidMount() {
  	
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleMobile);
    }
    let getQueriesParams = {
      organisationId: this.state.organisationId,
      page: this.state.page,
      limit: this.state.limit
    }
    this.getQueries(getQueriesParams);
    this.getVenues(this.state)
  }
  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleMobile);
    }    
  }
  handleMobile = () => {
    const isMobile = window.innerWidth <= 768;
    this.setState({
      isMobile,
    });
  }
  
  getQueries = (options) => {
    this.setState({ unanswered: [], answered: [] });
    PartyBot.queries.getQueryPerOrganisation(options, (err, res, body) => {
      body.queries.filter( (value) => {
        if(typeof value.reply === 'undefined' || value.reply == '') {
          this.setState({unanswered: this.state.unanswered.concat(value)});
        } else {
          this.setState({answered: this.state.answered.concat(value)});
        }
      });
    });
  }

  getVenues = (options) => {
    PartyBot.venues.getAllInOrganisation(options, (errors, response, body) => {
      if(response.statusCode == 200) {
        var venues = [];
        body.map((value, index) => {
          this.setState({ filter: this.state.filter.concat([{value: value._id, label: value.name}]) });
        });
      }
    });
  }
  
  getFilterOptions = () => {

    return this.state.filter.map((filter, i) => {
      return (
        <option key={i} value={filter.value}> {filter.label} </option>
        );
    });
  }

  onFilterChange = (event) => {
    let venue = event.target.value;
    console.log(venue);
    let options = {
      organisationId: this.state.organisationId,
      venueId: venue
    };

    this.getQueries(options);

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
      <Heading>
      <select name="filter"
          onChange={this.onFilterChange}
          className={styles.filSel}>
          {this.getFilterOptions()}
        </select>
      </Heading>
      <Menu direction='row' align='center' responsive={false}>
          <Button className={styles.upCsv} label="Upload CSV" icon={<DocumentCsvIcon />} onClick={() => {}} />
      </Menu>
      </Header>
     	<Tabs>
		  <Tab title="Unanswered">
		    <Table selectable={false}>
		      <thead>
		      <tr>
		      <th className={styles.queCol}>Query</th>
          <th>Venue</th>
		      <th></th>
		      </tr>
		      </thead>
		      <tbody>
		      {
		      	this.state.unanswered.map((result) => (
		      		<tr key={result._id}>
		      			<td className={styles.queCol}>{result.entity.join(', ')}</td>
                <td>{(result.venue_id != null)? result.venue_id.name : `The Palace`}</td>
		      			<td>
		      			<Box justify="center" align="center">
                  <Link to={'/ai-module/'+result._id}>
		      				  <Button label="Edit Reply" icon={<EditIcon />} onClick={() => {}} />
                  </Link>
		      			</Box>
		      			</td>
		      		</tr>
		      		))
		      }
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
		      <th className={styles.queCol}>Query</th>
		      <th></th>
		      </tr>
		      </thead>
		      <tbody>
		      {
		      	this.state.answered.map((result) => (
		      		<tr key={result._id}>
		      			<td className={styles.queCol}>{result.entity.join(', ')}</td>
		      			<td>
		      			<Box justify="center" align="center">
                  <Link to={'/ai-module/'+result._id}>
		      				  <Button label="Edit Reply" icon={<EditIcon />} onClick={function() { return; }} />
                  </Link>
		      			</Box>
		      			</td>
		      		</tr>
		      		))
		      }
		    </tbody>
		    </Table>
		  </Tab>
		</Tabs>
    <div>
      Do Paginate here
    </div>
    </div>
    );
  }
}

AiModulePage.contextTypes = {
  router: PropTypes.object.isRequired,
  queries: PropTypes.array
};

export default cssModules(AiModulePage, styles);
