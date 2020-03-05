import React, {useState} from "react"
import {Button, Table} from 'antd';
import fakeProdlineInfo from "../../Assets/fakeProdlineInfo";
import {GenColumns} from "../../Components/Prodline";
import style from './index.module.scss'

const PageProdlineIndex = () => {
    const [prodlineData, setProdlineData] = useState(fakeProdlineInfo);
    const [rowid, setRowid] = useState('-1');

    const Action = (props: { record: any }) => <div>
        <Button type={rowid === props.record.prodline_id ? 'primary' : "dashed"}
                onClick={() => window.location.href = `/prodline/${props.record.prodline_id}`}>查看详情</Button>
    </div>;
    const genColumns = GenColumns(Action);
    return (
        <div>
            <span>
                这里是生产线页面主页
            </span>
            <Table size={'small'} dataSource={prodlineData} columns={genColumns}
                   rowClassName={(record: any) => {
                       return rowid === record.prodline_id ? style.void : style.void;
                   }}
                   onRow={(record, index) => {
                       return {
                           onMouseEnter: event => {
                               setRowid(record.prodline_id);
                           },
                           onMouseLeave: event => {
                               setRowid('-1');
                           }
                       }
                   }}
            />
        </div>
    )
};

export default PageProdlineIndex;