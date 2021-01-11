import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { Header } from "../components/header";
import { Restaurant } from "../pages/client/restaurant";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { Category } from "../pages/client/category";
import { Restaurants } from "../pages/client/restaurants";
import { Search } from "../pages/client/search";
import { ConfirmEmail } from "../pages/user/confirmEmail";
import { EditProfile } from "../pages/user/editProfile";

const ClientRoutes = [
  <Route key={1} path='/' exact>
    <Restaurants />
  </Route>,
  <Route key={2} path='/confirm'>
    <ConfirmEmail />
  </Route>,
  <Route key={3} path='/edit-profile'>
    <EditProfile />
  </Route>,
  <Route key={4} path='/search'>
    <Search />
  </Route>,
  <Route key={5} path='/category/:slug'>
    <Category />
  </Route>,
  <Route key={6} path='/restaurants/:id'>
    <Restaurant />
  </Route>,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  if (!data || loading || error) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <span className='font-medium text-xl tracking-wide'>Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === "Client" && ClientRoutes}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
