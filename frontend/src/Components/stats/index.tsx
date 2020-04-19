import React from "react"
import {Col, Card, Row, Tag} from 'antd';

export interface IStatsDataImage {
    image_id: number
    image_name: string
    pred: number
    image: string
}

export interface IStatsDataGraph {
    textures: string[]
    bad_counts: number[]
    dirt_counts: number[]
}

const {Meta} = Card;

const genTag = (pred: number) => {
    return (
        pred === 1 ?
            <Tag color={"red"}>损坏</Tag> :
            <Tag color={"green"}>污点</Tag>
    )
};

export const genGraphs = (prop: IStatsDataGraph | undefined) => {
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
            data: prop ? prop.textures : undefined
        },
        series: [
            {
                name: '损坏',
                type: 'bar',
                stack: '总量',
                data: prop ? prop.bad_counts : undefined,
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
                data: prop ? prop.dirt_counts : undefined,
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

export const genImageWall = (prop: { images: IStatsDataImage[] } | undefined) => {
    const IMAGESPERLINE = 6;
    const images = prop === undefined ? [] : prop.images;
    const genLine = (imgs: IStatsDataImage[]) => {
        return imgs.map(e =>
            <Col span={24 / IMAGESPERLINE}>
                <Card hoverable onClick={() => window.location.href = `/flow/${e.image_id}`}
                      cover={<img src={e.image} alt={e.image_name}/>}>
                    <Meta title={e.image_name} description={genTag(e.pred)}/>
                </Card>
            </Col>)
    };
    const genWall = () => {
        var res = [];
        for (var l = 0; l < images.length / IMAGESPERLINE; l++) {
            res.push(
                <Row>
                    {genLine(images.slice(l * IMAGESPERLINE, l * IMAGESPERLINE + IMAGESPERLINE))}
                </Row>)
        }
        return res;
    };
    return (<div>
        {genWall()}
    </div>)
};
