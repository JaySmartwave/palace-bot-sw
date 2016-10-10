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
import DateTime from 'grommet/components/DateTime';
import Select from 'react-select';
import CloseIcon from 'grommet/components/icons/base/Close';

import Dropzone from 'react-dropzone';

// static muna
const organisationId = '57f3a270f760e4f8ad97eec4';

    /*const EVENTS = [ // GET all events
    { value: '001', label: 'Girls Just Wanna Have Fun' }, // value = event.id // label = event.name?
    { value: '002', label: 'Kate Mess' },
    { value: '003', label: 'Game On'},
    { value: '004', label: 'Overtime'}
    ];*/

    class ManageVenuesPage extends Component {
      constructor() {
        super();
        this.handleMobile = this.handleMobile.bind(this);
        this.handleCalendar = this.handleCalendar.bind(this);
        this.onEventChange = this.onEventChange.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.testFunc = this.testFunc.bind(this);
        this.setName = this.setName.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.submitCreate = this.submitCreate.bind(this);

        this.state = {
          isMobile: false,
          files: [],
          venueId: null, // id mock test
          calendar: "10/17/2016",
          name: '',
          description: '',
          //events: EVENTS,
          //value: []
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
  testFunc() { // TEST functions here
    this.setState({
      files: []
    });
  }
  handleMobile() {
    const isMobile = window.innerWidth <= 768;
    this.setState({
      isMobile,
    });
  }
  onEventChange(value) {
    console.log('You\'ve selected:', value);
    this.setState({ value });
  }
  handleCalendar(event) {
  	this.setState({calendar: event.target.value});
  }
  onDrop(files) {
  	this.setState({
     files: files
   });
  }
  setName(event) {
    this.setState({name: event.target.value});
  }
  setDescription(event) {
    this.setState({ description: event.target.value });
  }
  submitCreate() {
    // console.log(organisationId);
    var objState = this.state;
    console.log(objState);

    // Create venue in a organisation
    var params = {
      organisationId: organisationId,
      name: objState.name,
      description: objState.description
    };

    PartyBot.venues.create(params, function(err, response, body) {

      console.log(response.statusCode);
      console.log(body);
      console.log(err);

      if(response.statusCode == 201) {
        alert('Venue Created.');
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
      {this.state.venueId !== null ? 
        <Heading align='center'>
        Edit Venue
        </Heading>
        : 
        <Heading align='center'>
        Add Venue
        </Heading>
      }
      </Box>
      <Box direction="row" justify="center" align="center" wrap={true} pad="small" margin="small">
      <Form>
      <FormFields>
      <fieldset>
      <FormField label="Name" htmlFor="venueName">
      <input id="venueName" type="text" onChange={this.setName}/>
      </FormField>
      <FormField label="Description" htmlFor="venueDescription">
      <input id="venueAddress" type="text" onChange={this.setDescription}/>
      </FormField>
      <FormField label="Location" htmlFor="venueLocation">
      <input id="venueAddress" type="text"/>
      </FormField>
      <FormField label="Longitude" htmlFor="venueLon">
      <input id="venueLon" type="number"/>
      </FormField>
      <FormField label="Latitude" htmlFor="venueLat">
      <input id="venueLat" type="number"/>
      </FormField>
      {/*<Box separator="all">
      <FormField label="Events" htmlFor="venueEvent"/>
      <Select 
          name="eventVenue"
          options={this.state.events}
          value={this.state.value}
          onChange={this.onEventChange} 
          multi={true}
      />
      </Box>
      <FormField label="Starts At" htmlFor="venueStarts">
      <DateTime id="venueStarts" format="M/D/YYYY" onChange={this.handleCalendar} value={this.state.calendar} />
      </FormField>
      <FormField label="Ends At" htmlFor="venueEnds">
      <DateTime id="venueEnds" format="M/D/YYYY" onChange={this.handleCalendar} value={this.state.calendar} />
      </FormField> */}
      <FormField label="Picture">
      {this.state.files.length > 0 ? 
        <Box align="center" justify="center">
         <div>{this.state.files.map((file) => <img src={file.preview} /> )}</div>
          <Box>
          <Button label="Cancel" onClick={this.testFunc} plain={true} icon={<CloseIcon />}/>
          </Box>
        </Box> :
        <Box align="center" justify="center">
        <Dropzone multiple={false} ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop}>
          Drop image here or click to select image to upload. 
        </Dropzone>
        </Box>
      }
       </FormField>
       </fieldset>
       </FormFields>
       <Footer pad={{"vertical": "medium"}}>
       {this.state.venueId !== null ? 
         <Heading align="center">
         <Button label="Save Changes" primary={true} onClick={this.submitSave} />
         </Heading>
         : 
         <Heading align="center">
         <Button label="Create Venue" primary={true} onClick={this.submitCreate} />
         </Heading>
       }
       </Footer>
       </Form>
       </Box>
       </div>
       );
  }
}

ManageVenuesPage.contextTypes = {
  router: PropTypes.object.isRequired,
};
export default cssModules(ManageVenuesPage, styles);
