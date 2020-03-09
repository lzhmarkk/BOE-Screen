import React from "react"
import {Button} from "antd";
import flow_style from "./index.module.scss"
import image from "../../Assets/image_demo.jpg"
import mask from "../../Assets/mask_demo.jpg"
import IPictureForm from "./form";

const PageFlow = () => {
    return (
        <div>
            <IPictureForm />
            <div className={flow_style.upload}>
                <Button type="primary" size={"large"}>
                    上传图片
                </Button>
            </div>
            <div className={flow_style.image}>
                <img src={image} alt={"示例图片"}/>

            </div>
            <div className={flow_style.image}>
                <img src={mask} alt={"mask"}/>

            </div>
            <span>
                Mask
            </span>
        </div>
    )
};

export default PageFlow;