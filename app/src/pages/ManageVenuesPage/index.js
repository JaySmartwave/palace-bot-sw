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

class ManageVenuesPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.state = {
      isMobile: false,
      files: [],
      venueId: null // id mock test
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
        {this.state.venueId !== null ? 
    	<Heading align="center">
            Edit Venue
        </Heading>
        : 
    	<Heading align="center">
            Add Venue
        </Heading>
    	}
          </Box>
			<Box direction="row" justify="center" align="center" wrap={true} pad="small	" margin="small">
				<Form>
				<FormFields>
					<fieldset>
					  <FormField label="Venue Name" htmlFor="venueName">
					    <input id="venueName" type="text"/>
					  </FormField>
					  <FormField label="Address" htmlFor="venueAddress">
					    <input id="venueAddress" type="text"/>
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
			  	        {this.state.venueId !== null ? 
				    	<Heading align="center">
				            <Button label="Save Changes" primary={true} onClick={this.testFunc} />
				        </Heading>
				        : 
				    	<Heading align="center">
				            <Button label="Create Venue" primary={true} onClick={this.testFunc} />
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
