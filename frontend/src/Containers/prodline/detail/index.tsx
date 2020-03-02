import React from "react"
import {withRouter} from "react-router";

const PageProdlineDetail = withRouter((prop) => {
    const id = prop.match.params.id;
    return (
        <div>
            <span>生产线页面</span>
            <h1>这是第{id}页</h1>
        </div>
    )
});
export default PageProdlineDetail;