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
import CloseIcon from 'grommet/components/icons/base/Close';
import Dropzone from 'react-dropzone';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import Layer from 'grommet/components/Layer';
import Header from 'grommet/components/Header';
import Section from 'grommet/components/Section';
import Paragraph from 'grommet/components/Paragraph';
import request from 'superagent';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET, CLOUDINARY_UPLOAD_URL } from '../../constants';

let organisationId =  "5800471acb97300011c68cf7";

class ManageTicketsPage extends Component {
  constructor(props) {
    super(props);
    this.handleMobile = this.handleMobile.bind(this);
    this.onVenueChange = this.onVenueChange.bind(this);
    this.getEventOptions = this.getEventOptions.bind(this);
    this.onEventChange = this.onEventChange.bind(this);
    this.closeSetup = this.closeSetup.bind(this);
    this.setName = this.setName.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setUrl = this.setUrl.bind(this);
    this.submitDelete = this.submitDelete.bind(this);
    this.submitSave = this.submitSave.bind(this);
    this.submitCreate = this.submitCreate.bind(this);
    this.state = {
      isMobile: false,
      events: [],
      ticketId: props.params.ticket_id || null, // id mock test
      name: '',
      description: '',
      ticket_url: '',
      selectedEvent: '',
      selectedVenue: null,
      tags: 'ticket',
      confirm: false,
      organisationId: organisationId,
      venueId: null,
      venues: [],
      image: null,
      prevImage: null,
      isNewImage: null
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

    if(this.props.params.ticket_id) {
      let tOptions = {
        organisationId: this.state.organisationId,
        productId: this.props.params.ticket_id
      };

      this.getTicket(tOptions);
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
  
  getVenues = (options) => {
    PartyBot.venues.getAllInOrganisation(options, (errors, response, body) => {
      if(response.statusCode == 200) {
        if(body.length > 0) {
          this.setState({ selectedVenue: body[0]._id})
        }
        this.setState({venues: body});
      }
    });
  }
  getTicket = (options) => {
    PartyBot.products.getProducts(options, (errors, response, body) => {
      if(response.statusCode == 200) {
        console.log(body);
        this.setState({
          name: body.name,
          description: body.description,
          ticket_url: body.ticket_url,
          venueId: body._venue_id,
          selectedVenue: body._venue_id,
          image: {
            preview: body.image
          },
          prevImage: {
            preview: body.image
          },
        });
      }
    });
  }

  closeSetup(){
    this.setState({
     confirm: false
   });
    this.context.router.push('/tickets');
  }

  onVenueChange(event) {
    let venueId = event.nativeEvent.target.selectedIndex;
    let venueCode = event.nativeEvent.target[venueId].value;
    console.log('Selected Venue: ' + venueCode);
    this.setState({
      selectedVenue: venueCode
    });
  }

  getEventOptions(){
    
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
  setUrl(event) {
    this.setState({ticket_url: event.target.value});
  }
  onDrop = (file) => {
    this.setState({
     image: file[0],
     isNewImage: true
   });
  }
  onRemoveImage = () => {
    this.setState({
      image: this.state.prevImage,
      isNewImage: false
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
          console.log(response.body.secure_url);
          callback(null, response.body.secure_url)
        } else {
          callback(err, '');
        }
      });
    } else {
      callback(null, null);
    }
  }

  submitDelete() {
    event.preventDefault();
    let delParams = {
      organisationId: this.state.organisationId,
      productId: this.state.ticketId
    };
    PartyBot.products.deleteProduct(delParams, (error, response, body) => {
      if(!error && response.statusCode == 200) {
        console.log(error);
        console.log(response);
        console.log(body);
        this.setState({
          confirm: true
        });
      } else {

      }
    });
  }

  submitSave() {
    console.log("Save Clicked!");
    this.handleImageUpload(this.state.image, (err, imageLink) => { 
      if(err) {
        console.log(err);
      } else {
        let udpateParams = {
          productId: this.state.ticketId,
          name: this.state.name,
          venueId: this.state.selectedVenue,
          ticket_url: this.state.ticket_url,
          image: imageLink || this.state.prevImage.preview
        };

        PartyBot.products.update(udpateParams, (errors, response, body) => {
          console.log("Errors: "+JSON.stringify(errors, null, 2) || null);
          console.log("Response status code: "+response.statusCode || null);
          console.log("Body: "+JSON.stringify(body) || null);

          if(response.statusCode == 200) {
            this.setState({
              confirm: true
            });
          }
        });
      }
    });
  }
  submitCreate = () => {
    console.log("Create Clicked!");
    this.handleImageUpload(this.state.image, (err, imageLink) => { 
      if(err) {
        console.log(err);
      } else {
        let createParams = {
          name: this.state.name,
          organisationId: this.state.organisationId,
          venueId: this.state.selectedVenue,
          tags: this.state.tags,
          ticket_url: this.state.ticket_url,
          image: imageLink
        };

        PartyBot.products.create(createParams, (errors, response, body) => {
          console.log("Errors: "+JSON.stringify(errors, null, 2) || null);
          console.log("Response status code: "+response.statusCode || null);
          console.log("Body: "+JSON.stringify(body) || null);

          if(response.statusCode == 200) {
            this.setState({
              confirm: true
            });
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
            Ticket successfully created.
            </Header>
            <Section>
              <Button label="Close" onClick={this.closeSetup} plain={true} icon={<CloseIcon />} />
            </Section>
          </Layer> : null
        }
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
                  <input id="ticketName" type="text" onChange={this.setName} value={this.state.name}/>
                </FormField>
                <FormField label="Description" htmlFor="ticketDesc">
                  <input id="ticketDescription" type="text" onChange={this.setDescription} value={this.state.description}/>
                </FormField>
                <FormField label="URL" htmlFor="ticketUrl">
                  <input id="ticketUrl" type="text" onChange={this.setUrl} value={this.state.ticket_url}/>
                </FormField>
                <FormField label="Venue" htmlFor="ticketVenue">
                  <select id="ticketVenue" onChange={this.onVenueChange} value={this.state.selectedVenue}>
                  {
                    this.state.venues.map((value, index) => {
                      return <option key={index} value={value._id}>{value.name}</option> 
                    })
                  }
                  </select>
                </FormField>
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
            {this.state.ticketId !== null ? 
              <Heading align="center">
                <Button label="Save Changes" primary={true} onClick={this.submitSave} />
                <Button label="Delete" primary={true} onClick={ this.submitDelete } />
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
