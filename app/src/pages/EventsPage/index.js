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
import { Link } from 'react-router'

// Pages map directly to Routes, i.e. one page equals on Route

let organisationId = '57f3a273f760e4f8ad97eec5',
venueId = '57ff3b8dd46ae000116c4d49';

class EventsPage extends Component {

	constructor() {
		super();
		this.handleMobile = this.handleMobile.bind(this);
		this.state = {
			isMobile: false,
			events: []
		};

	}
	componentWillMount() {

		PartyBot.events.getAllEventsInVenueInOrganisation({
			organisationId: organisationId,
			venueId: venueId
		}, function(err, response, body) {
			console.log('Error: ' + err);
			console.log('Status Code: ' + response.statusCode);
			console.log(body);
			if(!err && response.statusCode == 200) {
				this.setState({events: body});
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
			<Heading align='center'> Events </Heading>
			</Box>
			<Table selectable={false}>
			<thead>
			<tr>
			<th> </th>
			<th> </th>
			<th> </th>
			</tr>
			</thead>
			<tbody>
		{/* Kailangan ng key sa mga repeating elements.. like <li>, <ol>, <tr>, <dd> ..etc*/}
		{this.state.events.map((result) => (
			<tr key={result._id}>
			<td> 
			<Box justify="center" align="center">
			<img src="http://place-hold.it/240/1E90FF/ffffff&text=Placeholder&fontsize=28" height="200" alt="Smiley face" />
			</Box>
			</td>
			<td>
			<Box justify="center" align="center">
			<Heading align='center' tag="h3"> {result.name} </Heading>
			{result.description} 
			<br/>
			{result.slug}
			</Box> 
			</td>
			<td>
			<Box justify="center" align="center">
			<Link to={'guestList'}>
			<Button className={styles.button} label="Guest List" onClick={this.testFunc} />
			</Link>
			<br/>
			<Link to={'tableBookings'}>
			<Button className={styles.button} label="Table Bookings" onClick={this.testFunc} />
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
EventsPage.contextTypes = {
	router: PropTypes.object.isRequired,
	events: PropTypes.array
};

export default cssModules(EventsPage, styles);
