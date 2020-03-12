import React, {useState} from "react"
import {Button, message, Spin} from "antd";
import Axios from 'axios';
import flow_style from "./index.module.scss"
import image from "../../Assets/image_demo.jpg"
import mask from "../../Assets/mask_demo.jpg"
import IPictureForm, {IFormPayload} from "./form";
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
    const [analyzing, setAnalyzing] = useState(false);
    const [data, setData] = useState<PageFlowData>({
        image: undefined,
        image_name: "null",
        prodline_name: "null",
        class: undefined,
        mask: undefined
    });
    const handlePost = (data: any) => {
        setAnalyzing(true);
        Axios.post(APIList.flow, data)
            .then(res => {
                console.log(res);
                setData(res.data);
                setAnalyzing(false);
                message.success("成功分析该图片");
            })
            .catch(err => {
                    console.log(err);
                    setAnalyzing(false);
                    message.error("分析该图片的信息失败")
                }
            );
    };
    //todo: 调整图片的大小
    //todo: 图片和mask增加边框
    //todo: 增加图片的分类的一个展示(PageFlowData的class字段)
    //todo: 动态切换效果？？
    const content = <div>
        <div className={flow_style.upload}>
            <IPictureForm onSubmit={(e: IFormPayload) => {
                const postData = {
                    "image": e.image === undefined ? undefined : e.image[0].originFileObj.thumbUrl,
                    "image_name": "image name",
                    "prodline_name": e.prodline_name === undefined ? "" : e.prodline_name
                };
                console.log(postData);
                handlePost(postData);
            }}/>
        </div>
        <div className={flow_style.image}>
            <img src={data.image} alt={"示例图片"}/>

        </div>
        <div className={flow_style.image}>
            <img src={data.mask} alt={"mask"}/>

        </div>
        <span>
                {data.class}
            </span>
    </div>;
    return (
        analyzing ? <div className="spin">
            <Spin tip={"正在分析图片"}/>
        </div> : content
    )
};

export default PageFlow;