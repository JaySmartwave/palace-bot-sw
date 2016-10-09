import PartyBot from 'partybot-http-client'; // Bots http client
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
import CheckBox from 'grommet/components/CheckBox';
import DateTime from 'grommet/components/DateTime';
import Select from 'react-select';
import CloseIcon from 'grommet/components/icons/base/Close';

import Dropzone from 'react-dropzone';

// static muna
const organisationId = '57f3a270f760e4f8ad97eec4';
const VENUES = [ // GET all events
    { value: '001', label: 'Valkyrie' }, // value = venue.id // label = venue.name?
    { value: '002', label: 'Pool Club' },
    { value: '003', label: 'Revel'},
    { value: '004', label: 'Naya'}
    ];
const DAYS = [ 
    { value: '001', label: 'Sunday' }, 
    { value: '002', label: 'Monday' },
    { value: '003', label: 'Tuesday'},
    { value: '004', label: 'Wednesday'},
    { value: '005', label: 'Thursday'},
    { value: '006', label: 'Friday'},
    { value: '007', label: 'Saturday'}
    ];

class ManageEventsPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.handleRecurring = this.handleRecurring.bind(this);
    this.onVenueAdd = this.onVenueAdd.bind(this);
    this.onDayAdd = this.onDayAdd.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.setName = this.setName.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.submitCreate = this.submitCreate.bind(this);

    this.state = {
      isMobile: false,
      isRecurring: false,
      files: [],
      eventId: null, // id mock test
      name: '',
      description: '',
      // venueId: ''
      venues: VENUES,
      days: DAYS,
      value: [],
      selectedDays: []
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
  handleRecurring() {
  	var active = !this.state.isRecurring;
    this.setState({
      isRecurring: active,
    });
    console.log(isRecurring)
  }
  onDrop(files) {
  	this.setState({
     files: files
   });
  	console.log(files)
  }

  onVenueAdd(value) {
    console.log('You\'ve selected:', value);
    this.setState({ value });
  }

  onDayAdd(selectedDays) {
    console.log('You\'ve selected:', selectedDays);
    this.setState({ selectedDays });
  }

  setName(event) {
    this.setState({name: event.target.value});
  }
  setDescription(event) {
    this.setState({description: event.target.value});
  }
  submitCreate() {

    var objState = this.state;
    console.log(objState);
    let venueId = '57f4681dbb6c3c23633eecc2';

    var createParams = {
      _venue_id: venueId,
      _organisation_id: organisationId,
      name: objState.name,
      description: objState.description
    };

    console.log(venueId);

    PartyBot.events.create(createParams, function(err, response, body) {
      console.log(response.statusCode);
      console.log(body);
      console.log(err);

      if(response.statusCode == 201) {
        alert('Event Created.');
      }
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
    } = this.state;
    return (
      <div className={styles.container}>
      <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css" />
      <Box pad={{ vertical: 'medium' }}>
      {this.state.eventId !== null ? 
       <Heading align="center">
       Edit Event
       </Heading>
       : 
       <Heading align="center">
       Add Event
       </Heading>
     }
     </Box>
     <Box direction="row" justify="center" align="center" wrap={true} pad="small	" margin="small">
     <Form>
     <FormFields>
     <fieldset>
      <Box separator="all">
      <FormField label="Venue" htmlFor="tableVenue" />
      <Select 
        name="venueEvent"
        options={this.state.venues}
        value={this.state.value}
        onChange={this.onVenueAdd} 
        multi={true}
      />
      </Box>
     <FormField label="Event Name" htmlFor="eventName">
     <input id="eventName" type="text" onChange={this.setName}/>
     </FormField>
     <FormField label="Description" htmlFor="venueDescription">
     <input id="venueAddress" type="text" onChange={this.setDescription}/>
     </FormField>
     <FormField htmlFor="checkboxes">
     <CheckBox id="isGuestList" onChange={this.testFunc} label="Guest List" />
     <CheckBox id="isTableBoookings" onChange={this.testFunc} label="Table Bookings" />
     <CheckBox id="isTickets" onChange={this.testFunc} label="Tickets" />
     </FormField>
     <FormField label="Cutoff" htmlFor="cutOff">
     <DateTime id="cutOff" name="name" format="h:mm:ss a" step={10} onChange={this.testFunc} />
     </FormField>
     <FormField label="Starts At" htmlFor="startsAt">
     <DateTime id="startsAt" onChange={this.testFunc} />
     </FormField>
     <FormField label="Ends At" htmlFor="endsAt">
     <DateTime id="endsAt" onChange={this.testFunc} />
     </FormField>
     <FormField htmlFor="isRecurring">
     <CheckBox id="isRecurring" onChange={this.handleRecurring} label="Recurring" />
     </FormField>
     {this.state.isRecurring !== false ? 
      <Box separator="all">
      <FormField label="Days" htmlFor="eventDays" />
      <Select 
        name="eventDays"
        options={this.state.days}
        value={this.state.selectedDays}
        onChange={this.onDayAdd} 
        multi={true}
      />
      </Box>
       : null
     }
     <FormField label="Picture">
     <Box direction="row" justify="center" align="center">
     <Dropzone multiple={false} ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop}>
     Drop image here or click to select image to upload. 
     </Dropzone>
     </Box>
     {this.state.files.length > 0 ? <div>
       Preview:
       <div>{this.state.files.map((file) => <img src={file.preview} /> )}</div>
       </div> : null}
       </FormField>
       </fieldset>
       </FormFields>
       <Footer pad={{"vertical": "medium"}}>
       {this.state.eventId !== null ? 
         <Heading align="center">
         <Button label="Save Changes" primary={true} onClick={this.submitSave} />
         </Heading>
         : 
         <Heading align="center">
         <Button label="Create Event" primary={true} onClick={this.submitCreate} />
         </Heading>
       }
       </Footer>
       </Form>
       </Box>
       </div>
       );
  }
}

ManageEventsPage.contextTypes = {
  router: PropTypes.object.isRequired,
};
export default cssModules(ManageEventsPage, styles);
