import React from "react";
import {Tag, Tooltip} from "antd";

export interface IProdlineInfo {
    prodline_id: string,
    prodline_name: string,
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
        dataIndex: "prodline_id", title: "生产线序号", key: "prodline_id",
        sorter: (a: IProdlineInfo, b: IProdlineInfo) => parseInt(a.prodline_id) - parseInt(b.prodline_id),
    },
    {
        dataIndex: "prodline_name", title: "生产线名称", key: "prodline_name",
        render: (_: any, record: any, ___: any) => <a
            href={`/prodline/${record.prodline_id}`}>{record.prodline_name}</a>
    },
    {
        dataIndex: "total", title: "图片总数", key: "total",
        sorter: (a: IProdlineInfo, b: IProdlineInfo) => parseInt(a.total) - parseInt(b.total),
    },
    {
        dataIndex: "bad_count", title: "损坏数量", key: "bad_count",
        sorter: (a: IProdlineInfo, b: IProdlineInfo) => parseInt(a.bad_count) - parseInt(b.bad_count)
    },
    {
        dataIndex: "bad_ratio", title: "损坏比例%", key: "bad_ratio",
        sorter: (a: IProdlineInfo, b: IProdlineInfo) => parseInt(a.bad_ratio) - parseInt(b.bad_ratio),
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