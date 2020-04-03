import React from "react";
import {Switch, Route} from 'react-router'
import PageTextureIndex from "./index";
import PageTextureDetail from "./detail";

const PageTextureRoutes = () => <Switch>
    <Route exact path="/texture" render={() => <PageTextureIndex/>}/>
    <Route exact path="/texture/index" render={() => <PageTextureIndex/>}/>
    <Route path="/texture/:id" render={() => <PageTextureDetail/>}/>
</Switch>;

export default PageTextureRoutes
