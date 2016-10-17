import PartyBot from 'partybot-http-client'; // Bots http client
import __ from 'underscore';
import React, { PropTypes, Component } from 'react';
import cssModules from 'react-css-modules';
import styles from './index.module.scss';
import Heading from 'grommet/components/Heading';
import Box from 'grommet/components/Box';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import FormFields from 'grommet/components/FormFields';

const EVENTS = [ 
    { value: '001', label: 'Girls Just Wanna Have Fun' }, 
    { value: '002', label: 'Overtime' },
    { value: '003', label: 'Kate Mess'},
    { value: '004', label: 'Game On'},
    ];
let organisationId =  "5800471acb97300011c68cf7";
let venueId = "5800889684555e0011585f3c";

class ManageTicketsPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.getEventOptions = this.getEventOptions.bind(this);
    this.onEventChange = this.onEventChange.bind(this);
    this.setName = this.setName.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setUrl = this.setUrl.bind(this);
    this.submitSave = this.submitSave.bind(this);
    this.submitCreate = this.submitCreate.bind(this);
    this.state = {
      isMobile: false,
      events: EVENTS,
      ticketId: null, // id mock test
      name: '',
      description: '',
      ticket_url: '',
      selectedEvent: '',
      tags: 'ticket',
      organisationId: organisationId,
      venueId: venueId
    };
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

  testFunc() { // TEST functions here
    console.log("test");
  }

  getEventOptions(){
    return EVENTS.map(function (item) {
      return <option key={item.value} value={item.value}> {item.label} </option>;
    }.bind(this));
  }

  onEventChange(event) {
    let eventId = event.nativeEvent.target.selectedIndex;
    let eventCode = event.nativeEvent.target[eventId].value;
    console.log('Selected Venue: ' + eventCode);
    this.setState({
      selectedEvent: eventCode
    });
  }

  setName(event) {
    this.setState({name: event.target.value});
  }
  setDescription(event) {
    this.setState({description: event.target.value});
  }
  setUrl(event) {
    this.setState({ticket_url: event.target.value});
  }
  submitSave() {
    console.log('Ticket Updated!');
  }
  submitCreate() {
    let cl = console.log;
    let params = _.pick(this.state, ['name', 'description', 'ticket_url', 'venueId', 'organisationId']);
    // console.log(params);
    PartyBot.products.create(params, function(errors, response, body) {
      cl("Errors: "+JSON.stringify(errors, null, 2) || null);
      cl("Response status code: "+response.statusCode || null);
      cl("Body: "+JSON.stringify(body) || null);
    });
  }
  render() {
    const {
      router,
    } = this.context;
    const {
      isMobile,
    } = this.state;
    const {
      files,
      selectedVenue
    } = this.state;
    return (
      <div className={styles.container}>
      <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css" />
      <Box pad={{ vertical: 'medium' }}>
      {this.state.ticketId !== null ? 
       <Heading align="center">
       Edit Ticket
       </Heading>
       : 
       <Heading align="center">
       Add Ticket
       </Heading>
     }
     </Box>
     <Box direction="row" justify="center" align="center" wrap={true} pad="small	" margin="small">
     <Form onSubmit={this.submitSave}>
     <FormFields>
     <fieldset>
      {/*<Box separator="all">
      <FormField label="Event" htmlFor="ticketEvent" />
      <select
        name="ticketEvent"
        onChange={this.onEventChange}
      >
      	{this.getEventOptions()}
      </select>
      </Box> */}
	     <FormField label="Name" htmlFor="ticketName">
	     <input id="ticketName" type="text" onChange={this.setName}/>
	     </FormField>
	     <FormField label="Description" htmlFor="ticketDesc">
	     <input id="ticketDescription" type="text" onChange={this.setDescription}/>
	     </FormField>
	     <FormField label="URL" htmlFor="ticketUrl">
	     <input id="ticketUrl" type="text" onChange={this.setUrl}/>
	     </FormField>
       </fieldset>
       </FormFields>
       <Footer pad={{"vertical": "medium"}}>
       {this.state.ticketId !== null ? 
         <Heading align="center">
         <Button label="Save Changes" primary={true} onClick={this.submitSave} />
         </Heading>
         : 
         <Heading align="center">
         <Button label="Create Ticket" primary={true} onClick={this.submitCreate} />
         </Heading>
       }
       </Footer>
       </Form>
       </Box>
       </div>
       );
  }
}

ManageTicketsPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default cssModules(ManageTicketsPage, styles);
