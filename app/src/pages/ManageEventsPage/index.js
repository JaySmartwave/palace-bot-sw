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
import request from 'superagent';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET, CLOUDINARY_UPLOAD_URL } from '../../constants';
import Immutable from 'immutable';
const DAYS = [{ 
  value: 0, 
  label: 'Sunday' 
}, { 
  value: 1, 
  label: 'Monday'
}, { 
  value: 2,
  label: 'Tuesday'
}, { 
  value: 3,
  label: 'Wednesday'
}, { 
  value: 4,
  label: 'Thursday'
}, { 
  value: 5, 
  label: 'Friday'
}, {
 value: 6,
 label: 'Saturday'
}];

const showSecond = false;
const str = showSecond ? 'HH:mm:ss' : 'hh:mm a';

class ManageEventsPage extends Component {

  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.handleRecurring = this.handleRecurring.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.closeSetup = this.closeSetup.bind(this);
    this.onVenueAdd = this.onVenueAdd.bind(this);
    this.onDayChange = this.onDayChange.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
    this.setName = this.setName.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.submitCreate = this.submitCreate.bind(this);
    this.submitSave = this.submitSave.bind(this);
    this.submitDelete = this.submitDelete.bind(this);
    this.state = {
      organisationId: '5800471acb97300011c68cf7',
      isMobile: false,
      isRecurring: false,
      recurrence: null,
      oted: {
        start_date: moment(),
        end_date: moment(),
        start_time: moment(),
        end_time: moment()
      },
      image: null,
      prevImage: null,
      isNewImage: false,
      eventId: null,
      name: '',
      description: '',
      venueId: '',
      venues: [],
      confirm: false,
      days: DAYS,
      value: [],
      selectedVenue: '',
      rsvp_cutoff: moment()
    };
  }
  componentWillMount() {
    
  }
  componentDidMount() {

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleMobile);
    }

    let options = {
      organisationId: this.state.organisationId,
      eventId: this.props.params.event_id
    };

    this.getVenues(options);

    if(this.props.params.event_id) {      
      this.getEvent(options);
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
    if(active) {
      this.setState({
        isRecurring: active,
        oted: null,
        recurrence: {
          start_time: moment(),
          end_time: moment()
        }
      });
    } else {
      this.setState({
        isRecurring: active,
        recurrence: null,
        oted: {
          start_date: moment(),
          end_date: moment()
        }
      });
    }
    
  }

  getEvent = (options) => {
    PartyBot.events.get(options, (err, response, body) => {
      console.log(body);
      if(!err && response.statusCode == 200) {
        this.setState({
          isRecurring: body.event.recurrence ? true: false,
          eventId: body.event._id,
          name: body.event.name,
          description: body.event.description,
          selectedVenue: body.event._venue_id,
          image: {
            preview: body.event.image
          },
          prevImage : {
            preview: body.event.image
          },
          oted: body.event.oted ? {
            start_date: moment(body.event.oted.start_date),
            end_date: moment(body.event.oted.end_date),
            start_time: moment(body.event.oted.start_date),
            end_time: moment(body.event.oted.end_date)
          } : null,
          recurrence: body.event.recurrence ? {
            start_time: moment(body.event.recurrence.start_time, 'HH:mm a'),
            end_time: moment(body.event.recurrence.end_time, 'HH:mm a'),
            day: body.event.recurrence.day
          } : null
        });
      }
    });
  }

  getVenues = (options) => {
    PartyBot.venues.getAllInOrganisation(options, (errors, response, body) => {
      if(response.statusCode == 200) {
        if(body.length > 0) {
          this.setState({selectedVenue: body[0]._id});
        }
        this.setState({venues: body});
      }
    });
  }

  onOtedStartDateChange = (value) => {
    let mapped = Immutable.Map(this.state.oted);
    let changed = mapped.set('start_date', value);
    this.setState({
      oted: changed.toObject()
    });
  }

  onOtedEndDateChange = (value) => {
    let mapped = Immutable.Map(this.state.oted);
    let changed = mapped.set('end_date', value);
    this.setState({
      oted: changed.toObject()
    });
  }

  onOtedStartTimeChange = (value) => {
    let mapped = Immutable.Map(this.state.oted);
    let changed = mapped.set('start_time', value);
    this.setState({
      oted: changed.toObject()
    });
  }

  onOtedEndTimeChange = (value) => {

    let mapped = Immutable.Map(this.state.oted);
    let changed = mapped.set('end_time', value);
    this.setState({
      oted: changed.toObject()
    });
  }

  onRecStartTimeChange = (value) => {
    let mapped = Immutable.Map(this.state.recurrence);
    let changed = mapped.set('start_time', value);
    this.setState({
      recurrence: changed.toObject()
    });
  }

  onRecEndTimeChange = (value) => {
    let mapped = Immutable.Map(this.state.recurrence);
    let changed = mapped.set('end_time', value);
    this.setState({
      recurrence: changed.toObject()
    });
  }

  onDayChange(selectedDay) {
    let mapped = Immutable.Map(this.state.recurrence);
    let changed = mapped.set('day', selectedDay.value);
    this.setState({
      recurrence: changed.toObject()
    });
  }

  onCutOffChange(value) {
    this.setState({ rsvp_cutoff: value });
    // console.log(value && value.format(str));
  }

  onVenueChange = (event) => {
    let venueCode = event.target.value;
    this.setState({
      selectedVenue: venueCode
    });
  }

  closeSetup(){
    this.setState({
     confirm: false
   });
    this.context.router.push('/event-schedule');
  }

  onDrop(files) {
  	this.setState({
       image: files[0],
       isNewImage: true
     });
  }

  onRemoveImage() {
    this.setState({
      image: this.state.prevImage,
      isNewImage: false
    });
  }

  onVenueAdd(value) {
    this.setState({ value });
  }

  setName(event) {
    this.setState({name: event.target.value});
  }
  setDescription(event) {
    this.setState({description: event.target.value});
  }

  handleImageUpload(file, callback) {
    if(this.state.isNewImage) {
      let options = {
        url: CLOUDINARY_UPLOAD_URL,
        formData: {
          file: file
        }
      };
      let upload = request.post(CLOUDINARY_UPLOAD_URL)
      .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      .field('file', file);

      upload.end((err, response) => {
        if (err) {
          console.error(err);
        }

        if (response.body.secure_url !== '') {
          callback(null, response.body.secure_url)
        } else {
          callback(err, '');
        }
      });
    } else {
      callback(null, null);
    }
  }

  submitDelete (event) {
    event.preventDefault();
    let params = _.pick(this.state, ['organisationId', 'eventId']);
    PartyBot.events.deleteEvent(params, (error, response, body) => {
      if(!err && response.statusCode == 200) {
        this.setState({
          confirm: true
        });
      } else {

      }
    });
  }

  submitSave(event) {
    event.preventDefault();
    console.log("Sending save");
    this.handleImageUpload(this.state.image, (err, imageLink) => {
      if (err) {
        console.log(err);
      } else {
        let updateParams = {
          organisationId: this.state.organisationId,
          _venue_id: this.state.selectedVenue,
          eventId: this.state.eventId,
          name: this.state.name,
          description: this.state.description,
          image: imageLink || this.state.prevImage.preview,
          oted: null
        };

        updateParams.oted = (this.state.oted ? { 
          start_date: moment(this.state.oted.start_date.format('YYYY-MM-DD') + ' ' + this.state.oted.start_time.format(str+'ZZ')),
          end_date: moment(this.state.oted.end_date.format('YYYY-MM-DD') + ' ' + this.state.oted.end_time.format(str+'ZZ')) }
           : null);
        updateParams.recurrence = (this.state.recurrence ? {
          start_time: this.state.recurrence.start_time.format(str),
          end_time: this.state.recurrence.end_time.format(str),
          day: this.state.recurrence.day }
           : null);

        PartyBot.events.update(updateParams, (err, response, body) => {
          console.log(err);
          console.log(response.statusCode);
          console.log(body);
          if(!err && response.statusCode == 200) {
            this.setState({
              confirm: true
            });
          } else {

          }
        });
      }
    });
  }

  submitCreate(event) {
    event.preventDefault();
    console.log("Sending create");
    this.handleImageUpload(this.state.image, (err, imageLink) => {
      if (err) {
        console.log(err);
      } else {
        let createParams = {
          venueId: this.state.selectedVenue,
          organisationId: this.state.organisationId,
          name: this.state.name,
          description: this.state.description,
          image: imageLink,
        }
        createParams.oted = (this.state.oted ? { 
          start_date: moment(this.state.oted.start_date.format('YYYY-MM-DD') + ' ' + this.state.oted.start_time.format(str+'ZZ')),
          end_date: moment(this.state.oted.end_date.format('YYYY-MM-DD') + ' ' + this.state.oted.end_time.format(str+'ZZ')) }
           : null);
        createParams.recurrence = (this.state.recurrence ? {
          start_time: this.state.recurrence.start_time.format(str),
          end_time: this.state.recurrence.end_time.format(str) }
           : null);
        console.log(createParams);
        PartyBot.events.create(createParams, (err, response, body) => {
          if(!err && response.statusCode == 201) {
            this.setState({
              confirm: true
            });
          } else {

          }
        });
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
          : null
        }
        <Box> {/*  pad={{ vertical: 'medium' }} */}
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
        <Box direction="row" justify="center" align="center" wrap={true} margin="small"> {/*pad="small "*/}
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
                  <select name="venueEvent" onChange={this.onVenueChange} value={this.state.selectedVenue}>
                  {this.state.venues.map((value, index) => {
                    return <option key={index} value={value._id}>{value.name}</option>;
                  })}
                  </select>
                </Box>

                <FormField label="Event Name" htmlFor="eventName">
                  <input id="eventName" type="text" onChange={this.setName} value={this.state.name}/>
                </FormField>

                <FormField label="Description" htmlFor="venueDescription">
                  <input id="venueAddress" type="text" onChange={this.setDescription} value={this.state.description}/>
                </FormField>

                <FormField htmlFor="checkboxes">
                  <CheckBox id="isGuestList" onChange={() => {}} label="Guest List" />
                  <CheckBox id="isTableBoookings" onChange={() => {}} label="Table Bookings" />
                  <CheckBox id="isTickets" onChange={() => {}} label="Tickets" />
                </FormField>

                <FormField label="Cutoff" htmlFor="cutOff">
                  <TimePicker
                  style={{ margin: 10 }}
                  showSecond={showSecond}
                  value={this.state.rsvp_cutoff}
                  defaultValue={moment()}
                  format='hh:mm a'
                  onChange={this.onCutOffChange.bind(this)}
                  />
                </FormField>

                <FormField htmlFor="isRecurring">
                  <CheckBox id="isRecurring" onChange={this.handleRecurring} label="Recurring" checked={this.state.isRecurring}/>
                </FormField>

                { this.state.isRecurring ?
                  <div>
                    <FormField label="Starts At" htmlFor="startsAt">
                      <TimePicker 
                      style={{ margin: 10 }}
                      showSecond={false}
                      defaultValue={moment()}
                      value={this.state.recurrence.start_time}
                      format='hh:mm a'
                      onChange={this.onRecStartTimeChange} />
                    </FormField> 

                    <FormField label="Ends At" htmlFor="endsAt">
                      <TimePicker
                      style={{ margin: 10 }}
                      showSecond={showSecond}
                      defaultValue={moment()}
                      value={this.state.recurrence.end_time}
                      format='hh:mm a'
                      onChange={this.onRecEndTimeChange} />       
                    </FormField>

                    <Box separator="all">
                      <FormField label="Days" htmlFor="eventDays" />
                      <Select name="eventDays" options={this.state.days} value={this.state.recurrence.day} onChange={this.onDayChange} />
                    </Box>
                  </div> :
                  <div>
                    <FormField label="Starts At" htmlFor="startsAt">
                      <DatePicker className={styles.dpckr} selected={this.state.oted.start_date} onChange={this.onOtedStartDateChange} />
                      <TimePicker
                      style={{ margin: 10 }}
                      showSecond={false}
                      defaultValue={moment()}
                      value={this.state.oted.start_time}
                      format='hh:mm a'
                      onChange={this.onOtedStartTimeChange} />
                    </FormField> 

                    <FormField label="Ends At" htmlFor="endsAt">
                      <DatePicker className={styles.dpckr} selected={this.state.oted.end_date} onChange={this.onOtedEndDateChange} />
                      <TimePicker
                      style={{ margin: 10 }}
                      showSecond={showSecond}
                      defaultValue={moment()}
                      value={this.state.oted.end_time}
                      format='hh:mm a'
                      onChange={this.onOtedEndTimeChange} />
                    </FormField>
                  </div>

                }
                
                <FormField label="Image">
                  {this.state.image ? 
                  <Box align="center" justify="center"> 
                    <div> 
                      <img src={this.state.image.preview} width="200" />
                    </div>
                    <Box>
                      <Button label="Cancel" onClick={this.onRemoveImage.bind(this)} plain={true} icon={<CloseIcon />}/>
                    </Box>
                  </Box> :
                  <Box align="center" justify="center">
                    <Dropzone multiple={false} ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop} accept='image/*'>
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
                <Button label="Delete" primary={true} onClick={this.submitDelete} />
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
