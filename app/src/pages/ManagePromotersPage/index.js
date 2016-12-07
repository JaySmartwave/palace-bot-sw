import PartyBot from 'partybot-http-client';
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
import CloseIcon from 'grommet/components/icons/base/Close';
import Layer from 'grommet/components/Layer';
import Header from 'grommet/components/Header';
import Section from 'grommet/components/Section';
import Select from 'react-select';
import _ from 'underscore';
import Immutable from 'immutable';
class ManagePromotersPage extends Component {
  constructor(props) {
    super(props);
    this.handleMobile = this.handleMobile.bind(this);
    this.onEventAdd = this.onEventAdd.bind(this);
    this.onVenueAdd = this.onVenueAdd.bind(this);
    this.state = {
      organisationId: '5800471acb97300011c68cf7',
      isMobile: false,
      promoterId: null,
      venues: [],
      events: [],
      selectedVenues: [],
      selectedEvents: [],
      promoterCode: '',
      name: { first: '', last: '' },
      confirm: false,
      action: 'created'
    };
  }
  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleMobile);
    }

    let options = {
      organisationId: this.state.organisationId
    };

    this.getVenues(options);
    this.getEvents(options);
    if(this.props.params.promoter_id) {
      this.setState({promoterId: this.props.params.promoter_id});
      let pOptions = {
        organisationId: this.state.organisationId,
        promoterId: this.props.params.promoter_id
      };

      this.getPromoter(pOptions);
    }
  }
  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleMobile);
    }
  }

  getVenues = (options) => {
    PartyBot.venues.getAllInOrganisation(options, (errors, response, body) => {
      if(response.statusCode == 200) {
        this.setState({
          venues: body.map((value, index) => {
            return {
              value: value._id,
              label: value.name
            }
          })
        });
      }
    });
  }

  getEvents = (options) => {
    PartyBot.events.getEventsInOrganisation(options, (err, response, body) => {
      if(!err && response.statusCode == 200) {
        if(body.length > 0) {
          this.setState({
            eventId: body[0]._id,
            events: body.map((value, index) => {
              return { value: value._id, label: value.name, venueId: value._venue_id };
            }),
            eventOptions: body.map((value, index) => {
              return { value: value._id, label: value.name, venueId: value._venue_id };
            })
          });
        }
      }
    });
  }

  getPromoter = (options) => {
    PartyBot.promoters.getPromoters(options, (error, response, body) => {
      if(!error) {
        this.setState({
          name: body.name,
          promoterCode: body.promoter_code,
          selectedVenues: body._venue_id,
          selectedEvents: body._event_id
        });
      }
    });
  }

  handleMobile() {
    const isMobile = window.innerWidth <= 768;
    this.setState({
      isMobile,
    });
  }
  onVenueAdd = (selectedVenues) => {

    var eventsOptions = [];
    selectedVenues.map((value, index) => {
      this.state.events.filter((eValue, eIndex) => {
        if(eValue.venueId == value.value) {
          eventsOptions.push(eValue);
        }
      });
    });
    // if(body.length > 0) {
    //   this.setState({venueId: body[0]._id});
    //   let ttOptions = {
    //     organisationId: this.state.organisationId,
    //     venue_id: this.state.venueId
    //   }
    //   this.getEvents(ttOptions);
    // }

    this.setState({
      selectedVenues: selectedVenues,
      eventOptions: eventsOptions 
    });
  }

  onEventAdd(selectedEvents) {

    this.setState({ selectedEvents });
  }

  onChangeFirstName = (event) => {
    event.preventDefault();
    let mapped = Immutable.Map(this.state.name);
    let changed = mapped.set('first', event.target.value);
    this.setState({ name: changed.toObject() });
  }

  onChangeLastName = (event) => {
    event.preventDefault();
    let mapped = Immutable.Map(this.state.name);
    let changed = mapped.set('last', event.target.value);
    this.setState({ name: changed.toObject() });
  }

  onChangePromoterCode = (event) => {
    event.preventDefault();
    this.setState({ promoterCode: event.target.value });
  }

  closeSetup = () => {
    this.setState({
     confirm: false
   });
    this.context.router.push('/promoters');
  }

  submitSave = (event) => {
    event.preventDefault()
    var updateParams = {
      organisationId: this.state.organisationId,
      _venue_id: this.state.selectedVenues.map((value, index) => {
        return value.value;
      }),
      _event_id: this.state.selectedEvents.map((value, index) => {
        return value.value;
      }),
      name: this.state.name,
      promoter_code: this.state.promoterCode,
      promoterId: this.state.promoterId
    }
    PartyBot.promoters.updatePromoter(updateParams, (error, response, body) => {
      if(response.statusCode == 200) {  
        this.setState({
          confirm: true,
          action: 'edited'
        });
      }
    });
  }

  submitCreate = (event) => {
    event.preventDefault()
    var createParams = {
      organisationId: this.state.organisationId,
      venue_id: this.state.selectedVenues.map((value, index) => {
        return value.value;
      }),
      event_id: this.state.selectedEvents.map((value, index) => {
        return value.value;
      }),
      name: this.state.name,
      promoter_code: this.state.promoterCode
    }

    PartyBot.promoters.create(createParams, (error, response, body) => {
      if(response.statusCode == 200) {
        this.setState({
          confirm: true,
          action: 'created'
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
    return (
      <div className={styles.container}>
      {this.state.confirm !== false ? 
          <Layer align="center">
            <Header>
              Promoter successfully {this.state.action}.
            </Header>
            <Section>
              <Button label="Close" onClick={this.closeSetup} plain={true} icon={<CloseIcon />}/>
            </Section>
          </Layer>
          : null
        }
      <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css" />
        <Box>
        {this.state.promoterId !== null ? 
    	<Heading align="center">
            Edit Promoter
        </Heading>
        : 
    	<Heading align="center">
            Add Promoter
        </Heading>
    	}
          </Box>
			<Box direction="row" justify="center" align="center" wrap={true} margin="small">
				<Form>
				<FormFields>
					<fieldset>
            <FormField label="First Name" htmlFor="promoterFirstName">
              <input id="promoterFirstName" type="text" onChange={this.onChangeFirstName} value={this.state.name.first}/>
            </FormField>
					  <FormField label="Last Name" htmlFor="promoterLastName">
					    <input id="promoterLastName" type="text" onChange={this.onChangeLastName} value={this.state.name.last} />
					  </FormField>
					  <FormField label="Code" htmlFor="promoterCode">
					    <input id="promoterCode" type="text" onChange={this.onChangePromoterCode} value={this.state.promoterCode} />
					  </FormField>
              <Box separator="all">
                <FormField label="Venue" htmlFor="promoterVenue" />
                <Select 
                  name="promoterVenue"
                  options={this.state.venues}
                  value={this.state.selectedVenues}
                  onChange={this.onVenueAdd} 
                  multi={true}
                  />
              </Box>
              <br/>
              <Box separator="all">
                <FormField label="Event" htmlFor="promoterEvent" />
                <Select 
                  name="promoterEvent"
                  options={this.state.eventOptions}
                  value={this.state.selectedEvents}
                  onChange={this.onEventAdd} 
                  multi={true}
                />
              </Box>
					</fieldset>
				</FormFields>
				  <Footer pad={{"vertical": "medium"}}>
			  	        {this.state.promoterId !== null ? 
				    	<Heading align="center">
				            <Button label="Save Changes" primary={true} onClick={this.submitSave} />
				        </Heading>
				        : 
				    	<Heading align="center">
				            <Button label="Create Promoter" primary={true} onClick={this.submitCreate} />
				        </Heading>
				    	}
				  </Footer>
				</Form>
			</Box>
      </div>
    );
  }
}

ManagePromotersPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default cssModules(ManagePromotersPage, styles);
