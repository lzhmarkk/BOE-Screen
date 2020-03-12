import React from "react";
import {Switch, Route} from 'react-router'
import PageProdlineIndex from "./index";
import PageProdlineDetail from "./detail";

const PageProdlineRoutes = () => <Switch>
    <Route exact path="/prodline" render={() => <PageProdlineIndex/>}/>
    <Route exact path="/prodline/index" render={() => <PageProdlineIndex/>}/>
    <Route path="/prodline/:id" render={() => <PageProdlineDetail/>}/>
</Switch>;

export default PageProdlineRoutes