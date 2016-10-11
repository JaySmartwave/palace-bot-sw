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
import Select from 'react-select';
import NumberInput from 'grommet/components/NumberInput';

import CloseIcon from 'grommet/components/icons/base/Close';


const EVENTS = [ // static muna kuno //GET all events
    { value: '001', label: 'Valkyrie' }, // value = venue.id // label = venue.name?
    { value: '002', label: 'Pool Club' },
    { value: '003', label: 'Revel'},
    { value: '004', label: 'Naya'}
    ];

class ManageTicketsPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.handleRecurring = this.handleRecurring.bind(this);
    this.getEventOptions = this.getEventOptions.bind(this);
    this.onEventChange = this.onEventChange.bind(this);
    this.onPriceChange = this.onPriceChange.bind(this);
    this.setName = this.setName.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.submitCreate = this.submitCreate.bind(this);

    this.state = {
      isMobile: false,
      isRecurring: false,
      variants: [],
      ticketId: null, // id mock test
      name: '',
      description: '',
      events: EVENTS,
      priceValue: 0
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

  testFunc() { // TEST functions here
    console.log("test");
  }

  getEventOptions(){
    return EVENTS.map(function (item) {
      return <option key={item.value} value={item.value}> {item.label} </option>;
    }.bind(this));
  }

  onEventChange(event) {
   //  let venueId = event.nativeEvent.target.selectedIndex;
   //  let venueCode = event.nativeEvent.target[venueId].value;
   //  console.log('Selected Venue: ' + venueCode);
   //  this.setState({
   //    selectedVenue: venueCode
   //  });
   // console.log(this.state.selectedVenue);
  }

  onPriceChange(value) {
  	this.setState({
  		priceValue: value
  	})
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
     <Form>
     <FormFields>
     <fieldset>
      <Box separator="all">
      <FormField label="Venue" htmlFor="tableVenue" />
      <select
        name="ticketEvent"
        onChange={this.onEventChange}
      >
      	{this.getEventOptions()}
      </select>
      </Box>
	      {//variant
	      }
	     <FormField label="Name" htmlFor="ticketName">
	     <input id="ticketName" type="text" onChange={this.setName}/>
	     </FormField>
	     <FormField label="Description" htmlFor="ticketDescription">
	     <input id="ticketDescription" type="text" onChange={this.setDescription}/>
	     </FormField>
	     <FormField label="Price(Php)" htmlFor="ticketDescription">
	     <NumberInput id="ticketPrice" value={this.state.priceValue} min={0} step={100} onChange={this.onPriceChange}/>
	     </FormField>
		  {//variant
	      }
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
