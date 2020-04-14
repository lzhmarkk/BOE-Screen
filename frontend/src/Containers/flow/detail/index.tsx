import React, {useState, useEffect} from "react"
import Axios from 'axios'
import {withRouter, RouteComponentProps} from "react-router";
import {
    Breadcrumb,
    Button,
    Icon,
    Card,
    Col,
    Row,
    Descriptions,
    Steps,
    Carousel,
    Modal,
    Empty,
    message,
    Spin
} from "antd";
import flow_style from "../index.module.scss"
import APIList from "../../../API";
import IEditImageForm, {genClass, genWeights, IEditImageFormPayload} from "../../../Components/flow";
import style from "../index.module.scss";

interface IPageFlowDetail extends RouteComponentProps {
    image?: string//图片
    time?: any
    mask?: string//图片mask
    image_name?: string//图片名
    texture_id?: number
    texture_name?: string//纹理名
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

const PageFlowDetail = withRouter((prop) => {
    const kind = prop.match.params.kind;
    const [carouselRef, setCarouselRef] = useState<any>(undefined);
    const [current, setCurrent] = useState(0);
    const [sliding, setSliding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);

    const [data, setData] = useState<IPageFlowDetail | any>({});

    const handlePut = (data: any) => {
        Axios.put(APIList.image(kind), data)
            .then(update)
            .catch(err => {
                console.log(err);
                message.error("更新图片失败")
            })
    };
    const handleDelete = () => {
        Axios.delete(APIList.image(kind), data)
            .then(res => {
                message.info(`成功删除图片${kind}`)
            }).catch(err => {
            message.error(`删除图片${kind}失败`)
        })
    };
    const update = () => {
        Axios.get(APIList.image(kind))
            .then(res => {
                console.log("收到数据", res);
                setData(res.data);
                message.success(`成功获取图片${kind}信息`);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                message.error(`获取图片${kind}信息失败，请重试`);
                setLoading(true);
            })
    };
    useEffect(() => {
        setLoading(true);
        update();
    }, []);

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
            <Col span={19}>
                <Breadcrumb>
                    <Breadcrumb.Item href={"/"}>
                        <Icon type={'home'}/>
                        <span>系统</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href={`/flow/${kind}`}>
                        <span>图片序号： {kind}</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </Col>
            <Col span={5}>
                <div className={flow_style.upload}>
                    <Button type={"primary"} onClick={() => setModal(true)}>修改类型</Button>
                    <Button type={"danger"} onClick={() => setModalDelete(true)}>删除</Button>
                </div>
            </Col>
        </Row>
        <Row>
            <Col>
                <Card>
                    <Descriptions bordered>
                        <Descriptions.Item label={'图片名'} span={2}>
                            {data.image_name}
                        </Descriptions.Item>
                        <Descriptions.Item label={'图片大小'}>
                            {data.size}
                        </Descriptions.Item>
                        <Descriptions.Item label={'纹理序号'} span={2}>
                            {data.texture_id}
                        </Descriptions.Item>
                        <Descriptions.Item label={'纹理名'}>
                            <a href={`/texture/${data.texture_id}`}>{data.texture_name}</a>
                        </Descriptions.Item>
                        <Descriptions.Item label={'图片类型'} span={2}>
                            {genClass(data.pred)}
                        </Descriptions.Item>
                        <Descriptions.Item label={'上传时间'}>
                            {data.time}
                        </Descriptions.Item>
                        <Descriptions.Item label={(data.pred === 1 ? '损坏' : '污点') + '大小(像素)'} span={2}>
                            {data.area}
                        </Descriptions.Item>
                        <Descriptions.Item label={(data.pred === 1 ? '损坏' : '污点') + '占比%'}>
                            {data.ratio ? data.ratio / 100 + "%" : undefined}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} label={"权重"}>
                            {genWeights(data.weights)}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Col>
        </Row>
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
                        <Empty description={current}/>
                }
            </Card>
            <Card>
                {
                    data.mask !== undefined ?
                        <div className={flow_style.image}>
                            <img src={data.mask} alt={"mask"}/>
                        </div>
                        :
                        <Empty description={current}/>
                }
            </Card>
        </Carousel>
        <IEditImageForm
            onSubmit={(e: IEditImageFormPayload) => {
                setModal(false);
                const editImage = {
                    "image_id": kind,
                    "class": e.class
                };
                console.log("表单数据", editImage);
                handlePut(editImage);
            }}
            modalOpen={modal}
            setModalOpen={setModal}/>
        <Modal visible={modalDelete}
               title={`删除图片${kind}`}
               onOk={() => {
                   setModalDelete(false);
                   handleDelete();
               }}
               onCancel={() => setModalDelete(false)}/>
    </div>;

    return loading ? <Spin tip={'加载中'} size={'large'} className={style.spin}/> : content;
});

export default PageFlowDetail;
