import React, {useState, useEffect} from "react"
import {withRouter} from "react-router";
import {Breadcrumb, Descriptions, Row, Col, Card, Tabs, Table, Button, message} from 'antd';
import {genPieGraph, GenColumns} from "../../../Components/Prodline/detail";
import ReactEcharts from "echarts-for-react";
import style from './index.module.scss';
import {fakeProdlineDetail} from "../../../Assets/fakeProdlineDetail";
import Axios from "axios";
import APIList from "../../../API";

const {TabPane} = Tabs;

const PageProdlineDetail = withRouter((prop) => {
    const id = prop.match.params.id;

    const [data, setData] = useState(fakeProdlineDetail(id));

    useEffect(() => {
        Axios.get(APIList.prodlineDetail(id))
            .then(res => {
                setData(res.data);
                console.log(res);
                message.success(`成功获取生产线${id}数据`);
            })
            .catch(err => {
                console.log(err);
                message.error(`获取生产线${id}数据失败`);
            })
    }, []);

    const Action = (props: { record: any }) => <div>
        <Button onClick={() => window.location.href = `/image/${props.record.image_id}`}>查看详情</Button>
    </div>;
    const genPieCharts = genPieGraph(data);
    const getRatio = () => {
        return `${(1 - data.bad_ratio) * 100}%`
    };
    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item href={"/"}>
                    屏幕表面缺陷管理系统
                </Breadcrumb.Item>
                <Breadcrumb.Item href={"/prodline/"}>
                    生产线管理
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    {id}
                </Breadcrumb.Item>
            </Breadcrumb>
            <Row>
                <Col span={16} className={style.card}>
                    <Card title={data.prodline_name} extra={<span>良品率-{getRatio()}</span>}>
                        <Descriptions layout="vertical" bordered>
                            <Descriptions.Item label={'生产线序号'}>
                                {data.prodline_id}
                            </Descriptions.Item>
                            <Descriptions.Item label={'生产线名称'} span={2}>
                                {data.prodline_name}
                            </Descriptions.Item>
                            <Descriptions.Item label={'图片数量'}>
                                {data.total}
                            </Descriptions.Item>
                            <Descriptions.Item label={"损坏数量"}>
                                {data.bad_count}
                            </Descriptions.Item>
                            <Descriptions.Item label={"良品率"}>
                                {getRatio()}
                            </Descriptions.Item>
                            <Descriptions.Item label={"平均污点大小(像素)"}>
                                {data.avg_dirt_size}
                            </Descriptions.Item>
                            <Descriptions.Item label={"最小污点大小(像素)"}>
                                {data.min_dirt_size}
                            </Descriptions.Item>
                            <Descriptions.Item label={"最大污点大小(像素)"}>
                                {data.max_dirt_size}
                            </Descriptions.Item>
                            <Descriptions.Item label={"平均坏块大小(像素)"}>
                                {data.avg_bad_size}
                            </Descriptions.Item>
                            <Descriptions.Item label={"最小坏块大小(像素)"}>
                                {data.min_bad_size}
                            </Descriptions.Item>
                            <Descriptions.Item label={"最大坏块大小(像素)"}>
                                {data.max_bad_size}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
                <Col span={8} className={style.card}>
                    <Card>
                        <ReactEcharts option={genPieCharts}/>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col className={style.card}>
                    <Card>
                        <Tabs type={"card"}>
                            <TabPane tab={"未损坏"} key={"1"}>
                                <Table dataSource={data.dirt_images} columns={GenColumns(Action, false)}/>
                            </TabPane>
                            <TabPane tab={"已损坏"} key={"2"}>
                                <Table dataSource={data.bad_images} columns={GenColumns(Action, true)}/>
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col></Row>
        </div>
    )
});
export default PageProdlineDetail;