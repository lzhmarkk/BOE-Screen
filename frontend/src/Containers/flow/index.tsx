import React, {useState} from "react"
import {Button, message, Spin, Steps, Carousel, Row, Col, Empty, Card, Icon, Descriptions} from "antd";
import Axios from 'axios';
import flow_style from "./index.module.scss"
import IPictureForm, {IFormPayload} from "./form";
import APIList from "../../API";

interface PageFlowData {
    image: string | undefined//图片
    image_name: string//图片名
    prodline_name: string//流水线名
    class: string | undefined//图片分类
    mask: string | undefined//图片mask
    pred?: any
    size?: string
    area?: number
    ratio?: number
}

const {Step} = Steps;

const PageFlow = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [carouselRef, setCarouselRef] = useState<any>(undefined);
    const [current, setCurrent] = useState(0);
    const [sliding, setSliding] = useState(false);
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

    //todo: 增加图片的分类的一个展示(PageFlowData的class字段)
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
                <Col span={18}>
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
                                    <div className={flow_style.image}>
                                        <img src={data.image} alt={"图片"}/>
                                    </div>
                                    :
                                    <Empty description={"请先上传一张图片"}/>
                            }
                        </Card>
                        <Card>
                            {
                                data.mask !== undefined ?
                                    <div className={flow_style.image}>
                                        <img src={data.mask} alt={"mask"}/>
                                    </div>
                                    :
                                    <Empty description={"请先上传一张图片"}/>
                            }
                        </Card>
                    </Carousel>
                </Col>
                <Col span={6}>
                    <Card className={flow_style.upload}>
                        <IPictureForm onSubmit={(e: IFormPayload) => {
                            console.log(e);
                            const postData = {
                                "image": e.image === undefined ? undefined : e.image[0].originFileObj.thumbUrl,
                                "image_name": e.image === undefined ? undefined : e.image[0].name,
                                "prodline_name": e.prodline_name === undefined ? "" : e.prodline_name
                            };
                            console.log(postData);
                            handlePost(postData);
                            moveTabTo0();
                        }}/>
                    </Card>
                    <Descriptions bordered className={flow_style.description}>
                        <Descriptions.Item span={3} label={"类型"}>{data.class}</Descriptions.Item>
                        <Descriptions.Item span={3} label={"pred"}>{data.pred}</Descriptions.Item>
                        <Descriptions.Item span={3} label={"图片大小"}>{data.size}</Descriptions.Item>
                        <Descriptions.Item span={3} label={"异常大小(像素)"}>{data.area}</Descriptions.Item>
                        <Descriptions.Item span={3} label={"异常占比"}>{data.ratio ? data.ratio / 100 : 0}%</Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>
        </div>
    ;
    return (
        analyzing ? <div className="spin">
            <Spin tip={"正在分析图片"}/>
        </div> : content
    )
};

export default PageFlow;
