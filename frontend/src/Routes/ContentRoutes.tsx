import React from "react";
import {Switch, Route} from 'react-router'
import NotFound from "../Containers/NotFound";
import PageDashBoard from "../Containers/DashBoard";


const ContentRoutes = () => <Switch>
    <Route exact path="/" render={PageDashBoard}/>
    <Route path="/index/" render={PageDashBoard}/>
    <Route component={NotFound}/>
</Switch>;

export default ContentRoutes;


