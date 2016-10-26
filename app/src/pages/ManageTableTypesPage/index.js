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

const VENUES = [ // GET all events
    { value: '001', label: 'Valkyrie' }, // value = venue.id // label = venue.name?
    { value: '002', label: 'Pool Club' },
    { value: '003', label: 'Revel'}
    ];

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
      isMobile: false,
      files: [],
      tableTypeId: null,
      confirm: false,
      name: '',
      tags: 'tabletypes', //??
      venues: VENUES,
      selectedVenues: [],
    };
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

  onVenueAdd(selectedVenues) {
    console.log('You\'ve selected:', selectedVenues);
    this.setState({ selectedVenues });
  }

  getVenueOptions(){
    return ["Valkyrie","Pool Club","Revel","Naya"].map(function (item) {
      return <option key={item} value={item}>{item}</option>;
    }.bind(this));
  }

  closeSetup(){
    this.setState({
     confirm: false
   });
    this.context.router.push('/tableTypes');
  }

  setName(event) {
    this.setState({name: event.nativeEvent.target.value});
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
        this.setState({
          confirm: true
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
      :
      null
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
					    <NumberInput id="tablePax" value={0} min={0} max={99} />
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
