import React from "react";
import {Tag, Tooltip} from "antd";

export interface ITextureInfo {
    texture_id: string,
    texture_name: string,
    total: number
    bad_count: number
    bad_ratio: number
}

export interface ITextureGraphdata {
    textures: string[]
    bad: number[]
    dirt: number[]
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
        sorter: (a: ITextureInfo, b: ITextureInfo) => a.total - b.total,
    },
    {
        dataIndex: "bad_count", title: "损坏数量", key: "bad_count",
        sorter: (a: ITextureInfo, b: ITextureInfo) => a.bad_count - b.bad_count
    },
    {
        dataIndex: "bad_ratio", title: "损坏比例%", key: "bad_ratio",
        sorter: (a: ITextureInfo, b: ITextureInfo) => a.bad_ratio - b.bad_ratio,
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
    const textures = data.map(e => e.texture_name);
    const bad = data.map(e => e.bad_count);
    const dirt = data.map(e => e.total - e.bad_count);
    return ({
        title: {
            text: '纹理统计',
            subtext: '根据图片名前6位区分纹理',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['损坏', '污渍'],
            right: 100
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {
                    show: true,
                    type: ['pie', 'funnel']
                },
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: textures
        },
        series: [
            {
                name: '损坏',
                type: 'bar',
                stack: '总量',
                data: bad,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'insideRight'
                        },
                        color: '#C00000'
                    }
                }
            },
            {
                name: '污渍',
                type: 'bar',
                stack: '总量',
                data: dirt,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'insideRight'
                        },
                        color: '#00C000'
                    }
                }
            }
        ]
    });
};
