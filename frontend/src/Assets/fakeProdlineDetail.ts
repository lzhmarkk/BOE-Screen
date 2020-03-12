export const fakeProdlineDetail = (id: number) => {
    return ({
        prodline_id: id,
        prodline_name: "prodline name",
        total: "500",
        bad_count: "120",
        bad_ratio: 120 / 500,
        avg_dirt_size: 400,
        min_dirt_size: 20,
        max_dirt_size: 50131,
        avg_bad_size: 102,
        min_bad_size: 10,
        max_bad_size: 141414,
        dirt_images: [
            {
                image_id: "12",
                image_name: "picture 12",
                time: "2020-03-14 12:04:33",
                class: "污点",
                size: "1224 * 900",
                dirt: "3725",
                dirt_ratio: `${3725 / (1224 * 900)}`
            },
            {
                image_id: "24",
                image_name: "picture 24",
                time: "2020-03-14 12:04:33",
                class: "污点",
                size: "1224 * 900",
                dirt: "14",
                dirt_ratio: `${14 / (1224 * 900)}`
            },
            {
                image_id: "6",
                image_name: "picture 6",
                time: "2020-03-14 12:04:33",
                class: "污点",
                size: "1224 * 900",
                dirt: "1351531",
                dirt_ratio: `${1351531 / (1224 * 900)}`
            },
        ],
        bad_images: [
            {
                image_id: "21",
                image_name: "picture 21",
                time: "2020-03-14 12:04:33",
                class: "损坏",
                size: "1224 * 900",
                bad: "3242",
                bad_ratio: `${3242 / (1224 * 900)}`
            },
            {
                image_id: "42",
                image_name: "picture 42",
                time: "2020-03-14 12:04:33",
                class: "损坏",
                size: "1224 * 900",
                bad: "141",
                bad_ratio: `${141 / (1224 * 900)}`
            },
            {
                image_id: "9",
                image_name: "picture 69",
                time: "2020-03-14 12:04:33",
                class: "损坏",
                size: "1224 * 900",
                bad: "1441414",
                bad_ratio: `${1441414 / (1224 * 900)}`
            },
        ]
    });
};