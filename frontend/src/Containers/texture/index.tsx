import React, {useState, useEffect} from "react"
import Axios from 'axios';
import {Button, Table, message} from 'antd';
import fakeTextureInfo from "../../Assets/fakeTextureInfo";
import {GenColumns, GenGraphs} from "../../Components/Texture";
import style from './index.module.scss'
import {ITextureInfo} from '../../Components/Texture';
import APIList from "../../API";
import ISearchPanel from "./form";

//todo: 按照纹理分类
//接口参考components/texture/index.tsx
const PageTextureIndex = () => {
    const [textureData, setTextureData] = useState<ITextureInfo[]>(fakeTextureInfo);
    const [tableData, setTableData] = useState(textureData);
    const [rowid, setRowid] = useState('-1');

    //自动更新页面
    useEffect(() => {
        Axios.get(APIList.texture)
            .then(res => {
                console.log(res);
                setTextureData(res.data.textures);
                setTableData(res.data.textures);
                message.success("成功获取纹理数据");
            })
            .catch(err => {
                console.log(err);
                message.error("获取纹理数据失败");
            })
    }, []);
    const Action = (props: { record: any }) => <div>
        <Button type={rowid === props.record.texture_id ? 'primary' : "dashed"}
                onClick={() => window.location.href = `/texture/${props.record.texture_id}`}>查看详情</Button>
    </div>;
    const genColumns = GenColumns(Action);
    const genGraphs = GenGraphs(textureData);
    //todo: echarts表单，点击GenGraphs进入补充
    return (
        <div>
            <span>
                纹理主页
            </span>
            <div>{genGraphs}</div>
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
        </div>
    )
};

export default PageTextureIndex;