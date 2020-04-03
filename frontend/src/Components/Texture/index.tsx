import React from "react";
import {Tag, Tooltip} from "antd";

export interface ITextureInfo {
    texture_id: string,
    texture_name: string,
    total: string,
    bad_count: string,
    bad_ratio: string,
}

const getColor = (ratio: number) => {
    const colors = ['green', 'lime', 'gold', 'orange', 'red'];
    ratio = ratio / 5 < colors.length ? ratio / 5 : colors.length - 1;
    return colors[ratio];
};
const getDesc = (ratio: number) => {
    const colors = ['几乎无损坏', '良好', '略有损坏', '损坏较多', '损坏过多'];
    ratio = ratio / 5 < colors.length ? ratio / 5 : colors.length - 1;
    return colors[ratio];
};

export const GenColumns = (Action: (props: { record: any }) => JSX.Element) => [
    {
        dataIndex: "texture_id", title: "纹理序号", key: "texture_id",
        sorter: (a: ITextureInfo, b: ITextureInfo) => parseInt(a.texture_id) - parseInt(b.texture_id),
    },
    {
        dataIndex: "texture_name", title: "纹理名称", key: "texture_name",
        render: (_: any, record: any, ___: any) => <a
            href={`/texture/${record.texture_id}`}>{record.texture_name}</a>
    },
    {
        dataIndex: "total", title: "图片总数", key: "total",
        sorter: (a: ITextureInfo, b: ITextureInfo) => parseInt(a.total) - parseInt(b.total),
    },
    {
        dataIndex: "bad_count", title: "损坏数量", key: "bad_count",
        sorter: (a: ITextureInfo, b: ITextureInfo) => parseInt(a.bad_count) - parseInt(b.bad_count)
    },
    {
        dataIndex: "bad_ratio", title: "损坏比例%", key: "bad_ratio",
        sorter: (a: ITextureInfo, b: ITextureInfo) => parseInt(a.bad_ratio) - parseInt(b.bad_ratio),
        render: (_: any, record: any, ___: any) =>
            <Tooltip title={getDesc(record.bad_ratio)}>
                <Tag color={getColor(record.bad_ratio)}>{record.bad_ratio}%</Tag>
            </Tooltip>
    },
    {
        dataIndex: "Action", title: "详情", key: "Action",
        render: (_: any, record: any, ___: any) => <Action record={record}/>
    },
];

export const GenGraphs = (data: ITextureInfo[]) => {
    //todo @贺
    return (<div>
        柱状图
    </div>);
};
