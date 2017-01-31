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
import { Link } from 'react-router';

// Pages map directly to Routes, i.e. one page equals on Route

let options = {
  organisationId: '5800471acb97300011c68cf7',
};

class EventsPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isMobile: true,
			events: []
		};

	}
	componentWillMount() { }
	componentDidMount() {
		if (typeof window !== 'undefined') {
			window.addEventListener('resize', this.handleMobile);
			window.addEventListener('onload', this.handleMobile);
		}
		PartyBot.events.getSorted(options, (err, response, body) => {
			if(!err && response.statusCode == 200) {
				this.setState({events: body});
			}
		});
	}
	componentWillUnmount() {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', this.handleMobile);
		}   
	}
	handleMobile = () => {
		let isMobile = window.innerWidth <= 768;
		this.setState({
			isMobile: isMobile
		});
	}
	// handleDesktop = () => {
	// 	console.log(window.innerWidth);
	// 	let isMobile = window.innerWidth >= 768;
	// 	this.setState({
	// 		isMobile,
	// 	});
	// }

	render() {

		const { router, } = this.context;
		const { isMobile, } = this.state;
		return (
			<div className={styles.container}>
			<Box size={{ width: 'large' }} align='center'>
			<Heading
			textAlign='center'
			>
			Events
			</Heading>
			</Box>
			<Table selectable={false}>
			<thead>
			<tr>
			<th>Image</th>
			<th>Description</th>
			<th>Date</th>
			<th></th>
			</tr>
			</thead>
			<tbody>
		{this.state.events.map((result) => {
			let monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
                ];
            let dayNames = [
            	"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
            ];
			let nextDate = new Date(result.next_date);
			return(
			<tr key={result._id}>
			<td> 
			<Box justify="center" align="center">
			<img src={result.image} width="200" alt="" />
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
			{`${nextDate.toDateString()}`}
			</td>
			<td>
			<Box justify="center" align="center">
			<Link to={`/guest-lists/${result._id}/date/${nextDate.getFullYear()}-${nextDate.getMonth()+1}-${nextDate.getDate()}`}>
			<Button className={styles.button} label="Guest List" onClick={() => {}} />
			</Link>
			<br/>
			<Link to={`/table-bookings/${result._id}/date/${nextDate.getFullYear()}-${nextDate.getMonth()+1}-${nextDate.getDate()}`}>
			<Button className={styles.button} label="Table Bookings" onClick={() => {}} />
			</Link>
			</Box>
			</td>
			</tr>
			)})
		}
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
