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
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Layer from 'grommet/components/Layer';
import Header from 'grommet/components/Header';
import Section from 'grommet/components/Section';
import Paragraph from 'grommet/components/Paragraph';

const organisationId = '57f3a273f760e4f8ad97eec5';

// value = venue.id // label = venue.name?
// const VENUES = [{ 
//   value: '001', 
//   label: 'Valkyrie' 
// }, { 
//   value: '002', 
//   label: 'Pool Club' 
// }, { 
//   value: '003', 
//   label: 'Revel'
// }, { 
//   value: '004', 
//   label: 'Naya'
// }];

const DAYS = [{ 
  value: '001', 
  label: 'Sunday' 
}, { 
  value: '002', 
  label: 'Monday'
}, { 
  value: '003',
  label: 'Tuesday'
}, { 
  value: '004',
  label: 'Wednesday'
}, { 
  value: '005',
  label: 'Thursday'
}, { 
  value: '006', 
  label: 'Friday'
}, {
 value: '007',
 label: 'Saturday'
}];

const showSecond = true;
const str = showSecond ? 'HH:mm:ss' : 'HH:mm';

class ManageEventsPage extends Component {

  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.handleRecurring = this.handleRecurring.bind(this);
    this.closeSetup = this.closeSetup.bind(this);
    this.onVenueChange = this.onVenueChange.bind(this);
    this.onVenueAdd = this.onVenueAdd.bind(this);
    this.onVenueChange = this.onVenueChange.bind(this);
    this.getVenueOptions = this.getVenueOptions.bind(this);
    this.onDayAdd = this.onDayAdd.bind(this);
    this.onTimeChange = this.onTimeChange.bind(this);
    this.testFunc = this.testFunc.bind(this);
    this.setStartDate = this.setStartDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
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
          venueId: '',
          venues: [],
          confirm: false,
          days: DAYS,
          value: [],
          selectedDays: [],
          selectedVenue: '',
          startDate: moment(),
          endDate: moment()
        };
      }
      componentWillMount() {
        PartyBot.venues.getAllInOrganisation('57f3a273f760e4f8ad97eec5', function(err, response, body) {
          console.log('Error: ' + err);
          console.log('Status Code: ' + response.statusCode);      
          if(!err && response.statusCode == 200) {
            // console.log(body);
            this.setState({
              venues: body
            });
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
      handleRecurring() {
       var active = !this.state.isRecurring;
       this.setState({
        isRecurring: active,
      });
       console.log(isRecurring)
     }

  testFunc() { // TEST functions here
    console.log("test");
  }

  setStartDate(date) {
    this.setState({
      startDate: date
    });
  }

  setEndDate(date) {
    this.setState({
      endDate: date
    });
  }


  onTimeChange(value) {
  console.log(value && value.format(str));
  }

  onVenueChange(event) {
    let venueId = event.nativeEvent.target.selectedIndex;
    let venueCode = event.nativeEvent.target[venueId].value;
    console.log('Selected Venue: ' + venueCode);
    this.setState({
      selectedVenue: venueCode
    });
    console.log(this.state.selectedVenue);
  }

  closeSetup(){
    this.setState({
     confirm: false
   });
    this.context.router.push('/schedules');
  }

  onDrop(files) {
  	this.setState({
     files: files
   });
  }

  onRemoveImage() {
    this.setState({
      files: []
    });
  }

  onVenueAdd(value) {
    console.log('You\'ve selected:', value);
    this.setState({ value });
  }

  onDayAdd(selectedDays) {
    console.log('You\'ve selected:', selectedDays);
    this.setState({ selectedDays });
  }

  getVenueOptions(){
    let stateVenues = this.state.venues;

    return stateVenues.map(function(venue, i) {

      // console.log(venue);
      return (
        <option key={i} value={venue._id}> {venue.name} </option>
        );
      // return venue.map(function(venueData, j) {
      //   console.log(venueData);
      // });
      // return <option key={item._id} value={item.value}> {item.label} </option>;

    }.bind(this));
  }

  onVenueChange(event) {
    let venueId = event.nativeEvent.target.selectedIndex;
    let venueCode = event.nativeEvent.target[venueId].value;
    console.log('Selected Venue: ' + venueCode);
    this.setState({
      selectedVenue: venueCode
    });
  }

  setName(event) {
    this.setState({name: event.target.value});
  }
  setDescription(event) {
    this.setState({description: event.target.value});
  }
  submitCreate() {

    var objState = this.state;
    var staticVenueId = '57ff3b8dd46ae000116c4d49';

    var createParams = {
      _venue_id: staticVenueId,
      _organisation_id: '57f3a273f760e4f8ad97eec5',
      name: objState.name,
      description: objState.description
    };

    console.log(createParams);

    PartyBot.events.create(createParams, function(err, response, body) {
      console.log(response.statusCode);
      console.log(body);
      console.log(err);

      if(response.statusCode == 200) {
            this.setState({
              confirm: true
            });
          }
        }.bind(this));

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
      {this.state.confirm !== false ? 
      <Layer align="center">
        <Header>
            Event successfully created.
        </Header>
        <Section>
          <Button label="Close" onClick={this.closeSetup} plain={true} icon={<CloseIcon />}/>
        </Section>
      </Layer>
      :
      null
      }
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
      {/* *** MULTIPLE ***
        <Select 
        name="venueEvent"
        options={this.state.venues}
        value={this.state.value}
        onChange={this.onVenueAdd} 
        multi={true}
      />*/}
      {//single
      }
      <select name="venueEvent"
      onChange={this.onVenueChange}>
      {this.getVenueOptions()}
      </select>
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
        <TimePicker
          style={{ margin: 10 }}
          showSecond={showSecond}
          defaultValue={moment()}
          onChange={this.onTimeChange}
        />
      </FormField>
      <FormField label="Starts At" htmlFor="startsAt">
        {this.state.isRecurring !== true ? 
          <DatePicker className={styles.dpckr} selected={this.state.startDate} onChange={this.handleChange} />
        :
          null    
        }     
        <TimePicker
          style={{ margin: 10 }}
          showSecond={showSecond}
          defaultValue={moment()}
          onChange={this.onTimeChange}
        />
      </FormField>
      <FormField label="Ends At" htmlFor="endsAt">  
        {this.state.isRecurring !== true ?
          <DatePicker className={styles.dpckr} selected={this.state.endDate} onChange={this.handleChange} />
        :
          null
        } 
        <TimePicker
          style={{ margin: 10 }}
          showSecond={showSecond}
          defaultValue={moment()}
          onChange={this.onTimeChange}
        />       
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
      <FormField label="Image">
      {this.state.files.length > 0 ? 
        <Box align="center" justify="center">
        <div>{this.state.files.map((file) => <img src={file.preview} /> )}</div>
        <Box>
        <Button label="Cancel" onClick={this.onRemoveImage} plain={true} icon={<CloseIcon />}/>
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
