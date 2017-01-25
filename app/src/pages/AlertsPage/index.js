import PartyBot from 'partybot-http-client'; // Bots http client
import React, { PropTypes, Component } from 'react';
import cssModules from 'react-css-modules';
import styles from './index.module.scss';
import Layer from 'grommet/components/Layer';
import CloseIcon from 'grommet/components/icons/base/Close';
import Header from 'grommet/components/Header';
import Section from 'grommet/components/Section';
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
      image: null,
      selectedVenue: "",
      confirm: false,
      action: "not sent"
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

    let selectOptions = [{
      fb_page_access_token: "EAANW2ZALpyZAABAFUc4spdMG6m6kwOkDtvPVaegYINUnbebowYRZABWfSeqW9WHL947O94LNcIBy2l3RfZCwr6xbaPtbM1GtlZAoPUZB5oLBxyHZCKwoLMzQUMQiZCZAhVsMZCm5hnvL2h3YmBqaeaKJzbwA82mCaRXqXHWU6fdS3kWAZDZD",
      name: "The Palace"
    }, {
      fb_page_access_token: "EAAQjvee4J7gBAH8f3udG3p5bDXrWEk9neEiawBC2X9Cg76agkcWcARcjgXQWmweUo4pRl6LxBWtJw5aJQkslXA0k7eqwEzhESZC8IShZBRoSTodGWPriLEqKkUp1ByY1XZAMZCgK7WmOHmHxjcSuZAE6mv266mQIOZBz08apWU6wZDZD",
      name: "Pool Club"
    }, {
      fb_page_access_token: "EAAYHGPvqZAi4BAP9ObZBjZAku7J0UgO7N4bshBMYMEjEyYl3PErM5BSJkEMcJ3LeFF2ff5CB7VEaHMfc30ZCIwjIYBVztuDm94wBgjxBJtIhZBrwDIO0ZBJ309gQKGSz3rw6K8FC1S9hwahCC0ukSQrvSTxt5FmZBLlbiHJrAJJ1gZDZD",
      name: "Revel"
    }, {
      fb_page_access_token: "EAACuA6LoYUQBAKfTBtVZAohtF0iGU3VyeJCjgZCHm2yMZCGI1Ol3Qhn32ogyHMLDhlLeIaGbLRs1ZBdbttZBIYc0AdAui5pD6X83z4W3cRzsmSxqQcqlUZBpPTo8ejkzbIu3ZAvQhqCWAOH6WzXeuLZBVquM7nE6gNumHC3tGVJC0wZDZD",
      name: "Valkyrie"
    }];
    this.setState({
      selectedVenue: selectOptions[0].fb_page_access_token,
      venues: selectOptions
    });

    // PartyBot.venues.getAllInOrganisation(params, (err, response, body) => {
    //   if(!err && response.statusCode == 200) {
    //     let options = body.unshift({_id: null, name:'Select Venue'});
    //     this.setState({venues: body});
    //   }
    // });
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
    console.log(venueCode);
    this.setState({
      selectedVenue: venueCode
    });
  }

  getVenueOptions = () => {
  

    return this.state.venues.map((venue, i) => {

      return (
        <option key={i} value={venue.fb_page_access_token}> {venue.name} </option>
        );
      // console.log(venue);
      
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
      // organisationId: this.state.organisationId,
      channel: 'facebook',
      fb_page_access_token: this.state.selectedVenue,
      message: this.state.text
    };

    console.log(params);
    PartyBot.sender.sendMessageToSenders(params, (err, response, body) => {
      // console.log(err);
      // console.log(response.statusCode);
      // console.log(body);
      if(response.statusCode == 200) {
        this.setState({
          confirm: true,
          action: "successfully sent"
        });
      }
    });
  }

  onDrop(file) {
    this.setState({
       image: file[0],
       isNewImage: true
     });
  }

  closeSetup = () => {
    this.setState({
     confirm: false
   });
    this.context.router.push('/alerts');
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
      {this.state.confirm !== false ? 
          <Layer align="center">
            <Header>
              Alert {this.state.action}.
            </Header>
            <Section>
              <Button label="Close" onClick={this.closeSetup} plain={true} icon={<CloseIcon />}/>
            </Section>
          </Layer>
          : null
        }
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
                <select name="venueAlert" onChange={this.onVenueChange}>
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
