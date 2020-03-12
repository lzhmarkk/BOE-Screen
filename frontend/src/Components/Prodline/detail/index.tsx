import React from "react";

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
                        {value: prop.total, name: '未损坏'},
                        {value: prop.bad_count, name: '损坏'},
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
        dataIndex: "class", title: "图片类型", key: "class",
    },
    {
        dataIndex: "size", title: "图片大小", key: "size",
        sorter: (a: any, b: any) => parseInt(a.size) - parseInt(b.size),
    },
    broken ?
        {
            dataIndex: "bad", title: "坏点大小(像素)", key: "bad",
            sorter: (a: any, b: any) => parseInt(a.bad) - parseInt(b.bad),
        } :
        {
            dataIndex: "dirt", title: "污点大小(像素)", key: "dirt",
            sorter: (a: any, b: any) => parseInt(a.dirt) - parseInt(b.dirt),
        },
    broken ?
        {
            dataIndex: "bad_ratio", title: "坏点比例", key: "bad_ratio",
            sorter: (a: any, b: any) => parseInt(a.bad_ratio) - parseInt(b.bad_ratio),
            render: (_: any, record: any, ___: any) => <div>{Math.ceil(record.bad_ratio * 100) / 100}%</div>
        } :
        {
            dataIndex: "dirt_ratio", title: "污点比例", key: "dirt_ratio",
            sorter: (a: any, b: any) => parseInt(a.dirt_ratio) - parseInt(b.dirt_ratio),
            render: (_: any, record: any, ___: any) => <div>{Math.ceil(record.dirt_ratio * 100) / 100}%</div>
        },
    {
        dataIndex: "Action", title: "详情", key: "Action",
        render: (_: any, record: any, ___: any) => <Action record={record}/>
    },
];