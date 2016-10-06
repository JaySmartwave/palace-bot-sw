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

import Dropzone from 'react-dropzone';

// static muna
const organisationId = '57f3a270f760e4f8ad97eec4';

class ManageEventsPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.handleRecurring = this.handleRecurring.bind(this);
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
      description: ''
      // venueId: ''
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
     <FormField label="Event Name" htmlFor="eventName">
     <input id="eventName" type="text" onChange={this.setName}/>
     </FormField>
     <FormField label="Description" htmlFor="venueDescription">
     <input id="venueAddress" type="text" onChange={this.setDescription}/>
     </FormField>
     <FormField label="Venue" htmlFor="tableVenue">
     <select>
     <option value="valkyrie">Valkyrie</option>
     <option value="poolclub">Pool Club</option>
     <option value="revel">Revel</option>
     </select>
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
       <FormField label="Repeats" htmlFor="repeatingDays">
       <select>
       <option value="sunday">Sunday</option>
       <option value="monday">Monday</option>
       <option value="tuesday">Tuesday</option>
       <option value="wednesday">Wednesday</option>
       <option value="thursday">Thursday</option>
       <option value="friday">Friday</option>
       <option value="saturday">Saturday</option>
       </select>
       </FormField>
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
