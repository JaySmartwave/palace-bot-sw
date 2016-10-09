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

const TABLES = [
                { tableName: "TableType1",
                  tableCount:
                    [
                      {tableId: "T1A", isAvailable: false},
                      {tableId: "T1B", isAvailable: true},
                      {tableId: "T1C", isAvailable: false},
                    ]
                },
                { tableName: "TableType2",
                  tableCount:
                    [
                      {tableId: "T2A", isAvailable: false},
                      {tableId: "T2B", isAvailable: false},
                      {tableId: "T2C", isAvailable: false},
                    ]
                },
                { tableName: "TableType3",
                  tableCount: 
                    [
                      {tableId: "T3A", isAvailable: true},
                      {tableId: "T3B", isAvailable: true},
                      {tableId: "T3C", isAvailable: true},
                    ]
                },
              ]

class EditTablesPage extends Component {
  constructor() {
    super();
    this.handleMobile = this.handleMobile.bind(this);
    this.state = {
      isMobile: false,
      eventId: null, // identifier
      tables: TABLES
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
              this.state.tables.map(function(table) {
                return
                <FormField key={table.tableName} label={table.tableName} htmlFor={table.tableName}>
                  {table.tableName}
                </FormField>;
              })
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
