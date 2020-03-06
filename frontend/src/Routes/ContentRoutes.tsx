import React from "react";
import {Switch, Route} from 'react-router'
import NotFound from "../Containers/NotFound";
import PageDashBoard from "../Containers/DashBoard";
import PageFlowRoutes from "../Containers/flow/route";
import PageProdlineDetail from "../Containers/prodline/detail";
import PageStats from "../Containers/stats";
import PageHelp from "../Containers/help";
import PageAccount from "../Containers/account";
import PageProdlineIndex from "../Containers/prodline";
import PageProdlineRoutes from "../Containers/prodline/route";


const ContentRoutes = () => <Switch>
    <Route exact path="/" render={PageDashBoard}/>
    <Route path="/index/" render={PageDashBoard}/>
    <Route path="/flow/" render={PageFlowRoutes}/>
    <Route path="/prodline/" render={PageProdlineRoutes}/>
    <Route path="/stats/" render={PageStats}/>
    <Route path="/account/" render={PageAccount}/>
    <Route path="/help/" render={PageHelp}/>
    <Route component={NotFound}/>
</Switch>;

export default ContentRoutes;


