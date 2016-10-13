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
import CloseIcon from 'grommet/components/icons/base/Close';
import Dropzone from 'react-dropzone';

const VARIANTS =[
                  { 
                    eventId: '001',
                    eventName: 'Game On',
                    tablePrice: 3000
                  },
                  // { 
                  //   eventId: '002',
                  //   eventName: 'Overtime',
                  //   tablePrice: 2000
                  // }
                ] 

class ManageTablesPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.testFunc = this.testFunc.bind(this);
    this.getTableVariants = this.getTableVariants.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.getTypeOptions = this.getTypeOptions.bind(this);
    this.onVenueChange = this.onVenueChange.bind(this);
    this.getVenueOptions = this.getVenueOptions.bind(this);
    this.getEventOptions = this.getEventOptions.bind(this);
    this.state = {
      isMobile: false,
      files: [],
      tableId: null, // id mock test
      variants: VARIANTS
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
    console.log('Selected Event' + event.nativeEvent.target[id].value);
    //this.setState or props
  }

  getVenueOptions(){
    return ["Valkyrie","Pool Club","Revel","Naya"].map(function (item) {
      return <option key={item} value={item}>{item}</option>;
    }.bind(this));
  }

  getVenueOptions(){
    return ["Valkyrie","Pool Club","Revel","Naya"].map(function (item) {
      return <option key={item} value={item}>{item}</option>;
    }.bind(this));
  }

  getEventOptions(){
    return ["Overtime","Game On","Kate Mess"].map(function (item) {
      return <option key={item} value={item}>{item}</option>;
    }.bind(this));
  }

  onTypeChange(event) {
    var id = event.nativeEvent.target.selectedIndex;
    console.log('Selected Table:' + event.nativeEvent.target[id].value);
    //this.setState
  }

  getTypeOptions(){
    return ["Couch","Cabana","Magnum Couch","Skybox"].map(function (item) {
      return <option key={item} value={item}>{item}</option>;
    }.bind(this));
  }
  testFunc() { // TEST functions here
    console.log('test');
  }

  getTableVariants(){
    return this.state.variants.map(function (item) {
      return <div key={item.eventId}>
                <FormField label="Event" htmlFor="tableName">
                  <input id="tableName" type="text" value={item.eventName} onChange={this.testFunc}/>
                </FormField>
                <FormField label="Price(Php)" htmlFor="tablePrice">
                  <input id="tablePrice" type="number" value={item.tablePrice} onChange={this.testFunc}/>
                </FormField>
                <Footer pad={{"vertical": "small"}}>
                   <Heading align="center">
                   <Button className={styles.eventButton} label="Update" primary={true} onClick={this.testFunc} />
                   <Button className={styles.eventButton} label="Remove" onClick={this.testFunc} />
                   </Heading>
                 </Footer>
             </div>;
    }.bind(this));
  }

  onDrop(files) {
  	this.setState({
     files: files
   });
  }
  onRemoveImage() {
    this.setState({
      files: []
    });
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
      variants,
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
            //this.getTableVariants()
            }
          <FormField label="Image">
          {this.state.files.length > 0 ? 
            <Box align="center" justify="center">
             <div>{this.state.files.map((file) => <img src={file.preview} /> )}</div>
              <Box>
              <Button label="Cancel" onClick={this.onRemoveImage} plain={true} icon={<CloseIcon />}/>
              </Box>
            </Box> :
            <Box align="center" justify="center">
            <Dropzone multiple={false} ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop}>
              Drop image here or click to select image to upload. 
            </Dropzone>
            </Box>
          }
           </FormField>
           </fieldset>
           </FormFields>
            <br/>
            <Box>
            Pricing:
            </Box>
            <Button label="Add Event" primary={true} onClick={this.testFunc} />
            <br/>
            <br/>
            <FormField label="Event" htmlFor="tableName">
              <select id="tableVenue" onChange={this.onVenueChange}>
                {this.getEventOptions()}
              </select>
            </FormField>
            <FormField label="Price(Php)" htmlFor="tablePrice">
              <input id="tablePrice" type="number" value={0} onChange={this.testFunc}/>
            </FormField>
            <FormField>
              <Footer>
               <Heading align="center">
               <Button className={styles.eventButton} label="Save" primary={true} onClick={this.testFunc} />
               <Button className={styles.eventButton} label="Remove" onClick={this.testFunc} />
               </Heading>
             </Footer>
            </FormField>
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
