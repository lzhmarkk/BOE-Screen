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
import IEditImageForm, {IEditImageFormPayload} from "../../../Components/flow";

interface IPageFlowDetail extends RouteComponentProps {
    image_name: string
    image_size: string
    class?: string
    bad_size?: number
    bad_ratio?: number
    dirt_size?: number
    dirt_ratio?: number
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

    const [data, setData] = useState<any>({
        image: undefined,
        image_name: "null",
        prodline_name: "null",
        class: undefined,
        mask: undefined
    });

    const handlePost = (data: any) => {
        Axios.post(APIList.image(kind), data)
            .then(res => {
                console.log(res);
                update();
            })
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
                console.log(res);
                setData(res);
                setLoading(false);
                message.success(`成功获取图片${kind}信息`);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                message.error(`获取图片${kind}信息失败`);
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
                            pic0
                        </Descriptions.Item>
                        <Descriptions.Item label={'图片大小'}>
                            1224 * 900
                        </Descriptions.Item>
                        <Descriptions.Item label={'图片类型'} span={2}>
                            损坏
                        </Descriptions.Item>
                        <Descriptions.Item label={'上传时间'}>
                            2020-4-8 12:41:41
                        </Descriptions.Item>
                        <Descriptions.Item label={'损坏大小(像素)'} span={2}>
                            19319
                        </Descriptions.Item>
                        <Descriptions.Item label={'损坏占比%'}>
                            1.41%
                        </Descriptions.Item>
                        <Descriptions.Item label={'污点大小(像素)'} span={2}>
                            90013
                        </Descriptions.Item>
                        <Descriptions.Item label={'污点占比%'}>
                            0.4%
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
                handlePost(editImage);
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

    return loading ? <Spin/> : content;
});

export default PageFlowDetail;
