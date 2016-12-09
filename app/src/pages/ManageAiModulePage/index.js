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
  constructor(props) {
    super(props);
    this.handleMobile = this.handleMobile.bind(this);
    this.closeSetup = this.closeSetup.bind(this);
    this.handleChangeEntity = this.handleChangeEntity.bind(this);
    this.setIntent = this.setIntent.bind(this);
    this.setReply = this.setReply.bind(this);
    this.state = {
      isMobile: false,
      confirm: false,
      venues: [],
      organisationId: organisationId,
      selectedVenue: '',
      venueId: [],
      intent: '',
      entity: [],
      reply: '',
      isNew: true
    };
  }
  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleMobile);
    }
    let paramsQueryId = this.props.params.queryId
    if (paramsQueryId) {
      let options = {
        organisationId: this.state.organisationId,
        queryId: paramsQueryId
      }

      this.getVenues(options);
      PartyBot.queries.getQueryPerOrganisation(options, (err, res, body) => {
        if(!err) {
          this.setState({
            selectedVenue: body._venue_id? body._venue_id._id: null,
            intent: body.intent,
            entity: body.entity,
            reply: body.reply || '',
            isNew: false
          });
        }
      });
    }else{
      let options = {
        organisationId: this.state.organisationId,
      }
      this.getVenues(options);
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

  closeSetup(){
    this.setState({
     confirm: false
   });
    this.context.router.push('/ai-module');
  }

  handleChangeEntity(entity) {
    this.setState({entity})
  }

  setIntent(event) {
    this.setState({
      intent: event.target.value
    }); 
  }

  setReply(event) {
    this.setState({
      reply: event.target.value
    }); 
  }

  submitCreate(event) {
    event.preventDefault();
    let objState = this.state;
    let params = { 
      organisationId: this.state.organisationId, 
      venueId: this.state.selectedVenue,
      entity: this.state.entity,
      intent: this.state.intent,
      reply: this.state.reply,
    };

    PartyBot.queries.createQuery(params, (err, response, body) => {
      if(response.statusCode == 201) {
        this.setState({
          confirm: true
        });
      }
    });
  }

  submitSave(event) {
    event.preventDefault();
    let objState = this.state;
    let params = { 
      organisationId: this.state.organisationId, 
      venueId: this.state.selectedVenue,
      entity: this.state.entity,
      intent: this.state.intent,
      reply: this.state.reply,
      queryId: this.props.params.queryId
    };

    PartyBot.queries.updateQuery(params, (err, response, body) => {
      if(response.statusCode == 200) {
        this.setState({
          confirm: true
        });
      }
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
        let options = body.unshift({_id: null, name: ""});
        this.setState({venues: body});
      }
    });
  }

  render() {
    console.log(this.state);
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
                  <select name="venueEvent" onChange={this.onVenueChange} value={this.state.selectedVenue}>
                    {this.state.venues.map((value, index) => {
                    return <option key={index} value={value._id}>{value.name}</option>;
                  })}
                  </select>
                </Box>
                <FormField label="Entity" htmlFor="aiIntent">
                  <TagsInput value={this.state.entity} onChange={this.handleChangeEntity} /> 
                </FormField>
                <FormField label="Intent" htmlFor="aiEntity">
                  <input id="aiEntity" type="text"  onChange={this.setIntent} value={this.state.intent} />
                </FormField>
                <FormField label="Reply" htmlFor="aiReply">
                  <input id="aiReply" type="text" onChange={this.setReply} value={this.state.reply} />
                </FormField>
              </fieldset>
            </FormFields>
            <Footer pad={{"vertical": "medium"}}>
              <Heading align="center">
              {!this.state.isNew ? 
                <Button label="Save Changes" primary={true} onClick={this.submitSave.bind(this)} />
              : 
                <Button label="Create AI Rule" primary={true} onClick={this.submitCreate.bind(this)} />
              }
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