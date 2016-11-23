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
import request from 'superagent';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET, CLOUDINARY_UPLOAD_URL } from '../../constants';

class ManageTablesPage extends Component {
  constructor(props) {
    super(props);
    this.handleMobile = this.handleMobile.bind(this);
    this.getTableVariants = this.getTableVariants.bind(this);
    this.closeSetup = this.closeSetup.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
    this.onEventChange = this.onEventChange.bind(this);
    this.getEventOptions = this.getEventOptions.bind(this);
    this.addVariant = this.addVariant.bind(this);
    this.removeVariant = this.removeVariant.bind(this);
    this.submitSave = this.submitSave.bind(this);
    this.state = {
      isMobile: false,
      tableId: props.params.table_id || null,
      confirm: false,
      name: '',
      variants: [],
      organisationId: '5800471acb97300011c68cf7',
      venues: [],
      venueId: null,
      tableTypes: [],
      tableTypeId: null,
      tags: 'table',
      image: null,
      prevImage: null,
      isNewImage: null
    };
  }

  componentWillMount() {
    if (this.state.tableId) {
      this.setState({variants: []});
    }
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleMobile);
    }

    let options = {
      organisationId: this.state.organisationId
    };

    this.getVenues(options);
    let ttOptions = {
      organisationId: this.state.organisationId,
      venue_id: this.state.venueid
    }
    this.getTableTypes(ttOptions);
    // IF TABLE ID EXISTS
    if(this.props.params.table_id) {
      console.log(this.props.params.table_id)
      let tOptions = {
        organisationId: this.state.organisationId,
        productId: this.props.params.table_id
      }
      this.getTable(tOptions);
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
  };

  getVenues = (options) => {
    PartyBot.venues.getAllInOrganisation(options, (errors, response, body) => {
      if(response.statusCode == 200) {
        if(body > 0) {
          this.setState.venueId = body[0]._id;
        }
        this.setState({venues: body});
      }
    });
  }

  getTableTypes = (options) => {
    PartyBot.tableTypes.getTableTypesInOrganisation(options, (errors, response, body) => {
      if(response.statusCode == 200) {
        this.setState({tableTypes: body});
      }
    });
  }

  getTable = (options) => {
    PartyBot.products.getProductsInOrganisation(options, (error, response, body) => {
      if(response.statusCode == 200) {
        console.log(body);
        this.setState({
          name: body.name,
          image: {
            preview: body.image
          },
          prevImage: {
            preview: body.image
          }
        });
      }
    });
  }

  onVenueChange = (event) => {
    let id = event.target.value;
    this.setState({ venueId: id});
    let options = {
      organisationId: this.state.organisationId,
      venue_id: id
    };
    this.getTableTypes(options);
  }

  getVenueOptions = () => {
    return this.state.venues.map((value, index) => {
      return <option key={index} value={value._id}>{value.name}</option>;
    });
  }

  onEventChange(event) {
    var id = event.nativeEvent.target.selectedIndex;
    //this.setState or props
  }

  getEventOptions(){
    // return EVENTS.map(function (item) {
    //   return <option key={item.eventId} value={item.eventId}>{item.eventName}</option>;
    // }.bind(this));
  }

  closeSetup(){
    this.setState({
     confirm: false
   });
    this.context.router.push('/tables');
  }

  addVariant() { // will create then get?
    var newArray = this.state.variants.slice();    
    newArray.push({ 
        variantId: Math.floor(Math.random() * 999) + 1  , //auto increment
        eventId: '001', // default value
        tablePrice: 0 // default value
      });   
    this.setState({variants:newArray})
  }

  removeVariant(){ // delete variant ID
      console.log(this.props.id)
  }

  onTypeChange = (event) => {
    var id = event.target.value;

    this.setState({tableTypeId: id});
    //this.setState
  }

  setName = (event) => {
    this.setState({name: event.target.value});
  }

  getTypeOptions = () => {
    return this.state.tableTypes.map((value, index) => {
      return <option key={index} value={value._id}>{value.name}</option>;
    });
  }

  getTableVariants(){
    return this.state.variants.map(function (item) {
      return <div key={item.variantId}>
                <FormField label="Event" htmlFor="tableName">
                  <select id="tableVenue" onChange={this.setName}>
                    {this.getEventOptions()}
                  </select>
                </FormField>
                <FormField label="Price(Php)" htmlFor="tablePrice">
                  <input id="tablePrice" type="number" value={item.tablePrice} onChange={this.onEventChange}/>
                </FormField>
                <Footer pad={{"vertical": "small"}}>
                   <Heading align="center">
                    <Button className={styles.eventButton} label="Update" primary={true} onClick={this.onEventChange} />
                    <Button id={item.variantId} className={styles.eventButton} label="Remove" onClick={this.removeVariant} />
                   </Heading>
                 </Footer>
             </div>;
    }.bind(this));
  }

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

  submitSave() {
    event.preventDefault();
    this.handleImageUpload(this.state.image, (err, imageLink) => { 
      if(err) {
        console.log(err);
      } else {
        let updateParams = {
          name: this.state.name,
          organisationId: this.state.organisationId,
          productId: this.state.tableId,
          // venueId: this.state.venueId,
          // tags: this.state.tags,
          // table_type: this.state.tableTypeId,
          image: imageLink || this.state.prevImage.preview
        };
        console.log(updateParams);
        PartyBot.products.update(updateParams, (errors, response, body) => {
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
    event.preventDefault();
    this.handleImageUpload(this.state.image, (err, imageLink) => { 
      if(err) {
        console.log(err);
      } else {
        let createParams = {
          name: this.state.name,
          organisationId: this.state.organisationId,
          venueId: this.state.venueId,
          tags: this.state.tags,
          table_type: this.state.tableTypeId,
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
      variants,
    } = this.state;
    return (
      <div className={styles.container}>
      {this.state.confirm !== false ? 
      <Layer align="center">
        <Header>
            Table successfully created.
        </Header>
        <Section>
          <Button label="Close" onClick={this.closeSetup} plain={true} icon={<CloseIcon />}/>
        </Section>
      </Layer>
      :
      null
      }
      <Box pad={{ vertical: 'medium' }}>
        {this.state.tableId !== null ? 
    	<Heading align="center">
            Edit Table
        </Heading>
        : 
    	<Heading align="center">
            Add Table
        </Heading>
    	}
          </Box>
			<Box direction="row" justify="center" align="center" wrap={true} pad="small	" margin="small">
				<Form>
				<FormFields>
					<fieldset>
					  <FormField label="Venue" htmlFor="tableVenue">
					    <select id="tableVenue" onChange={this.onVenueChange}>
              {this.state.venues.map((value, index) => {
                return <option key={index} value={value._id}>{value.name}</option>;
              })}
						  </select>
					  </FormField>
					  <FormField label="Table Type" htmlFor="tableType">
					    <select id="tableType" onChange={this.onTypeChange}>
              {this.state.tableTypes.map((value, index) => {
                return <option key={index} value={value._id}>{value.name}</option>;
              })}
						  </select>
					  </FormField>
					  <FormField label=" Name" htmlFor="tableName">
					    <input id="tableName" type="text" onChange={this.setName} value={this.state.name}/>
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
            <br/>
            <Box>
            Pricing:
            </Box>
            <Button label="Add Event" primary={true} onClick={this.addVariant} />
            <br/>
            <br/>
            {
            //Dynamic Price/Event Component
            this.getTableVariants()
            }
            {/*<FormField label="Event" htmlFor="tableName">
              <select id="tableVenue" onChange={this.onVenueChange}>
                {this.getEventOptions()}
              </select>
            </FormField>
            <FormField label="Price(Php)" htmlFor="tablePrice">
              <input id="tablePrice" type="number" value={0} onChange={this.testFunc}/>
            </FormField>
            <FormField>
              <Footer>
               <Heading align="center">
               <Button className={styles.eventButton} label="Save" primary={true} onClick={this.testFunc} />
               <Button className={styles.eventButton} label="Remove" onClick={this.testFunc} />
               </Heading>
             </Footer>
            </FormField>
            */}
           <Footer pad={{"vertical": "medium"}}>
           {
            this.state.tableId !== null ? 
             <Heading align="center">
             <Button label="Save Changes" primary={true} onClick={this.submitSave} />
             </Heading>
             : 
             <Heading align="center">
             <Button label="Create Table" primary={true} onClick={this.submitCreate} />
             </Heading>
           }
           </Footer>
				   </Form>
           </Box>
           </div>
           );
  }
}

ManageTablesPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default cssModules(ManageTablesPage, styles);
