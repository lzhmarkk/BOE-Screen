import React, {useEffect, useState} from "react"
import {genGraphs} from "../../Components/stats"
import Axios from "axios";
import APIList from "../../API";
import {Card, message, Table, Spin} from "antd";
import ReactEcharts from "echarts-for-react";
import styles from './index.module.scss'

interface IStatsData {
    textures: string[]
    bad: number[]
    dirt: number[]
}

const PageStats = () => {
    const [statsData, setStatsData] = useState<IStatsData | any>({
        textures: ["text1", "text2", "text3"],
        bad: [12, 45, 0],
        dirt: [0, 45, 12]
    });
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
                message.error("获取统计数据失败");
                setLoading(false);
            })
    }, []);
    const genEcharts = genGraphs(statsData);
    const dataSource = [
        {
            id: 'texture1',
            count: '100',
            true_rate: '50/120',
            false_rate: '70/120',
            info: 'None',
        },
        {
            id: 'texture2',
            count: '123',
            true_rate: '3/5',
            false_rate: '2/5',
            info: 'None',
        },
        {
            id: 'texture3',
            count: '6',
            true_rate: '33/50',
            false_rate: '17/50',
            info: 'lzhsb',
        },
    ];
    const columns = [
        {
            title: '纹理id',
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
    const content = <div>
        <Card className={styles.card}>
            <ReactEcharts option={genEcharts}/>
        </Card>
        <Card className={styles.card}>
            <Table dataSource={dataSource} columns={columns}/>
        </Card>
    </div>;
    return loading ? <Spin/> : content;
};

export default PageStats;
