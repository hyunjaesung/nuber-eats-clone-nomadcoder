import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { NotFound } from "../pages/404";
import { CreateAccount } from "../pages/createAccount";
import { Login } from "../pages/login";

export const LoggedOutRouter = () => (
  <Router>
    <Switch>
      <Route path='/create-account'>
        <CreateAccount />
      </Route>
      <Route path='/' exact>
        <Login />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  </Router>
);
