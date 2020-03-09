import React, {useEffect, useState} from "react"
import {genGraphs} from "../../Components/stats"
import Axios from "axios";
import APIList from "../../API";
import {message} from "antd";

const PageStats = () => {
    const [statsData, setStatsData] = useState(undefined);
    //todo: 设计UI
    //todo: 做echarts
    //todo: 讨论这个页面怎么展示东西

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
    return (
        <div>
            <span>
                这里怎么设计@郭 @邓
                统计和报表
            </span>
            <div>
                {genEcharts}
            </div>
        </div>
    )
};

export default PageStats;