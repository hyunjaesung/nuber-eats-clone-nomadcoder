import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { CreateAccount } from "../pages/createAccount";
import { Login } from "../pages/login";

export const LoggedOutRouter = () => (
  <Router>
    <Switch>
      <Route path="/create-account">
        <CreateAccount />
      </Route>
      <Route path="/">
        <Login />
      </Route>
    </Switch>
  </Router>
);
