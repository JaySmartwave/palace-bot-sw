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
import Select from 'react-select';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET, CLOUDINARY_UPLOAD_URL } from '../../constants';
import Immutable from 'immutable';
import _ from 'underscore';
class ManageTablesPage extends Component {
  constructor(props) {
    super(props);
    this.handleMobile = this.handleMobile.bind(this);
    this.closeSetup = this.closeSetup.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.addVariant = this.addVariant.bind(this);
    this.submitSave = this.submitSave.bind(this);
    this.submitDelete = this.submitDelete.bind(this);
    this.state = {
      isMobile: false,
      tableId: props.params.table_id || null,
      confirm: false,
      name: '',
      variants: [],
      organisationId: '5800471acb97300011c68cf7',
      venues: [],
      venueId: '',
      events: [],
      eventId: '',
      selectedEvents: [],
      tableTypes: [],
      tableTypeId: undefined,
      tags: 'table',
      image: null,
      prevImage: null,
      isNewImage: null,
      prices: []
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
    // IF TABLE ID EXISTS
    if(this.props.params.table_id) {
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
        if(body.length > 0) {
          this.setState({venueId: body[0]._id});
          let ttOptions = {
            organisationId: this.state.organisationId,
            venue_id: this.state.venueId
          }
          // this.getEvents(ttOptions);
          this.getTableTypes(ttOptions);
        }
        this.setState({venues: body, events: []});
      }
    });
  }

  getEvents = (options) => {
    PartyBot.events.getEventsInOrganisation(options, (err, response, body) => {
      if(!err && response.statusCode == 200) {
        if(body.length > 0) {
          this.setState({eventId: body[0]._id});
        }
        body.map((value, index) =>{
          this.setState({events: this.state.events.concat({ _event: value._id, name: value.name, selected: false })});
        });
      }
    });
  }

  getTableTypes = (options) => {
    PartyBot.tableTypes.getTableTypesInOrganisation(options, (errors, response, body) => {
      if(response.statusCode == 200) {
        if(body.length > 0) {
          this.setState({tableTypeId: body[0]._id});
        }
        this.setState({tableTypes: body});
      }
    });
  }

  getTable = (options) => {
    PartyBot.products.getProductsInOrganisation(options, (error, response, body) => {
      if(response.statusCode == 200) {
        this.setState({
          name: body.name,
          image: {
            preview: body.image
          },
          prevImage: {
            preview: body.image
          },
          variants: body.prices.map((value, index) => {
            return {  _event: value._event, price: value.price }
          })
        });

      }
    });
  }

  onVenueChange = (event) => {
    let id = event.target.value;
    this.setState({ venueId: id, events: [], variants: []});
    let options = {
      organisationId: this.state.organisationId,
      venue_id: id
    };
    this.getTableTypes(options);
    // this.getEvents(options);
  }

  onEventChange = (item, index, event) => {
    let variants = Immutable.List(this.state.variants);
    let mutated = variants.set(index, { _event: event.target.value, price: item.price});
    this.setState( { variants: mutated.toArray() } );
  }

  onPriceChange = (item, index, event) => {
    let variants = Immutable.List(this.state.variants);
    let mutated = variants.set(index, { _event: item._event, price: event.target.value});
    this.setState( { variants: mutated.toArray() } );
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
        _event_id: [],
        description: "",
        image: null,
        imageUrl: ""
      });   
    this.setState({variants:newArray})
  }

  removeVariant(index, event){ // delete variant ID
    let variants = Immutable.List(this.state.variants);
    let mutated = variants.remove(index);
  }

  onEventAdd = (index, selectedEvents) => { 
    let cloned = Immutable.List(this.state.variants);
    let anIndex = Immutable.fromJS(cloned.get(index));
    anIndex = anIndex.set('_event_id',  selectedEvents);
    let newClone = cloned.set(index, anIndex);

    let selectedEventState = Immutable.List(this.state.selectedEvents);
    let newSelectedEventState = selectedEventState.set(index, selectedEvents);
    this.setState({selectedEvents: newSelectedEventState.toJS(), variants: newClone.toJS()});
  }

  setDescrpiption = (index, event) => {
    let cloned = Immutable.List(this.state.variants);
    let anIndex = Immutable.fromJS(cloned.get(index));
    anIndex = anIndex.set('description', event.target.value);
    let newClone = cloned.set(index, anIndex);
    this.setState({variants: newClone.toJS()});
  }

  onDrop = (index, file) => {
    this.setState({ isBusy: true });
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
    .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    .field('file', file[0]);
    console.log('dragged');
    upload.end((err, response) => {
      if (err) {

      } else {
        let cloned = Immutable.List(this.state.eventVars);
        let anIndex = Immutable.fromJS(cloned.get(index));
        anIndex = anIndex.set('image', file[0]);
        anIndex = anIndex.set('imageUrl', response.body.secure_url);
        let newClone = cloned.set(index, anIndex);
        this.setState({variants: newClone.toJS(), isBusy: false});
      }
    });
  }
  onTypeChange = (event) => {
    var id = event.target.value;
    let params = {
      organisationId: this.state.organisationId,
      venueId: this.state.venueId,
      tableTypeId: id
    }

    PartyBot.tableTypes.getTableType(params, (err, response, body) => {
      let events = body._events.map((value) => {
        return value._event_id.map((avalue) => {
          return {
            value: avalue._id,
            label: avalue.name
          }  
        });
      });

      this.setState({
        tableTypeId: id,
        events: _.flatten(events)
      });

    });
  }

  setName = (event) => {
    this.setState({name: event.target.value});
  }

  getTypeOptions = () => {
    return this.state.tableTypes.map((value, index) => {
      return <option key={index} value={value._id}>{value.name}</option>;
    });
  }

  getTableVariants = () => {
    return this.state.variants.map((value, index) => {
      return (
        <Box key={index} separator="all">
          <FormField label="Event" htmlFor="events" />
          <Select 
            name="events"
            options={this.state.events.filter((x) => {
              let a = _.contains(_.uniq(_.flatten(this.state.selectedEvents)), x);
              return !a;
            })}
            value={value._event_id}
            onChange={this.onEventAdd.bind(this, index)}
            multi={true}
            />
          <FormField label="Description" htmlFor="tableTypedescription">
            <input id="tableTypedescription" type="text" onChange={this.setDescrpiption.bind(this, index)} value={value.description}/>
          </FormField>
          <FormField label="Image">
          {value.image ? 
            <Box size={{ width: 'large' }} align="center" justify="center"> 
              <div> 
                <img src={value.image.preview} width="200" />
              </div>
              <Box size={{ width: 'large' }}>
                <Button label="Cancel" onClick={this.onRemoveImage.bind(this)} plain={true} icon={<CloseIcon />}/>
              </Box>
            </Box> :
            <Box align="center" justify="center" size={{ width: 'large' }}>
              <Dropzone multiple={false} ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop.bind(this, index)} accept='image/*'>
                Drop image here or click to select image to upload. 
              </Dropzone>
            </Box>
          }
          <Button label="Remove" onClick={this.removeVariant.bind(this, index)} primary={true} float="right"/>
          </FormField>
        </Box>)
    });
    // return this.state.variants.map( (item, index) => {
    //   return <div key={index}>
    //             <FormField label="Event" htmlFor="tableName">
    //               <select id="tableVenue" onChange={this.onEventChange.bind(this, item, index)} value={item._event||this.state.events[0]._event}>
    //               {
    //                 this.state.events.map( (value, index) => {
    //                   return (<option key={index} value={value._event}>{value.name}</option>)
    //                 })
    //               }
    //               </select>
    //             </FormField>
    //             <FormField label="Price(Php)" htmlFor="tablePrice">
    //               <input type="number" onChange={this.onPriceChange.bind(this, item, index)} value={item.price}/>
    //             </FormField>
    //             <Footer pad={{"vertical": "small"}}>
    //                <Heading align="center">
    //                 <Button className={styles.eventButton} label="Update" primary={true} onClick={() => {}} />
    //                 <Button className={styles.eventButton} label="Remove" onClick={this.removeVariant.bind(this, index)} />
    //                </Heading>
    //              </Footer>
    //          </div>;
    // });
  }

  onDrop(file) {
    this.setState({
       image: file[0],
       isNewImage: true
     });
  }
  onRemoveImage = () => {
    this.setState({
      image: null,
      isNewImage: false
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
    let delParams = {
      organisationId: this.state.organisationId,
      productId: this.state.tableId
    };
    PartyBot.products.deleteProduct(delParams, (error, response, body) => {
      if(!error && response.statusCode == 200) {
        this.setState({
          confirm: true
        });
      } else {

      }
    });
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
          venueId: this.state.venueId,
          table_type: this.state.tableTypeId,
          image: imageLink || this.state.prevImage.preview,
          prices: this.state.variants

        };
        PartyBot.products.update(updateParams, (errors, response, body) => {
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
    console.log(this.state);
    let params = {};
    // this.handleImageUpload(this.state.image, (err, imageLink) => { 
    //   if(err) {
    //     console.log(err);
    //   } else {
    //     let createParams = {
    //       name: this.state.name,
    //       organisationId: this.state.organisationId,
    //       venueId: this.state.venueId,
    //       tags: this.state.tags,
    //       table_type: this.state.tableTypeId,
    //       image: imageLink,
    //       prices: this.state.variants
    //     };

    //     PartyBot.products.create(createParams, (errors, response, body) => {
    //       if(response.statusCode == 200) {
    //         this.setState({
    //           confirm: true
    //         });
    //       }
    //     });
    //   }
    // });
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
      <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css"/>
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
        <Box>
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
        <Box size={{ width: 'large' }} direction="row" justify="center" align="center" wrap={true} margin="small">
  				<Form>
    				<FormFields>
    					<fieldset>
    					  <FormField label="Venue" htmlFor="tableVenue">
    					    <select id="tableVenue" onChange={this.onVenueChange} value={this.state.venueId}>
                  {this.state.venues.map((value, index) => {
                    return <option key={index} value={value._id}>{value.name}</option>;
                  })}
    						  </select>
    					  </FormField>
    					  <FormField label="Table Type" htmlFor="tableType">
    					    <select id="tableType" onChange={this.onTypeChange} value={this.state.tableTypeId}>
                  {this.state.tableTypes.map((value, index) => {
                    return <option key={index} value={value._id}>{value.name}</option>;
                  })}
    						  </select>
    					  </FormField>
    					  <FormField label=" Name" htmlFor="tableName">
    					    <input id="tableName" type="text" onChange={this.setName} value={this.state.name}/>
    					  </FormField>
            {
            //Dynamic Price/Event Component
            this.getTableVariants()
            }
              <Button label="Add Event" primary={true} onClick={this.addVariant} />
              </fieldset>
            </FormFields>
            <Footer pad={{"vertical": "medium"}}>
            {
              this.state.tableId !== null ? 
              <Heading align="center">
                <Button label="Save Changes" primary={true} onClick={this.submitSave} />
                <Button label="Delete" primary={true} onClick={this.submitDelete} />
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
