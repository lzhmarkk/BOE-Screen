import React from "react";

export interface ITextureDetail {
    texture_id: number
    texture_name: string
    total: number
    bad_count: number
    bad_ratio: number
    avg_dirt_size: number
    min_dirt_size: number
    max_dirt_size: number
    avg_bad_size: number
    min_bad_size: number
    max_bad_size: number
    dirt_images: ITextureDetailImage[]
    bad_images: ITextureDetailImage[]
}

interface ITextureDetailImage {
    image_id: number
    image_name: string
    time: any
    pred: number
    size: string
    area: number
    ratio: number
}

//todo: 增加百分比的显示
export const genPieGraph = (prop: any) => {
    return (
        {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 10,
                data: ['未损坏', '损坏']
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        {
                            value: prop ? prop.bad_count : 0,
                            name: '损坏',
                            itemStyle: {
                                normal: {
                                    color: '#C00000'
                                }
                            }
                        },
                        {
                            value: prop ? prop.total - prop.bad_count : 0,
                            name: '未损坏',
                            itemStyle: {
                                normal: {
                                    color: '#00C000'
                                }
                            }
                        },
                    ]
                }
            ]
        });
};

export const GenColumns = (Action: (props: { record: any }) => JSX.Element, broken: boolean) => [
    {
        dataIndex: "image_id", title: "图片序号", key: "image_id",
        sorter: (a: any, b: any) => parseInt(a.image_id) - parseInt(b.image_id),
    },
    {
        dataIndex: "image_name", title: "图片名称", key: "image_name",
    },
    {
        dataIndex: "time", title: "时间", key: "time",
        sorter: (a: any, b: any) => parseInt(a.time) - parseInt(b.time)
    },
    {
        dataIndex: "pred", title: "图片类型", key: "pred",
    },
    {
        dataIndex: "size", title: "图片大小", key: "size",
        sorter: (a: any, b: any) => parseInt(a.size) - parseInt(b.size),
    },
    {
        dataIndex: "area", title: broken ? "坏块大小(像素)" : "污点大小(像素)", key: "area",
        sorter: (a: any, b: any) => parseInt(a.area) - parseInt(b.area),
    },
    {
        dataIndex: "ratio", title: broken ? "坏块比例" : "污点比例", key: "ratio",
        sorter: (a: any, b: any) => parseInt(a.ratio) - parseInt(b.ratio),
        render: (_: any, record: any, ___: any) => <div>{Math.floor(100 * record.area / (1224 * 9)) / 100}%</div>
    },
    {
        dataIndex: "Action", title: "详情", key: "Action",
        render: (_: any, record: any, ___: any) => <Action record={record}/>
    },
];
