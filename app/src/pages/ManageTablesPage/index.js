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
import NumberInput from 'grommet/components/NumberInput';

import Dropzone from 'react-dropzone';

class head1hello extends Component {
    render() {
        return(
            <h1> hellohe </h1>
            );
    }
}

class ManageTablesPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.getTypeOptions = this.getTypeOptions.bind(this);
    this.onVenueChange = this.onVenueChange.bind(this);
    this.getVenueOptions = this.getVenueOptions.bind(this);
    this.state = {
      isMobile: false,
      files: [],
      tableId: null // id mock test
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

  onVenueChange(event) {
    var id = event.nativeEvent.target.selectedIndex;
    console('Selected Event' + event.nativeEvent.target[id].value);
    //this.setState or props
  }

  getVenueOptions(){
    return ["Valkyrie","Pool Club","Revel","Naya"].map(function (item) {
        return <option key={item} value={item}>{item}</option>;
    }.bind(this));
  }

  onTypeChange(event) {
    var id = event.nativeEvent.target.selectedIndex;
    alert('Selected Table:' + event.nativeEvent.target[id].value);
    //this.setState
  }

  getTypeOptions(){
    return ["Couch","Cabana","Magnum Couch","Skybox"].map(function (item) {
        return <option key={item} value={item}>{item}</option>;
    }.bind(this));
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
        {this.state.tableId !== null ? 
    	<Heading align="center">
            Edit Table
        </Heading>
        : 
    	<Heading align="center">
            Add Table
        </Heading>
    	}
          </Box>
			<Box direction="row" justify="center" align="center" wrap={true} pad="small	" margin="small">
                  <head1hello> Hi </head1hello>
				<Form>
				<FormFields>
					<fieldset>
					  <FormField label="Venue" htmlFor="tableVenue">
					    <select id="tableVenue" onChange={this.onVenueChange}>
                {this.getVenueOptions()}
						  </select>
					  </FormField>
					  <FormField label="Table Type" htmlFor="tableType">
					    <select id="tableType" onChange={this.onTypeChange}>
						    {this.getTypeOptions()}
						  </select>
					  </FormField>
					  <FormField label="Table Name" htmlFor="tableName">
					    <input id="tableName" type="text"/>
					  </FormField>
					  <FormField label="No. of Pax" htmlFor="tablePax">
					    <NumberInput id="tablePax" value={0} min={0} max={20} />
					  </FormField>
					  {
					  //Dynamic Price/Event Component
					  }  
            
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
			  	        {this.state.tableId !== null ? 
				    	<Heading align="center">
				            <Button label="Save Changes" primary={true} onClick={this.testFunc} />
				        </Heading>
				        : 
				    	<Heading align="center">
				            <Button label="Create Table" primary={true} onClick={this.testFunc} />
				        </Heading>
				    	}
				  </Footer>
				</Form>
			</Box>
      </div>
    );
  }
}

ManageTablesPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default cssModules(ManageTablesPage, styles);
