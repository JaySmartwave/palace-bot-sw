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


class ManagePromotersPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.state = {
      isMobile: false,
      files: [],
      promoterId: null // id mock test
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
        {this.state.promoterId !== null ? 
    	<Heading align="center">
            Edit Promoter
        </Heading>
        : 
    	<Heading align="center">
            Add Promoter
        </Heading>
    	}
          </Box>
			<Box direction="row" justify="center" align="center" wrap={true} pad="small	" margin="small">
				<Form>
				<FormFields>
					<fieldset>
					  <FormField label="Promoter Name" htmlFor="promoterName">
					    <input id="promoterName" type="text"/>
					  </FormField>
					  <FormField label="Promoter Code" htmlFor="promoterCode">
					    <input id="promoterCode" type="text"/>
					  </FormField>
  					  <FormField label="Venue" htmlFor="promoterVenue">
					    <select>
						  <option value="valkyrie">Valkyrie</option>
						  <option value="poolclub">Pool Club</option>
						  <option value="revel">Revel</option>
						</select>
					  </FormField>
  					  <FormField label="Event" htmlFor="promoterEvent">
					    <select>
						  <option value="gjwhf">Girls Just Wanna Have Fun</option>
						  <option value="gameOn">Game On</option>
						  <option value="kateMess">Kate Mess</option>
						  <option value="overtime">Overtime</option>
						</select>
					  </FormField>
					</fieldset>
				</FormFields>
				  <Footer pad={{"vertical": "medium"}}>
			  	        {this.state.promoterId !== null ? 
				    	<Heading align="center">
				            <Button label="Save Changes" primary={true} onClick={this.testFunc} />
				        </Heading>
				        : 
				    	<Heading align="center">
				            <Button label="Create Promoter" primary={true} onClick={this.testFunc} />
				        </Heading>
				    	}
				  </Footer>
				</Form>
			</Box>
      </div>
    );
  }
}

ManagePromotersPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default cssModules(ManagePromotersPage, styles);
