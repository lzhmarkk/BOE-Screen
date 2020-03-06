import React from "react";
import {Switch, Route} from 'react-router'
import PageFlow from "./index";
import PageFlowDetail from "./detail/index";


const PageFlowRoutes = () => <Switch>
    <Route exact path="/flow" render={() => <PageFlow/>}/>
    <Route path="/flow/:kind" render={() => <PageFlowDetail/>}/>
</Switch>;

export default PageFlowRoutes