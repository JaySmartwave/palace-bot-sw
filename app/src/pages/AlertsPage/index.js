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

import Dropzone from 'react-dropzone';

class AlertsPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.state = {
      organisationId: '5800471acb97300011c68cf7',
      isMobile: false,
      files: [],
      venues: [],
      text: '',
      image: null
    };
  }
  componentWillMount() {

  }
  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleMobile);
    }
    let params = {
      organisationId: this.state.organisationId
    };
    PartyBot.venues.getAllInOrganisation(params, (err, response, body) => {
      if(!err && response.statusCode == 200) {
        let options = body.unshift({_id: null, name:'Select Venue'});
        this.setState({venues: body});
      }
    });
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

  onVenueChange = (event) => {
    let venueId = event.nativeEvent.target.selectedIndex;
    let venueCode = event.nativeEvent.target[venueId].value;
    this.setState({
      selectedVenue: venueCode
    });
  }

  getVenueOptions = () => {
    let stateVenues = this.state.venues;

    return stateVenues.map(function(venue, i) {

      // console.log(venue);
      return (
        <option key={i} value={venue._id}> {venue.name} </option>
        );
      // return venue.map(function(venueData, j) {
      //   console.log(venueData);
      // });
      // return <option key={item._id} value={item.value}> {item.label} </option>;

    });
  }

  onChangeText = (event) => {
    this.setState({
      text: event.target.value
    });
  };

  sendAlert = (event) => {
    let params = {
      organisationId: this.state.organisationId,
      channel: 'facebook',
      fb_page_access_token: 'EAANW2ZALpyZAABAKUoLUhNOhbPvZAgUtPfQ8TZCKfL66jTZBf3zIruIK8veysLrH1hyWCVXbpYtNZAaZA6kK8tvE2FeFsxIJQKK2DVeZBRHOY8I8Eh3B6crAYrMxZBaRomnyzZAI2YyaInG20pCZAp6rwhRwEgDK8VnCbZCYRfZA3cfaVpwZDZD',
      message: this.state.text
    };

    PartyBot.sender.sendMessageToSenders(params, (err, response, body) => {
      console.log(err);
      console.log(response.statusCode);
      console.log(body);
    });
  }

  onDrop(file) {
    this.setState({
       image: file[0],
       isNewImage: true
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
    } = this.state;
    return (
      <div className={styles.container}>
        <Box>
    	<Heading align="center" uppercase>
            Alerts
        </Heading>
          </Box>
			<Box direction="row" justify="center" align="center" wrap={true} margin="small">
				<Form>
				<FormFields>
					<fieldset>
					  <FormField label="Text" htmlFor="alertName">
					    <input id="alertName" type="text" onChange={this.onChangeText} value={this.state.text}/>
					  </FormField>
					  <FormField label="Link" htmlFor="alertLink">
					    <input id="alertLink" type="text"/>
					  </FormField>
               <FormField label="Venue" htmlFor="alertVenue">
                <select name="venueAlert"
                  onChange={this.onVenueChange}>
                  {this.getVenueOptions()}
                </select>
            </FormField>
						  <FormField label="Picture">
						   <Box direction="row" justify="center" align="center">
							   	<Dropzone multiple={false} ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop}>
				                    Drop image here or click to select image to upload. 
				                </Dropzone>
			                </Box>
			                {this.state.files.length > 0 ? <div>
			                Preview:
			                <div>{this.state.files.map((file) => <img src={file.preview} /> )}</div>
			                </div> : null}
					  </FormField>
					</fieldset>
				</FormFields>
				  <Footer pad={{"vertical": "medium"}}>
				    	<Heading align="center">
				            <Button label="Send" primary={true} onClick={this.sendAlert} />
				        </Heading>
				  </Footer>
				</Form>
			</Box>
      </div>
    );
  }
}

AlertsPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default cssModules(AlertsPage, styles);
