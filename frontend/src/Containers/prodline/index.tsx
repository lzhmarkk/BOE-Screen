import React, {useState, useEffect} from "react"
import Axios from 'axios';
import {Button, Table, message} from 'antd';
import fakeProdlineInfo from "../../Assets/fakeProdlineInfo";
import {GenColumns, GenGraphs} from "../../Components/Prodline";
import style from './index.module.scss'
import {IProdlineInfo} from '../../Components/Prodline';
import APIList from "../../API";
import ISearchPanel from "./form";

//todo: 按照纹理分类
//接口参考components/prodline/index.tsx
const PageProdlineIndex = () => {
    const [prodlineData, setProdlineData] = useState<IProdlineInfo[]>(fakeProdlineInfo);
    const [tableData, setTableData] = useState(prodlineData);
    const [rowid, setRowid] = useState('-1');

    //自动更新页面
    useEffect(() => {
        Axios.get(APIList.prodline)
            .then(res => {
                console.log(res);
                setProdlineData(res.data.prodlines);
                setTableData(res.data.prodlines);
                message.success("成功获取生产线数据");
            })
            .catch(err => {
                console.log(err);
                message.error("获取生产线数据失败");
            })
    }, []);
    const Action = (props: { record: any }) => <div>
        <Button type={rowid === props.record.prodline_id ? 'primary' : "dashed"}
                onClick={() => window.location.href = `/prodline/${props.record.prodline_id}`}>查看详情</Button>
    </div>;
    const genColumns = GenColumns(Action);
    const genGraphs = GenGraphs(prodlineData);
    //todo: echarts表单，点击GenGraphs进入补充
    return (
        <div>
            <span>
                生产线页面主页
            </span>
            <div>{genGraphs}</div>
            <div className={style.ControlPanel}>
                <ISearchPanel
                    onSearch={e => !e.content ? setTableData(prodlineData) :
                        setTableData(prodlineData.filter((k: any) => (k["prodline_name"] as string).indexOf(e.content) !== -1))}
                    onClear={() => setTableData(prodlineData)}
                />
            </div>
            <Table size={'small'} dataSource={tableData} columns={genColumns}
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
