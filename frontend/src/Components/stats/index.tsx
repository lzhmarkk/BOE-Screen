export const genGraphs = (prop: any) => {
    return ({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
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
            data: prop.textures,
        },
        series: [
            {
                name: '损坏',
                type: 'bar',
                stack: '总量',
                data: prop.bad,
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
                data: prop.dirt,
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
