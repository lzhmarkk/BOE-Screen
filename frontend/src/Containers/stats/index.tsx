import React, {useEffect, useState} from "react"
import {genGraphs, genImageWall, IStatsDataGraph, IStatsDataImage} from "../../Components/stats"
import Axios from "axios";
import APIList from "../../API";
import {Card, message, Spin, Breadcrumb, Icon, Descriptions, Col, Row, Button, Popover} from "antd";
import ReactEcharts from "echarts-for-react";
import styles from './index.module.scss'
import {genPieGraph} from "../../Components/Texture/detail";
import {withRouter} from "react-router";

interface IStatsData {
    total: number
    bad_count: number
    bad_ratio: number
    avg_dirt_size: number
    max_dirt_size: number
    min_dirt_size: number
    avg_bad_size: number
    max_bad_size: number
    min_bad_size: number
    graph: IStatsDataGraph
    images: IStatsDataImage[]
    next_page: boolean
    prev_page: boolean
}

const PageStats = withRouter((prop) => {
    const page = prop.match.params.page ? prop.match.params.page : 1;
    const [statsData, setStatsData] = useState<IStatsData | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    //自动更新页面
    useEffect(() => {
        setLoading(true);
        Axios.get(APIList.stats(page))
            .then(res => {
                setStatsData(res.data);
                console.log(res);
                message.success(`成功获取第${page}页统计数据`);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                message.error("获取统计数据失败，请重试");
                setLoading(true);
            })
    }, []);
    const genEcharts = genGraphs(statsData ? statsData.graph : undefined);
    const genWall = genImageWall(statsData);
    const genPieCharts = genPieGraph(statsData);
    const content = <div>
        <Breadcrumb>
            <Breadcrumb.Item href={"/"}>
                <Icon type={'home'}/>
                <span>系统</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item href={"/stats/"}>
                <Icon type={'area-chart'}/>
                <span>统计和报表</span>
            </Breadcrumb.Item>
        </Breadcrumb>
        <Row>
            <Col span={16} className={styles.card}>
                <Card extra={<span>总良品率-{100 - (statsData === undefined ? 100 : (statsData.bad_ratio / 100))}%</span>}>
                    <Descriptions layout="vertical" bordered>
                        <Descriptions.Item label={'图片数量'}>
                            {statsData === undefined ? 0 : statsData.total}
                        </Descriptions.Item>
                        <Descriptions.Item label={"损坏数量"}>
                            {statsData === undefined ? 0 : statsData.bad_count}
                        </Descriptions.Item>
                        <Descriptions.Item label={"良品率"}>
                            {100 - (statsData === undefined ? 100 : (statsData.bad_ratio / 100))}%
                        </Descriptions.Item>
                        <Descriptions.Item label={"平均污点大小(像素)"}>
                            {statsData === undefined ? 0 : (statsData.avg_dirt_size / 100)}
                        </Descriptions.Item>
                        <Descriptions.Item label={"最小污点大小(像素)"}>
                            {statsData === undefined ? 0 : statsData.min_dirt_size}
                        </Descriptions.Item>
                        <Descriptions.Item label={"最大污点大小(像素)"}>
                            {statsData === undefined ? 0 : statsData.max_dirt_size}
                        </Descriptions.Item>
                        <Descriptions.Item label={"平均坏块大小(像素)"}>
                            {(statsData === undefined ? 0 : (statsData.avg_bad_size / 100))}
                        </Descriptions.Item>
                        <Descriptions.Item label={"最小坏块大小(像素)"}>
                            {statsData === undefined ? 0 : statsData.min_bad_size}
                        </Descriptions.Item>
                        <Descriptions.Item label={"最大坏块大小(像素)"}>
                            {statsData === undefined ? 0 : statsData.max_bad_size}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Col>
            <Col span={8} className={styles.card}>
                <Card>
                    <ReactEcharts option={genPieCharts}/>
                </Card>
            </Col>
        </Row>
        <Card className={styles.longCard}>
            <ReactEcharts option={genEcharts}/>
        </Card>
        <Card className={styles.longCard}>
            <div>{genWall}</div>
            <Button.Group className={styles.buttonGroup}>
                {statsData && statsData.prev_page ?
                    <Button type="primary" onClick={() => window.location.href = `/stats/${page - 1}`}>
                        <Icon type="left"/>
                        上一页
                    </Button> :
                    <Popover content={"没有上一页了"}>
                        <Button type="primary" disabled={statsData ? !statsData.prev_page : true}>
                            <Icon type="left"/>
                            上一页
                        </Button>
                    </Popover>
                }
                {statsData && statsData.next_page ?
                    <Button type="primary" onClick={() => window.location.href = `/stats/${page + 1}`}>
                        下一页
                        <Icon type="right"/>
                    </Button> :
                    <Popover content={"没有下一页了"}>
                        <Button type="primary" disabled={statsData ? !statsData.next_page : true}>
                            下一页
                            <Icon type="right"/>
                        </Button>
                    </Popover>
                }
            </Button.Group>
        </Card>
    </div>;
    return loading ? <Spin tip={'加载中'} size={'large'} className={styles.spin}/> : content;
});

export default PageStats;
