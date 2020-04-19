import React from "react";
import {Switch, Route} from 'react-router'
import NotFound from "../Containers/NotFound";
import PageFlowRoutes from "../Containers/flow/route";
import PageHelp from "../Containers/help";
import PageAccount from "../Containers/account";
import PageTextureRoutes from "../Containers/texture/route";
import PageStatsRoutes from "../Containers/stats/route";
import PageFlow from "../Containers/flow";

const ContentRoutes = () => <Switch>
    <Route exact path="/" render={() => <PageFlow/>}/>
    <Route path="/index/" render={() => <PageFlow/>}/>
    <Route path="/flow/" render={PageFlowRoutes}/>
    <Route path="/texture/" render={PageTextureRoutes}/>
    <Route path="/stats/" render={PageStatsRoutes}/>
    <Route path="/account/" render={() => <PageAccount/>}/>
    <Route path="/help/" render={() => <PageHelp/>}/>
    <Route component={NotFound}/>
</Switch>;

export default ContentRoutes;


