import React, {useEffect, useState} from "react"
import {genGraphs} from "../../Components/stats"
import Axios from "axios";
import APIList from "../../API";
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
    Table,
    Spin
} from "antd";
import {fakeProdlineDetail} from "../../Assets/fakeProdlineDetail";
import ReactEcharts from "echarts-for-react";
import {genPieGraph} from "../../Components/stats/detail";

const PageStats = () => {
    const [statsData, setStatsData] = useState(undefined);
    //todo: 设计UI
    //todo: 做echarts
    //todo: 讨论这个页面怎么展示东西

    const [data, setData] = useState(fakeProdlineDetail(1));
    const genPieCharts = genPieGraph(data);

    //自动更新页面
    useEffect(() => {
        Axios.get(APIList.stats)
            .then(res => {
                setStatsData(res.data);
                console.log(res);
                message.success("成功获取统计数据");
            })
            .catch(err => {
                console.log(err);
                message.error("获取统计数据失败");
            })
    }, []);
    const genEcharts = genGraphs(statsData);
    const dataSource = [
        {
            id: 'line1',
            count: '100',
            true_rate: '50/120',
            false_rate: '70/120',
            info: 'None',
        },
        {
            id: 'line2',
            count: '123',
            true_rate: '3/5',
            false_rate: '2/5',
            info: 'None',
        },
        {
            id: 'line3',
            count: '6',
            true_rate: '33/50',
            false_rate: '17/50',
            info: 'lzhsb',
        },
    ];
    const columns = [
        {
            title: '生产线id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '图片数量',
            dataIndex: 'count',
            key: 'count',
        },
        {
            title: '正确率',
            dataIndex: 'true_rate',
            key: 'true_rate',
        },
        {
            title: '错误率',
            dataIndex: 'false_rate',
            key: 'false_rate',
        },
        {
            title: '备注信息',
            dataIndex: 'info',
            key: 'info',
        }
    ];

    return (
        <div>
            <span>
                这里怎么设计@郭 @邓
                统计和报表
            </span>
            <div>
                {genEcharts}
                <Table dataSource={dataSource} columns={columns} />
            </div>
            <Row>
                <Card>
                    <ReactEcharts option={genPieCharts}/>
                </Card>
            </Row>
        </div>
    )
};

export default PageStats;