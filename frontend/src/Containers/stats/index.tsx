import React, {useEffect, useState} from "react"
import {genGraphs, genImageWall} from "../../Components/stats"
import Axios from "axios";
import APIList from "../../API";
import {Card, message, Spin, Breadcrumb, Icon, Descriptions} from "antd";
import ReactEcharts from "echarts-for-react";
import styles from './index.module.scss'

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
    //todo change interface to graph[]
    textures: string[]
    bad_counts: number[]
    dirt_counts: number[]
    images: {
        image_id: number
        image_name: string
        pred: number
        image: string
    }[]
}

const PageStats = () => {
    const [statsData, setStatsData] = useState<IStatsData | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    //自动更新页面
    useEffect(() => {
        setLoading(true);
        Axios.get(APIList.stats)
            .then(res => {
                setStatsData(res.data);
                console.log(res);
                message.success("成功获取统计数据");
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                message.error("获取统计数据失败，请重试");
                setLoading(true);
            })
    }, []);
    const genEcharts = genGraphs(statsData);
    const genWall = genImageWall(statsData);
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
        <Card className={styles.card}
              extra={<span>总良品率-{100 - (statsData === undefined ? 100 : (statsData.bad_ratio / 100))}%</span>}>
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
        <Card className={styles.card}>
            <ReactEcharts option={genEcharts}/>
        </Card>
        <Card className={styles.card}>
            {genWall}
        </Card>
    </div>;
    return loading ? <Spin tip={'加载中'} size={'large'} className={styles.spin}/> : content;
};

export default PageStats;
