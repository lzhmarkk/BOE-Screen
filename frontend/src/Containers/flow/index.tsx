import React, {useState} from "react"
import {Button, message} from "antd";
import Axios from 'axios';
import flow_style from "./index.module.scss"
import image from "../../Assets/image_demo.jpg"
import mask from "../../Assets/mask_demo.jpg"
import APIList from "../../API";

//Flow页面图片信息的接口
interface PageFlowData {
    image: string | undefined//图片
    image_name: string//图片名
    prodline_name: string//流水线名
    class: string | undefined//图片分类
    mask: string | undefined//图片mask
}

const PageFlow = () => {
    const [data, setData] = useState<PageFlowData>({
        image: undefined,
        image_name: "null",
        prodline_name: "null",
        class: undefined,
        mask: undefined
    });
    const handlePost = (data: any) => {
        Axios.post(APIList.flow, data)
            .then(res => {
                console.log(res);
                message.success("成功分析该图片");
            })
            .catch(err => {
                    console.log(err);
                    message.error("分析该图片的信息失败")
                }
            );
    };
    //todo: 调整图片的大小
    //todo: 图片和mask增加边框
    //todo: 增加图片的分类的一个展示(PageFlowData的class字段)
    //todo: 上传图片按钮连接表单并且发送
    //todo: 动态切换效果？？
    return (
        <div>
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