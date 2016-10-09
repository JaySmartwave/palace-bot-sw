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
import Select from 'react-select';

//is this organisation?

const VENUES = [ // GET all events
    { value: '001', label: 'Valkyrie' }, // value = venue.id // label = venue.name?
    { value: '002', label: 'Pool Club' },
    { value: '003', label: 'Revel'},
    { value: '004', label: 'Naya'}
    ];
const EVENTS = [ 
    { value: '001', label: 'Girls Just Wanna Have Fun' }, 
    { value: '002', label: 'Overtime' },
    { value: '003', label: 'Kate Mess'},
    { value: '004', label: 'Game On'},
    ];

class ManagePromotersPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.onEventAdd = this.onEventAdd.bind(this);
    this.onVenueAdd = this.onVenueAdd.bind(this);
    this.state = {
      isMobile: false,
      files: [],
      promoterId: null, // id mock test
      venues: VENUES,
      events: EVENTS,
      selectedVenues: [],
      selectedEvents: []
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
  onVenueAdd(selectedVenues) {
    console.log('You\'ve selected:', selectedVenues);
    this.setState({ selectedVenues });
  }

  onEventAdd(selectedEvents) {
    console.log('You\'ve selected:', selectedEvents);
    this.setState({ selectedEvents });
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
    return (
      <div className={styles.container}>
      <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css" />
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
					  <FormField label="Name" htmlFor="promoterName">
					    <input id="promoterName" type="text"/>
					  </FormField>
					  <FormField label="Code" htmlFor="promoterCode">
					    <input id="promoterCode" type="text"/>
					  </FormField>
            <FormField label="Description" htmlFor="promoterDesc">
              <input id="promoterCode" type="text"/>
            </FormField>
    	       <Box separator="all">
                <FormField label="Venue" htmlFor="promoterVenue" />
                <Select 
                  name="promoterVenue"
                  options={this.state.venues}
                  value={this.state.selectedVenues}
                  onChange={this.onVenueAdd} 
                  multi={true}
                  />
            </Box>
            <br/>
            <Box separator="all">
              <FormField label="Event" htmlFor="promoterEvent" />
              <Select 
                name="promoterEvent"
                options={this.state.events}
                value={this.state.selectedEvents}
                onChange={this.onEventAdd} 
                multi={true}
                />
            </Box>
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
