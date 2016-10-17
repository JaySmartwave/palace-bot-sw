import React from 'react';
import { Router, Route, IndexRedirect } from 'react-router';
import store, { history } from './store';
/* eslint-disable */
import App from 'components/App';
import * as Pages from 'pages';
import { ApolloProvider } from 'react-apollo';
import client from './apolloClient';
/* eslint-enable */

const routes = (
  <ApolloProvider store={store} client={client}>
  <Router history={history}>
  <Route path="/" component={App}>
  <IndexRedirect to="/home" />
  <Route path="/home" component={Pages.LandingPage} name="Home" />
  <Route path="/about" component={Pages.AboutPage} />
  <Route path="/events" component={Pages.EventsPage} />
  <Route path="/venues" component={Pages.VenuesPage} />
  <Route path="/venues/add" component={Pages.ManageVenuesPage} />
  <Route path="/venues/:venueId" component={Pages.ManageVenuesPage} />
  <Route path="/tables" component={Pages.TablesPage} />
  <Route path="/schedules" component={Pages.SchedulePage} />
  <Route path="/promoters" component={Pages.PromoterPage} />
  <Route path="/alerts" component={Pages.AlertsPage} />
  <Route path="/manageTables" component={Pages.ManageTablesPage} />
  <Route path="/manageEvents" component={Pages.ManageEventsPage} />
  <Route path="/managePromoters" component={Pages.ManagePromotersPage} />
  <Route path="/editTables" component={Pages.EditTablesPage} />
  <Route path="/guestList" component={Pages.GuestListPage} />
  <Route path="/tableBookings" component={Pages.TableBookingsPage} />
  <Route path="/manageTickets" component={Pages.ManageTicketsPage} />
  <Route path="/tickets" component={Pages.TicketsPage} />
  <Route path="/aiModule" component={Pages.AiModulePage} />
  <Route path="/login" component={Pages.LoginPage} />
  <Route path="*" component={Pages.NotFoundPage} />
  </Route>
  </Router>
  </ApolloProvider>
  );

export default routes;
