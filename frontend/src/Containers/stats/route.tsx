import React from "react";
import {Switch, Route} from 'react-router'
import PageStats from "./index";

const PageFlowRoutes = () => <Switch>
    <Route exact path="/stats" render={() => <PageStats/>}/>
    <Route path="/stats/:page" render={() => <PageStats/>}/>
</Switch>;

export default PageFlowRoutes
