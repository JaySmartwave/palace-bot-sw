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
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET, CLOUDINARY_UPLOAD_URL } from '../../constants';

class ManageTableTypesPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.closeSetup = this.closeSetup.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
    this.onVenueAdd = this.onVenueAdd.bind(this);
    this.setName = this.setName.bind(this);
    this.submitCreate = this.submitCreate.bind(this);
    this.submitSave = this.submitSave.bind(this);
    this.state = {
      organisationId: '5800471acb97300011c68cf7',
      no_of_pax: null,
      isMobile: false,
      image: null,
      tableTypeId: null,
      confirm: false,
      name: '',
      tags: 'tabletypes',
      venues: [],
      selectedVenues: [],
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

  onVenueAdd(selectedVenues) {
    this.setState({ selectedVenues });
  }

  closeSetup(){
    this.setState({
     confirm: false
   });
    this.context.router.push('/table-types');
  }

  setName(event) {
    this.setState({name: event.target.value});
  }

  setNoOfPax = (event) => {
    this.setState({no_of_pax: event.target.value});
  };
  onDrop(file) {
    this.setState({
       image: file[0]
     });
  }
  onRemoveImage() {
    this.setState({
      image: null
    });
  }

  submitSave() {
    console.log("Trigger Save");
  }

  handleImageUpload = (file, callback) => {
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
  }

  submitCreate(event) {
    event.preventDefault();
    let venuesArr = this.state.selectedVenues.map(function(value, index) {
      return value.value;
    });
    this.handleImageUpload(this.state.image, (err, imageLink) => {
      if (err) {
        console.log(err);
      } else {
        let objState = this.state;
        let createParams = { 
          organisationId: this.state.organisationId,
          venue_id: venuesArr,
          name: this.state.name,
          no_of_pax: this.state.no_of_pax,
          image: imageLink
        };
        PartyBot.tableTypes.create(createParams, (err, response, body) => {
          if(response.statusCode == 200) {
            this.setState({
              confirm: true
            });
          }
        });
      }
    });
  }

  getVenues(options) {
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
      <div className={styles.container}>
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
      <Box pad={{ vertical: 'medium' }}>
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
			<Box direction="row" justify="center" align="center" wrap={true} pad="small	" margin="small">
				<Form>
				<FormFields>
					<fieldset>
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
					  <FormField label="Name" htmlFor="tableTypeName">
					    <input id="tableTypeName" type="text" onChange={this.setName}/>
					  </FormField>
					  <FormField label="No. of Pax" htmlFor="tablePax">
					    <NumberInput id="tablePax" min={0} max={99} onChange={this.setNoOfPax}/>
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
           {
            this.state.tableTypeId !== null ? 
             <Heading align="center">
             <Button label="Save Changes" primary={true} onClick={this.submitSave} />
             </Heading>
             : 
             <Heading align="center">
             <Button label="Create Table Type" primary={true} onClick={this.submitCreate} />
             </Heading>
           }
           </Footer>
				   </Form>
           </Box>
           </div>
           );
  }
}

ManageTableTypesPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default cssModules(ManageTableTypesPage, styles);
