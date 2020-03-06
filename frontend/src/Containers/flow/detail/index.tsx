import React from "react"
import {withRouter} from "react-router";
import {Button} from "antd";
import image from "../../../Assets/image_demo.jpg"
import mask from "../../../Assets/mask_demo.jpg"
import flow_style from "../index.module.scss"

const PageFlowDetail = withRouter((prop) => {
    const kind = prop.match.params.kind;
    return (
        <div>
            <div>
                <div className={flow_style.upload}>
                    <Button type="primary">Delete</Button>
                </div>
                <div className={flow_style.sign}>
                    <Button type="primary">image</Button>
                </div>
                <div className={flow_style.sign}>
                    <Button type="primary">mask</Button>
                </div>

            </div>
            <div>
                <div>
                    <span>生产线页面</span>
                    <h1>这是{kind}页</h1>
                    <img src={image} alt={"image"} />

                </div>
                <div className={flow_style.upload}>
                    <h1>预测结果：True</h1>
                </div>
            </div>
        </div>
    )
});
export default PageFlowDetail;