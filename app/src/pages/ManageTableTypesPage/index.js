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
import NumberInput from 'grommet/components/NumberInput';
import CloseIcon from 'grommet/components/icons/base/Close';
import Dropzone from 'react-dropzone';
import Layer from 'grommet/components/Layer';
import Header from 'grommet/components/Header';
import Section from 'grommet/components/Section';
import Paragraph from 'grommet/components/Paragraph';
import Select from 'react-select';
import request from 'superagent';
import Immutable from 'immutable';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET, CLOUDINARY_UPLOAD_URL } from '../../constants';

class ManageTableTypesPage extends Component {
  constructor(props) {
    super(props);
    this.handleMobile = this.handleMobile.bind(this);
    this.state = {
      organisationId: '5800471acb97300011c68cf7',
      no_of_pax: 0,
      isMobile: false,
      isBusy: 0,
      image: null,
      prevImage: null,
      isNewImage: false,
      tableTypeId: props.params.table_type_id || null,
      confirm: false,
      name: '',
      tags: 'tabletypes',
      venues: [],
      events: [],
      selectedVenue: [],
      selectedEvents: [],
      eventVars: []
    };
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleMobile);
    }

    let options = {
      organisationId: this.state.organisationId,
    };
    this.getVenues(options);

    if(this.state.tableTypeId) {
      let ttOptions = {
        organisationId: this.state.organisationId,
        tableTypeId: this.state.tableTypeId        
      };
      this.getTableType(ttOptions);
    }

  }
  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleMobile);
    }
  }
  handleMobile = () => {
    const isMobile = window.innerWidth <= 768;
    this.setState({
      isMobile,
    });
  }

  onVenueChange = (selectedVenue) => {
    this.setState({ selectedVenue: selectedVenue.value, selectedEvents:[], eventVars: [] });
    let params = {
      organisationId: this.state.organisationId,
      venue_id: selectedVenue.value
    };
    this.getEvents(params)
  }

  onEventAdd = (index, selectedEvents) => {
    const CL = console.log;
    // CL(selectedEvents);
    let cloned = Immutable.List(this.state.eventVars);
    let anIndex = Immutable.fromJS(cloned.get(index));
    
    let newIds = selectedEvents.map((value, index) => {  
      return value.value
    });

    // let newMapped = ;
    // console.log(newMapped);
    anIndex = anIndex.set('_event_id', anIndex.get('_event_id').concat(newIds));
    let newClone = cloned.set(index, anIndex);
    console.log(newClone.toJS());
    this.setState({eventVars: newClone})
    this.setState({selectedEvents});
  }

  closeSetup = () => {
    this.setState({
      confirm: false
    });
    this.context.router.push('/table-types');
  }

  setName = (event) => {
    this.setState({name: event.target.value});
  }

  setNoOfPax = (event) => {
    this.setState({no_of_pax: event.target.value});
  };

  addEvent = () => {
    this.setState({
      eventVars: this.state.eventVars.concat({
        _event_id: [],
        description: "Some Description",
        image: null
      })
    });
  }

  removeEvent = (index) => {

  }

  onDrop = (file) => {
    this.setState({
       image: file[0],
       isNewImage: true,
     });
  }
  onRemoveImage = () => {
    this.setState({
      image: null,
      isNewImage: false,
    });
  }

  handleImageUpload = (file, callback) => {
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

  submitDelete = (event) => {
    event.preventDefault();
    let params = _.pick(this.state, ['organisationId', 'tableTypeId']);
    PartyBot.tableTypes.deleteTableType(params, (error, response, body) => {
      if(!error && response.statusCode == 200) {
        this.setState({
          confirm: true
        });
      } else {

      }
    });
  }

  submitSave = (event) => {
    event.preventDefault();
    let venuesArr = this.state.selectedVenue.map(function(value, index) {
      return value.value;
    });
    this.handleImageUpload(this.state.image, (err, imageLink) => {
      if (err) {
        console.log(err);
      } else {
        let updateParams = { 
          name: this.state.name,
          organisationId: this.state.organisationId,
          tableTypeId: this.state.tableTypeId,
          no_of_pax: this.state.no_of_pax,
          venue_id: venuesArr,
          image: imageLink || this.state.prevImage.preview || null
        };
        PartyBot.tableTypes.update(updateParams, (err, response, body) => {
          
          if(response.statusCode == 200) {
            this.setState({
              confirm: true
            });
          }
        });
      }
    });
  }

  submitCreate = (event) => {
    event.preventDefault();
    console.log(this.state);
    // this.handleImageUpload(this.state.image, (err, imageLink) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     let objState = this.state;
    //     let createParams = { 
    //       organisationId: this.state.organisationId,
    //       venue_id: venuesArr,
    //       name: this.state.name,
    //       no_of_pax: this.state.no_of_pax,
    //       image: imageLink
    //     };
    //     PartyBot.tableTypes.create(createParams, (err, response, body) => {
    //       if(response.statusCode == 200) {
    //         this.setState({
    //           confirm: true
    //         });
    //       }
    //     });
    //   }
    // });
  }

  getVenues = (options) => {
    PartyBot.venues.getAllInOrganisation(options, (errors, response, body) => {
      if(response.statusCode == 200) {
        let arr = [];
        body.map(function(value, index) {
          arr.push({value: value._id, label: value.name});
        });
        this.setState({venues: arr});
      }
    });
  }

  getEvents = (options) => {
    PartyBot.events.getEventsInOrganisation(options, (err, response, body) => {
      if(!err && response.statusCode == 200) {
        if(body.length > 0) {
          this.setState({eventId: body[0]._id});
        }
        let arr = [];
        body.map(function(value, index) {
          arr.push({value: value._id, label: value.name});
        });
        this.setState({events: arr});
      }
    });
  }

  getTableType = (options) => {
    return PartyBot.tableTypes.getTableTypesInOrganisation(options, (errors, response, body) => {
      if(response.statusCode == 200) {
        body._venues.map((value, index) => {
          this.setState({
            selectedVenue: this.state.selectedVenue.concat({
              label: value.name,
              value: value._id
            })
          });
        });
        this.setState({
          image: {
            preview: body.image
          },
          prevImage: {
            preview: body.image
          },
          venueId: body.venueId,
          tableTypeId: body._id,
          name: body.name,
          no_of_pax: body.no_of_pax
        });
      }
    });
  };

  renderEventVars = () => {
    return this.state.eventVars.map((value, index) => {
    return (
      <Box key={index} separator="all" pad={{"vertical": "medium"}}>
        <FormField label="Event" htmlFor="event" />
        <Select 
          name="events"
          options={this.state.events}
          value={this.state.selectedEvents}
          onChange={this.onEventAdd.bind(this, index)}
          multi={true}
          />
        <FormField label="Description" htmlFor="tableTypedescription">
          <input id="tableTypedescription" type="text" onChange={() => {}} value/>
        </FormField>
        <FormField label="Image">
        {this.state.image ? 
          <Box size={{ width: 'large' }} align="center" justify="center"> 
            <div> 
              <img src={this.state.image.preview} width="200" />
            </div>
            <Box size={{ width: 'large' }}>
              <Button label="Cancel" onClick={this.onRemoveImage.bind(this)} plain={true} icon={<CloseIcon />}/>
            </Box>
          </Box> :
          <Box align="center" justify="center" size={{ width: 'large' }}>
            <Dropzone multiple={false} ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop} accept='image/*'>
              Drop image here or click to select image to upload. 
            </Dropzone>
          </Box>
        }
        </FormField>
      </Box>)
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
      variants,
    } = this.state;
    return (
      <Box size={{ width: 'large' }}>

        <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css" />
        {this.state.confirm !== false ? 
        <Layer align="center">
          <Header>
            Table Type successfully created.
          </Header>
          <Section>
            <Button label="Close" onClick={this.closeSetup} plain={true} icon={<CloseIcon />}/>
          </Section>
        </Layer>
        : null
        }
      <Box size={{ width: 'large' }}>
        {this.state.tableTypeId !== null ? 
          <Heading align="center">
            Edit Table Type
          </Heading>
          : 
          <Heading align="center">
            Add Table Type
          </Heading>
        }
      </Box>
			<Box size={{ width: 'large' }} direction="row" justify="center" align="center" wrap={true} margin="small">
				<Form>
				<FormFields>
					<fieldset>
            <Box separator="all">
              <FormField label="Venue" htmlFor="promoterVenue" />
              <Select 
                name="promoterVenue"
                options={this.state.venues}
                value={this.state.selectedVenue}
                onChange={this.onVenueChange}
                />
              <FormField label="Name" htmlFor="tableTypeName">
                <input id="tableTypeName" type="text" onChange={this.setName} value={this.state.name}/>
              </FormField>
            </Box>
            {this.renderEventVars()}
            <Box size={{width: 'medium'}} align="center">
              <Button label="Add Event" primary={true} onClick={this.addEvent} />
            </Box>
          </fieldset>
        </FormFields>
        <Footer pad={{"vertical": "medium"}}>
        {
          this.state.tableTypeId !== null ? 
          <Heading align="center">
            <Button label="Save Changes" primary={true} onClick={this.submitSave} />
            <Button label="Delete" primary={true} onClick={this.submitDelete} />
          </Heading>
          : 
          <Heading align="center">
            <Button label="Create Table Type" primary={true} onClick={this.submitCreate} />
          </Heading>
        }
        </Footer>
      </Form>
    </Box>

  </Box>
  );
  }
}

ManageTableTypesPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default cssModules(ManageTableTypesPage, styles);
