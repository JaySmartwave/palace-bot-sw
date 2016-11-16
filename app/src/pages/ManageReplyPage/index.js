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

class ManageReplyPage extends Component {
  constructor(props) {
    super(props);
    this.handleMobile = this.handleMobile.bind(this);
    this.onIntentChange = this.onIntentChange.bind(this);
    this.state = {
      organisationId: '5800471acb97300011c68cf7',
      venueId: '',
      replyId: props.params.reply_id,
      isMobile: false,
      selectedIntent: '',
      intents: [
        'AskSomething',
        'Greet',
        'Confirm',
        'Negative',
        'Appreciate',
        'Curse'
      ],
      venue: {},
      entity: '',
      reply: ''
    };
  }
  componentWillMount() {

  }
  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleMobile);
    }
    let options = {
      organisationId: '5800471acb97300011c68cf7',
      replyId: this.state.replyId
    };

    PartyBot.replies.getReplyPerOrganisation(options, (err, res, body) => {
      if(!err) {
        this.setState({
          venueId: body._venue_id._id,
          venue:body._venue_id.name,
          intent: body.intent,
          entity: body.entity,
          reply: body.reply || ''
        });
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
  
  setEntity = (event) => {
    this.setState({
      entity: event.target.value
    });
  }

  setReply = (event) => {
    this.setState({
      reply: event.target.reply
    });
  }

  updateReply = () => {
    let params = {
      organisationId: this.state.organisationId,
      venueId: this.state.venueId,
      replyId: this.state.replyId,
      intent: this.state.intent,
      entity: this.state.entity,
      reply: this.state.reply,
      replyId: this.state.replyId
    }
    console.log(params);
    PartyBot.replies.updateReply(params, (err, res, body) => {
      console.log(err);
      console.log(res.statusCode);
      console.log(body);
    });
  }

  onIntentChange(event) {
    let intentId = event.nativeEvent.target.selectedIndex;
    let intentCode = event.nativeEvent.target[intentId].value;
    this.setState({selectedIntent: event.nativeEvent.target[intentId].value, function () {
      console.log(this.state.selectedIntent);
    }
    });
  }

  getIntentOptions(){
    let stateIntents = this.state.intents;

    return stateIntents.map(function(intent, i) {
      if(i === 0) this.state.selectedIntent = intent
      return (
        <option key={i} value={intent}> {intent} </option>
        );

    }.bind(this));
  }


  render() {
    const {
      router,
    } = this.context;
    const {
      isMobile,
    } = this.state;
    return (
      <div className={styles.container}>
        <Box pad={{ vertical: 'medium' }}>
          <Heading align="center" uppercase>
            Alerts
          </Heading>
        </Box>
  			<Box direction="row" justify="center" align="center" wrap={true} pad="small	" margin="small">
  				<Form>
  				<FormFields>
  					<fieldset>
              <FormField label="Intent" htmlFor="replyIntent">
                <select name="replyIntent"
                  onChange={this.onIntentChange}>
                  {this.getIntentOptions()}
                </select>
              </FormField>
  					  <FormField label="Entity" htmlFor="replyEntity">
  				      <input id="replyEntity" type="text" value={this.state.entity} onChange={this.setEntity}/>
  					  </FormField>
              <FormField label="Reply" htmlFor="repl">
                <input id="reply" type="text" value={this.state.reply} onChange={this.setReply}/>
              </FormField>
  					</fieldset>
  				</FormFields>
  				<Footer pad={{"vertical": "medium"}}>
  				  <Heading align="center">
  				    <Button label="Submit" primary={true} onClick={this.updateReply} />
  				  </Heading>
  				</Footer>
  				</Form>
  			</Box>
      </div>
    );
  }
}

ManageReplyPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default cssModules(ManageReplyPage, styles);
