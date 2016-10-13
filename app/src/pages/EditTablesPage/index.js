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
import CheckBox from 'grommet/components/CheckBox';

const TABLES = [
                { tableName: "Cocktail Table",
                  tableCount:
                    [
                      {tableId: "CT1", isAvailable: true},
                    ]
                },
                { tableName: "West Couch",
                  tableCount:
                    [
                      {tableId: "West 1", isAvailable: false},
                      {tableId: "West 2", isAvailable: false},
                      {tableId: "West 3", isAvailable: false},
                    ]
                },
                { tableName: "East Couch",
                  tableCount: 
                    [
                      {tableId: "East 1", isAvailable: true},
                      {tableId: "East 2", isAvailable: true},
                      {tableId: "East 3", isAvailable: true},
                    ]
                },
              ]

class EditTablesPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.getTables = this.getTables.bind(this);
    this.getTableCount = this.getTableCount.bind(this);
    this.state = {
      isMobile: false,
      eventId: null, // identifier
      tables: TABLES,
      currentItem: []
    };
  }
  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleMobile);
    }
    console.log(this.state.tables)
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
    console.log(this.state.Tables)
  }
  getTables(){
    return this.state.tables.map(function (item) {
      return <div>
                <FormField key={item.tableName} label={item.tableName}>
                  {
                  //<CheckBox id="isGuestList" onChange={this.testFunc} label={item.tableName + " 1"} />
                  }
                </FormField>
              </div>
    }.bind(this));
  }
  getTableCount(){
    console.log(this.state.currentItem)
    return this.state.currentItem.map(function (item) {
      return <div key={item.tableId}>
          <CheckBox id="isGuestList" onChange={this.testFunc} label={item.tableId} />
        </div>
    }.bind(this));
  }
  render() {
    const {
      router,
    } = this.context;
    const {
      isMobile,
      tables,
    } = this.state;
    return (
      <div className={styles.container}>
      <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css" />
        <Box pad={{ vertical: 'medium' }}>
  	   <Heading align="center">
            Event Name
        </Heading>
        <Heading align="center" tag="h3">
            Edit Tables
          </Heading>
          </Box>
			<Box direction="row" justify="center" align="center" wrap={true} pad="small	" margin="small">
				<Form>
				<FormFields>
					<fieldset>
            {
              this.getTables()
            }
					</fieldset>
				</FormFields>
				  <Footer pad={{"vertical": "medium"}}>
				    	<Heading align="center">
				            <Button label="Save Changes" primary={true} onClick={this.testFunc} />
			        </Heading>
				  </Footer>
				</Form>
			</Box>
      </div>
    );
  }
}

EditTablesPage.contextTypes = {
  router: PropTypes.object.isRequired,
};
export default cssModules(EditTablesPage, styles);
