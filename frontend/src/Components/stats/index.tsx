import React from "react"

export const genGraphs = (prop: any) => {
    return ({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
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
        legend: {
            data: ['损坏', '污渍']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: prop === undefined ? [] : prop.textures,
        },
        series: [
            {
                name: '损坏',
                type: 'bar',
                stack: '总量',
                data: prop === undefined ? [] : prop.bad,
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
                data: prop === undefined ? [] : prop.dirt,
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
    })
};

export const genImageWall = (prop: { images: any[] } | undefined) => {
    const images = prop === undefined ? [] : prop.images;
    //todo add wall
    return (<div>this is wall</div>)
};
