import React, {useState} from "react"
import {Button, Table} from 'antd';
import fakeProdlineInfo from "../../Assets/fakeProdlineInfo";
import {GenColumns} from "../../Components/Prodline";
import style from './index.module.scss'

const PageProdlineIndex = () => {
    const [prodlineData, setProdlineData] = useState(fakeProdlineInfo);

    const Action = (props: { record: any }) => <div>
        <Button type={'primary'}
                onClick={() => window.location.href = `/prodline/${props.record.prodline_id}`}>查看详情</Button>
    </div>;
    const genColumns = GenColumns(Action);
    const genRowClass = (record: any) => {
        const ratio = record.bad_ratio;
        if (ratio <= 5) {
            return style.green
        } else if (ratio <= 10) {
            return style.lime
        } else if (ratio <= 15) {
            return style.gold
        } else if (ratio <= 20) {
            return style.orange
        } else {
            return style.red
        }
    };
    return (
        <div>
            <span>
                这里是生产线页面主页
            </span>
            <Table dataSource={prodlineData} columns={genColumns} rowClassName={genRowClass}/>
        </div>
    )
};

export default PageProdlineIndex;