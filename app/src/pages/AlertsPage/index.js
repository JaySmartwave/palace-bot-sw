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
      isMobile: false,
      files: [],
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
  	console.log("test! ");
  }
  	onDrop(files) {
  	this.setState({
    	files: files
	  });
  	console.log(files)
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
        <Box pad={{ vertical: 'medium' }}>
    	<Heading align="center" uppercase>
            Alerts
        </Heading>
          </Box>
			<Box direction="row" justify="center" align="center" wrap={true} pad="small	" margin="small">
				<Form>
				<FormFields>
					<fieldset>
					  <FormField label="Text" htmlFor="alertName">
					    <input id="alertName" type="text"/>
					  </FormField>
					  <FormField label="Link" htmlFor="alertLink">
					    <input id="alertLink" type="text"/>
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
				            <Button label="Send" primary={true} onClick={this.testFunc} />
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
