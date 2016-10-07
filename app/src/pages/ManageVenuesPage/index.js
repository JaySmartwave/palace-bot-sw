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

import Dropzone from 'react-dropzone';

// static muna
const organisationId = '57f3a270f760e4f8ad97eec4';

class ManageVenuesPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.handleCalendar = this.handleCalendar.bind(this);
    this.onEventChange = this.onEventChange.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.setName = this.setName.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.submitCreate = this.submitCreate.bind(this);

    this.state = {
      isMobile: false,
      files: [],
      venueId: null, // id mock test
      calendar: "10/17/2016",
      name: '',
      description: ''
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
  onEventChange(event) {
    var id = event.nativeEvent.target.selectedIndex;
    console.log('Selected Venue: ' + event.nativeEvent.target[id].value);
    // alert('Selected Venue' + event.nativeEvent.target[id].value);
    //this.setState
  }
  getEventOptions(){
    return [
    'Girls Just Wanna Have Fun',
    'Kate Mess',
    'Game On',
    'Overtime'
    ].map(function (item) {
      return <option key={item} value={item}> {item} </option>;
    }.bind(this));
  }
  handleCalendar(event) {
  	this.setState({calendar: event.target.value});
  }
  onDrop(files) {
  	this.setState({
     files: files
   });
  	console.log(files[0])
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
      <FormField label="Starts At" htmlFor="venueStarts">
      <DateTime id="venueStarts" format="M/D/YYYY" onChange={this.handleCalendar} value={this.state.calendar} />
      </FormField>
      <FormField label="Ends At" htmlFor="venueEnds">
      <DateTime id="venueEnds" format="M/D/YYYY" onChange={this.handleCalendar} value={this.state.calendar} />
      </FormField>
      <FormField label="Events" htmlFor="venueEvent">
      { 
        /*will change to multiple select*/ 
      }
      <select id="venueEvent" onChange={this.onEventChange}>
      {this.getEventOptions()}
      </select>
      </FormField>
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
