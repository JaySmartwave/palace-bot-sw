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

    /*const EVENTS = [ // GET all events
    { value: '001', label: 'Girls Just Wanna Have Fun' }, // value = event.id // label = event.name?
    { value: '002', label: 'Kate Mess' },
    { value: '003', label: 'Game On'},
    { value: '004', label: 'Overtime'}
    ];*/

    const organisationId = '57f3a273f760e4f8ad97eec5';

    class ManageVenuesPage extends Component {
      constructor() {
        super();
        // this.handleMobile = this.handleMobile.bind(this);
        // this.handleCalendar = this.handleCalendar.bind(this);
        this.onEventChange = this.onEventChange.bind(this);
        this.closeSetup = this.closeSetup.bind(this);
        // this.onDrop = this.onDrop.bind(this);
        // this.onRemoveImage = this.onRemoveImage.bind(this);
        // this.setName = this.setName.bind(this);
        // this.setDescription = this.setDescription.bind(this);
        // this.setAddress = this.setAddress.bind(this);
        this.submitCreate = this.submitCreate.bind(this);

        const organisationId = '57f3a273f760e4f8ad97eec5';

        this.state = {
          isMobile: false,
          image: [],
          venueId: null, // id mock test
          name: '',
          description: '',
          address: '',
          confirm: false
          //events: EVENTS,
          //value: []
        };
      }

      componentWillMount(){

        let paramsVenueId = this.props.params.venueId

        // console.log(paramsVenueId);

        if (paramsVenueId != null) {

          // Get Venue with Organisation Id and Venue Id 
          PartyBot.venues.getWithOriganisationIdAndVenueId(organisationId, paramsVenueId, function(err, response, body) {

            console.log(response.statusCode);
            console.log(body);
            console.log(err);

            if(!err && response.statusCode == 200) {
              this.setState({
                name: body.name,
                description: body.description,
                venueId: paramsVenueId
              })
            }
          }.bind(this));
        }
      }

      componentDidMount() {
        if (typeof window !== 'undefined') {
          window.addEventListener('resize', this.handleMobile.bind(this));
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
         image: file
       });
        console.log(file[0]);
      }
      closeSetup(){
        this.setState({
         confirm: false
       });
        this.context.router.push('/venues');
      }
      onRemoveImage() {
        this.setState({
          image: []
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
          address: event.target.value
        });
      }
      submitCreate() {

        var objState = this.state;
        var createParams = {
          organisationId: organisationId,
          name: objState.name,
          // description: objState.description,
          location: {
            address: objState.address
          }
          // can't upload for now
          // image: objState.image[0].preview
        };

        console.log(createParams);
        // return;

        PartyBot.venues.create(createParams, function(err, response, body) {

          console.log(createParams);

          console.log(response.statusCode);
          console.log(body);

          if(response.statusCode == 200) {
            console.log('Venue Created.');
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
          image,
        } = this.state;

    // console.log(image);

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
      </Layer>
      :
      null
      }
      <Box pad={{ vertical: 'medium' }}>
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
      {/*
      <FormField label="Description" htmlFor="venueDescription">
      <input id="venueDescription" type="text" onChange={this.setDescription} value={this.state.description} />
      </FormField>
    */}
    <FormField label="Address" htmlFor="venueAddress">
    <input id="venueAddress" type="text" onChange={this.setAddress.bind(this)} value={this.state.address}/>
    </FormField>
      {/* 
          <FormField label="Longitude" htmlFor="venueLon">
          <input id="venueLon" type="number" />
          </FormField>
          <FormField label="Latitude" htmlFor="venueLat">
          <input id="venueLat" type="number" />
          </FormField>
        */}
      {/*
      <Box separator="all">
      <FormField label="Events" htmlFor="venueEvent"/>
      <Select 
          name="eventVenue"
          options={this.state.events}
          value={this.state.value}
          onChange={this.onEventChange} 
          multi={true}
      />
      </Box>
      <FormField label="Starts At" htmlFor="venueStarts">
      <DateTime id="venueStarts" format="M/D/YYYY" onChange={this.handleCalendar} value={this.state.calendar} />
      </FormField>
      <FormField label="Ends At" htmlFor="venueEnds">
      <DateTime id="venueEnds" format="M/D/YYYY" onChange={this.handleCalendar} value={this.state.calendar} />
    </FormField> 
  */}
  <FormField label="Image">
  {image.length > 0 ? 
    <Box align="center" justify="center">
  {/* commented out */}
    {
          /*
          <div>{image.map((file) => <img src={file.preview} /> )}</div>
          */
        }
      {/* commented out */}
      <div> 
      <img src={image[0].preview} width="200" />
      </div>
      <Box>
      <Button label="Cancel" onClick={this.onRemoveImage.bind(this)} plain={true} icon={<CloseIcon />}/>
      </Box>
      </Box> :
      <Box align="center" justify="center">
      <Dropzone multiple={false} ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop.bind(this)} accept='image/*'>
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
