import PartyBot from 'partybot-http-client'; // Bots http client
import React, { PropTypes, Component } from 'react';
import cssModules from 'react-css-modules';
import styles from './index.module.scss';
import LoginForm from 'grommet/components/LoginForm';
import Box from 'grommet/components/Box';
import { Link } from 'react-router'

// nakahiwalay dapat to.. wala sa router?

class LoginPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);

    this.state = {
      isMobile: false,
    };

  }
  componentDidMount() {
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
  testFunc() {
  	console.log('test');
  }
  render() {
    const { router, } = this.context;
    const { isMobile, } = this.state;
    return (
      <div className={styles.container}>
      	<Box pad={{ vertical: 'medium' }} justify="center" align="center" >
	      	<LoginForm 
	      		align="center"
	      		onSubmit={this.testFunc}
	      		title="Party Bot" 
	  		/>
		</Box>
    </div>
    );
  }
}

LoginPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default cssModules(LoginPage, styles);
