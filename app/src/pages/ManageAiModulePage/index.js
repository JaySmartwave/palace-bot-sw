import PartyBot from 'partybot-http-client'; // Bots http client
import React, { PropTypes, Component } from 'react';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
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
import Layer from 'grommet/components/Layer';
import Header from 'grommet/components/Header';
import Section from 'grommet/components/Section';
import Paragraph from 'grommet/components/Paragraph';

let organisationId =  "5800471acb97300011c68cf7";

class ManageAiModulePage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.closeSetup = this.closeSetup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setIntent = this.setIntent.bind(this);
    this.state = {
      isMobile: false,
      confirm: false,
      venues: [],
      intents: [],
      organisationId: organisationId,
      tags: [],
      selectedVenue: '',
      selectedIntent: 'AskSomething'
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

  closeSetup(){
    this.setState({
     confirm: false
   });
    this.context.router.push('/ai-module');
  }

  handleChange(tags) {
    this.setState({tags})
  }

  setIntent() {
    this.setState({
		selectedIntent: event.target.value
	}); 
  }

  onVenueChange = (event) => {
    let venueId = event.nativeEvent.target.selectedIndex;
    let venueCode = event.nativeEvent.target[venueId].value;
    this.setState({
      selectedVenue: venueCode
    });
  }

  getVenues = (options) => {
    PartyBot.venues.getAllInOrganisation(options, (errors, response, body) => {
      if(response.statusCode == 200) {
        if(body > 0) {
          this.setState.selectedVenue = body[0]._id;
        }
        this.setState({venues: body});
      }
    });
  }

  render() {
    let tags = this.state.tags;
	let suggestions = this.state.suggestions;
    const {
      router,
    } = this.context;
    const {
      isMobile,
    } = this.state;
   const {
      selectedVenue,
      selectedIntent
    } = this.state;
    return (
      <div className={styles.container}>
        <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css" />
        {this.state.confirm !== false ? 
          <Layer align="center">
            <Header>
            Changes saved.
            </Header>
            <Section>
              <Button label="Close" onClick={this.closeSetup} plain={true} icon={<CloseIcon />} />
            </Section>
          </Layer> : null
        }
        <Box pad={{ vertical: 'medium' }}>
          <Heading align="center">
          AI Rule Setup
          </Heading>
        </Box>
          <Box direction="row" justify="center" align="center" wrap={true} pad="small	" margin="small">
            <Form onSubmit={this.submitSave}>
              <FormFields>
                <fieldset>
                <Box separator="all">
                  <FormField label="Venue" htmlFor="tableVenue" />
                  <select name="venueEvent" onChange={this.onVenueChange}>
                    {this.state.venues.map((value, index) => {
                    return <option key={index} value={value._id}>{value.name}</option>;
                  })}
                  </select>
                </Box>
                <FormField label="Intent" htmlFor="aiIntent">
                   <select name="venueEvent" onChange={this.setIntent}>
                   	  <option value="AskSomething">AskSomething</option>
					  <option value="Greet">Greet</option>
					  <option value="Confirm">Confirm</option>
					  <option value="Negative">Negative</option>
					  <option value="Appreciate">Appreciate</option>
					  <option value="Curse">Curse</option>
                  </select>
                </FormField>
                <FormField label="Entity" htmlFor="aiEntity">
                  <TagsInput value={this.state.tags} onChange={::this.handleChange} />     
                </FormField>
                <FormField label="Reply" htmlFor="aiReply">
                  <input id="aiReply" type="text" onChange={this.setReply}/>
                </FormField>
              </fieldset>
            </FormFields>
            <Footer pad={{"vertical": "medium"}}>
              <Heading align="center">
              <Button label="Save Changes" primary={true} onClick={this.submitSave} />
              </Heading>
            </Footer>
          </Form>
        </Box>
      </div>
      );
  }
}

ManageAiModulePage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default cssModules(ManageAiModulePage, styles);
