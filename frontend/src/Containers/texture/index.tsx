import React, {useState, useEffect} from "react"
import Axios from 'axios';
import {Button, Table, message, Spin, Card} from 'antd';
import fakeTextureInfo from "../../Assets/fakeTextureInfo";
import {GenColumns, GenGraphs} from "../../Components/Texture";
import style from './index.module.scss'
import {ITextureInfo} from '../../Components/Texture';
import APIList from "../../API";
import ISearchPanel from "./form";
import ReactEcharts from "echarts-for-react";

//接口参考components/texture/index.tsx
const PageTextureIndex = () => {
    const [textureData, setTextureData] = useState<ITextureInfo[]>(fakeTextureInfo);
    const [tableData, setTableData] = useState(textureData);
    const [rowid, setRowid] = useState('-1');
    const [loading, setLoading] = useState(true);

    //自动更新页面
    useEffect(() => {
        setLoading(true);
        Axios.get(APIList.texture)
            .then(res => {
                console.log(res);
                setTextureData(res.data.textures);
                setTableData(res.data.textures);
                message.success("成功获取纹理数据");
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                message.error("获取纹理数据失败");
                setLoading(false);
            })
    }, []);
    const Action = (props: { record: any }) => <div>
        <Button type={rowid === props.record.texture_id ? 'primary' : "dashed"}
                onClick={() => window.location.href = `/texture/${props.record.texture_id}`}>查看详情</Button>
    </div>;
    const genColumns = GenColumns(Action);
    const genGraphs = GenGraphs(textureData);
    const content =
        <div>
            <Card className={style.card}>
                <ReactEcharts option={genGraphs}/>
            </Card>
            <Card className={style.card}>
                <div className={style.ControlPanel}>
                    <ISearchPanel
                        onSearch={e => !e.content ? setTableData(textureData) :
                            setTableData(textureData.filter((k: any) => (k["texture_name"] as string).indexOf(e.content) !== -1))}
                        onClear={() => setTableData(textureData)}
                    />
                </div>
                <Table size={'small'} dataSource={tableData} columns={genColumns}
                       rowClassName={(record: any) => {
                           return rowid === record.texture_id ? style.void : style.void;
                       }}
                       onRow={(record, index) => {
                           return {
                               onMouseEnter: event => {
                                   setRowid(record.texture_id);
                               },
                               onMouseLeave: event => {
                                   setRowid('-1');
                               }
                           }
                       }}
                />
            </Card>
        </div>;
    return loading ? <Spin tip={'加载中'} size={'large'} className={style.spin}/> : content;
};

export default PageTextureIndex;
