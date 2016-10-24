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

let organisationId =  "5800471acb97300011c68cf7";
let venueId = "5800889684555e0011585f3c";

const VARIANTS =[
                  { 
                    variantId: '001',
                    eventId: '003',
                    tablePrice: 3000
                  },
                  { 
                    variantId: '002',
                    eventId: '002',
                    tablePrice: 2000
                  }
                ] 

const EVENTS =[
                  { 
                    eventId: '001',
                    eventName: 'Overtime'
                  },
                  { 
                    eventId: '002',
                    eventName: 'Game On'
                  },
                  { 
                    eventId: '003',
                    eventName: 'Kate Mess'
                  },
                ]     

class ManageTablesPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.getTableVariants = this.getTableVariants.bind(this);
    this.closeSetup = this.closeSetup.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.setName = this.setName.bind(this);
    this.getTypeOptions = this.getTypeOptions.bind(this);
    this.onVenueChange = this.onVenueChange.bind(this);
    this.getVenueOptions = this.getVenueOptions.bind(this);
    this.onEventChange = this.onEventChange.bind(this);
    this.getEventOptions = this.getEventOptions.bind(this);
    this.addVariant = this.addVariant.bind(this);
    this.removeVariant = this.removeVariant.bind(this);
    this.submitCreate = this.submitCreate.bind(this);
    this.submitSave = this.submitSave.bind(this);
    this.state = {
      isMobile: false,
      files: [],
      tableId: null,
      confirm: false,
      name: '',
      variants: [{ 
        eventId: '001',
        tablePrice: 0
      }],
      organisationId: organisationId,
      venueId: venueId,
      tags: 'table',
    };
  }

  componentWillMount() {
    if (this.state.tableId !== 'null') {
      this.setState({variants: VARIANTS});
    }
  }

  componentDidMount() {
    console.log(this.state.tableId);

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

  onVenueChange(event) {
    var id = event.nativeEvent.target.selectedIndex;
    console.log('Selected Venue' + event.nativeEvent.target[id].value);
    //this.setState or props
  }

  getVenueOptions(){
    return ["Valkyrie","Pool Club","Revel","Naya"].map(function (item) {
      return <option key={item} value={item}>{item}</option>;
    }.bind(this));
  }

  onEventChange(event) {
    var id = event.nativeEvent.target.selectedIndex;
    console.log('Selected Event' + event.nativeEvent.target[id].value);
    //this.setState or props
  }

  getEventOptions(){
    return EVENTS.map(function (item) {
      return <option key={item.eventId} value={item.eventId}>{item.eventName}</option>;
    }.bind(this));
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

  onTypeChange(event) {
    var id = event.nativeEvent.target.selectedIndex;
    console.log('Selected Table:' + event.nativeEvent.target[id].value);
    //this.setState
  }

  setName(event) {
    this.setState({name: event.nativeEvent.target.value});
  }

  getTypeOptions(){
    return ["Couch","Cabana","Magnum Couch","Skybox"].map(function (item) {
      return <option key={item} value={item}>{item}</option>;
    }.bind(this));
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

  submitSave() {
    console.log("Trigger Save");
  }

  submitCreate() {
   let params = _.pick(this.state, ['name', 'organisationId', 'venueId', 'tags']);
   let cl = console.log;
   PartyBot.products.create(params, function(errors, response, body) {
      cl("Errors: "+JSON.stringify(errors, null, 2) || null);
      cl("Response status code: "+response.statusCode || null);
      cl("Body: "+JSON.stringify(body) || null);

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
                {this.getVenueOptions()}
						  </select>
					  </FormField>
					  <FormField label="Table Type" htmlFor="tableType">
					    <select id="tableType" onChange={this.onTypeChange}>
						    {this.getTypeOptions()}
						  </select>
					  </FormField>
					  <FormField label=" Name" htmlFor="tableName">
					    <input id="tableName" type="text" onChange={this.setName}/>
					  </FormField>
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
