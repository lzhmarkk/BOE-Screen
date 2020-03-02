import React from "react";
import {Switch, Route} from 'react-router'
import NotFound from "../Containers/NotFound";
import PageDashBoard from "../Containers/DashBoard";
import PageFlow from "../Containers/flow";
import PageProdlineDetail from "../Containers/prodline/detail";
import PageStats from "../Containers/stats";
import PageHelp from "../Containers/help";
import PageAccount from "../Containers/account";
import PageProdlineIndex from "../Containers/prodline";
import PageProdlineRoutes from "../Containers/prodline/route";


const ContentRoutes = () => <Switch>
    <Route exact path="/" render={PageDashBoard}/>
    <Route path="/index/" render={PageDashBoard}/>
    <Route path="/flow/" render={PageFlow}/>
    <Route path="/prodline/" render={PageProdlineRoutes}/>
    <Route path="/stats/" render={PageStats}/>
    <Route path="/account/" render={PageAccount}/>
    <Route component={NotFound}/>
    <Route path="/help/" render={PageHelp}/>
</Switch>;

export default ContentRoutes;


