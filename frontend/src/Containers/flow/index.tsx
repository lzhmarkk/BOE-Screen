import React, {useState} from "react"
import {message, Spin, Steps, Carousel, Row, Col, Empty, Card, Icon, Descriptions} from "antd";
import Axios from 'axios';
import flow_style from "./index.module.scss"
import IPictureForm, {IFormPayload} from "./form";
import APIList from "../../API";
import {genClass, genWeights} from "../../Components/flow";
import style from "./index.module.scss";

interface PageFlowData {
    image?: string//图片
    time?: any
    mask?: string//图片mask
    image_name?: string//图片名
    texture_id?: number
    texture_name?: string//流水线名
    pred?: number
    size?: string
    area?: number
    ratio?: number
    weights?: {
        "1": number
        "2": number
    }
}

const {Step} = Steps;

const PageFlow = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [carouselRef, setCarouselRef] = useState<any>(undefined);
    const [current, setCurrent] = useState(0);
    const [sliding, setSliding] = useState(false);
    const [data, setData] = useState<PageFlowData>({});
    const handlePost = (data: any) => {
        setAnalyzing(true);
        Axios.post(APIList.flow, data)
            .then(res => {
                console.log("后台数据", res);
                setData(res.data);
                message.success("成功分析该图片");
                setAnalyzing(false);
            })
            .catch(err => {
                    console.log(err);
                    message.error("分析该图片的信息失败，请重试")
                    setAnalyzing(true);
                }
            );
    };

    function moveTab() {
        if (current === 0) {
            carouselRef.next();
            setCurrent(1);
        } else if (current === 1) {
            moveTabTo0();
        }
    }

    function moveTabTo0() {
        if (current === 1) {
            carouselRef.prev();
            setCurrent(0);
        }
    }

    const content = <div>
            <Row>
                <Col span={16}>
                    <Steps type="navigation" size="small" current={current}
                           className={flow_style.step}
                           onChange={moveTab}>
                        <Step key={0} title="原图"
                              status="finish" description="原始图片"
                              icon={<Icon type={'picture'}/>}
                              disabled={sliding}/>
                        <Step key={1} title="污点或损坏"
                              status="finish" description="分析得到污点或者损坏"
                              icon={<Icon type={'line-chart'}/>}
                              disabled={sliding}/>
                    </Steps>
                    <Carousel ref={e => setCarouselRef(e)}
                              beforeChange={() => setSliding(true)}
                              afterChange={() => setSliding(false)}>
                        <Card>
                            {
                                data.image !== undefined ?
                                    <div>
                                        <img src={data.image} alt={"图片"} className={flow_style.image}/>
                                    </div>
                                    :
                                    <Empty description={"请先上传一张图片"}/>
                            }
                        </Card>
                        <Card>
                            {
                                data.mask !== undefined ?
                                    <div>
                                        <img src={data.mask} alt={"mask"} className={flow_style.image}/>
                                    </div>
                                    :
                                    <Empty description={"请先上传一张图片"}/>
                            }
                        </Card>
                    </Carousel>
                </Col>
                <Col span={8}>
                    <Card className={flow_style.upload}>
                        <IPictureForm onSubmit={(e: IFormPayload) => {
                            console.log(e);
                            const postData = {
                                "image": e.image === undefined ? undefined : e.image[0].originFileObj.thumbUrl,
                                "image_name": e.image === undefined ? undefined : e.image[0].name,
                            };
                            console.log(postData);
                            handlePost(postData);
                            moveTabTo0();
                        }}/>
                    </Card>
                    <Descriptions bordered className={flow_style.description}>
                        <Descriptions.Item span={3} label={"图片名"}>{data.image_name}</Descriptions.Item>
                        <Descriptions.Item span={3} label={"类型"}>{genClass(data.pred)}</Descriptions.Item>
                        <Descriptions.Item span={3} label={"图片大小"}>{data.size}</Descriptions.Item>
                        <Descriptions.Item span={3} label={"异常大小(像素)"}>{data.area}</Descriptions.Item>
                        <Descriptions.Item span={3} label={"异常占比"}>
                            {data.ratio ? data.ratio / 100 + "%" : undefined}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label={"纹理序号"}>{data.texture_id}</Descriptions.Item>
                        <Descriptions.Item span={3} label={"纹理名称"}>{data.texture_name}</Descriptions.Item>
                        <Descriptions.Item span={3} label={"上传时间"}>{data.time}</Descriptions.Item>
                        <Descriptions.Item span={3} label={"权重"}>{genWeights(data.weights)}</Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>
        </div>
    ;
    return (
        analyzing ? <div className="spin">
            <Spin tip={"正在分析图片"} size={'large'} className={style.spin}/>
        </div> : content
    )
};

export default PageFlow;
