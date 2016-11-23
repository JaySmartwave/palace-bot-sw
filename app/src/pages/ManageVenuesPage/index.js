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
import Layer from 'grommet/components/Layer';
import Header from 'grommet/components/Header';
import Section from 'grommet/components/Section';
import Paragraph from 'grommet/components/Paragraph';
import request from 'superagent';
import _ from 'underscore';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET, CLOUDINARY_UPLOAD_URL } from '../../constants';
const organisationId = '5800471acb97300011c68cf7';
class ManageVenuesPage extends Component {
  constructor() {
    super();
    // this.handleMobile = this.handleMobile.bind(this);
    // this.handleCalendar = this.handleCalendar.bind(this);
    this.onEventChange = this.onEventChange.bind(this);
    this.closeSetup = this.closeSetup.bind(this);
    this.onDrop = this.onDrop.bind(this);
    // this.onRemoveImage = this.onRemoveImage.bind(this);
    // this.setName = this.setName.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.setAddress = this.setAddress.bind(this);
    this.submitCreate = this.submitCreate.bind(this);
    this.submitSave = this.submitSave.bind(this);
    this.delete = this.delete.bind(this);
    this.state = {
      organisationId: '5800471acb97300011c68cf7',
      isMobile: false,
      image: null,
      prevImage: {},
      venueId: null,
      name: 'Name',
      description: 'Description',
      location: { address: 'Address' },
      confirm: false,
      isNewImage: false
    };
  }

  componentWillMount(){

  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleMobile.bind(this));
    }
    let paramsVenueId = this.props.params.venueId
    if (paramsVenueId) {
      let options = {
        organisationId: this.state.organisationId,
        venueId: paramsVenueId
      }
      PartyBot.venues.getWithOriganisationIdAndVenueId(options, (err, response, body) => {
        console.log("Success getVenue");
        if(!err && response.statusCode == 200) {
          this.setState({
            name: body.name,
            description: body.description,
            location: body.location,
            venueId: paramsVenueId,
            image: {
              preview: body.image
            },
            prevImage : {
              preview: body.image
            }
          })
        }
      });
    }
  }
  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleMobile.bind(this));
    }
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
  onDrop(file) {
    this.setState({
       image: file[0],
       isNewImage: true
     });
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
  closeSetup() {
    this.setState({
      confirm: false
    });
    this.context.router.push('/venues');
  }
  onRemoveImage() {
    this.setState({
      image: this.state.prevImage,
      isNewImage: false
    });
  }
  setName(event) {
    this.setState({name: event.target.value});
  }
  setDescription(event) {
    this.setState({ description: event.target.value });
  }
  setAddress(event) {
    this.setState({
      location: { address: event.target.value }
    });
  }
  submitCreate(event) {
    event.preventDefault();
    this.handleImageUpload(this.state.image, (err, imageLink) => {
      if (err) {
        console.log(err);
      } else {
        let objState = this.state;
        let createParams = { 
          organisationId: organisationId, 
          name: this.state.name,
          description: this.state.description,
          location: this.state.location,
          image: imageLink
        };
        PartyBot.venues.create(createParams, (err, response, body) => {
          if(response.statusCode == 200) {
            this.setState({
              confirm: true
            });
          }
        });
      }
    });
  }

  submitSave(event) {
    event.preventDefault();
    this.handleImageUpload(this.state.image, (err, imageLink) => {
      if (err) {
        console.log(err);
      } else {
        let objState = this.state;
        let updateParams = { 
          venueId: this.state.venueId,
          name: this.state.name,
          description: this.state.description,
          location: this.state.location,
          image: imageLink || this.state.prevImage.preview
        };
        PartyBot.venues.updateWithId(updateParams, (error, response, body) => {
          if(!error && response.statusCode == 200) {
            this.setState({
              confirm: true
            });
          }
        });
      }
    });
  }

  delete = (event) => {
    event.preventDefault();
    let params = _.pick(this.state, ['organisationId', 'venueId']);
    PartyBot.venues.deleteWithId(params, (error, response, body) => {
      console.log(error);
      console.log(response.statusCode);
      console.log(body);
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
      image,
    } = this.state;
    return (
      <div className={styles.container}>
        <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css" />
        {this.state.confirm !== false ? 
        <Layer align="center">
          <Header>
            Venue successfully created.
          </Header>
          <Section>
            <Button label="Close" onClick={this.closeSetup} plain={true} icon={<CloseIcon />}/>
          </Section>
        </Layer>:null
        }
        <Box>{/* pad={{ vertical: 'medium' }} */}
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
                  <input id="venueName" type="text" onChange={this.setName.bind(this)} value={this.state.name} />
                </FormField>
                <FormField label="Description" htmlFor="venueDescription">
                  <input id="venueDescription" type="text" onChange={this.setDescription} value={this.state.description} />
                </FormField>
                  <FormField label="Address" htmlFor="venueAddress">
                    <input id="venueAddress" type="text" onChange={this.setAddress} value={this.state.location.address}/>
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
            {this.state.venueId !== null ? 
              <Heading align="center">
                <Button label="Save Changes" primary={true} onClick={this.submitSave.bind(this)} />
                <Button label="Delete" primary={true} onClick={this.delete.bind(this)} />
              </Heading>
              : 
              <Heading align="center">
                <Button label="Create Venue" primary={true} onClick={this.submitCreate.bind(this)} />
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
