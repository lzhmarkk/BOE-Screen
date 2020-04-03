/*
前后端沟通的API
 */
const BASE = "http://localhost:8000";
export const APIList = {
    flow: `${BASE}/api/flow/`,
    image: (id: number) => `${BASE}/api/image/${id}`,
    texture: `${BASE}/api/texture/index`,
    textureDetail: (id: number) => `${BASE}/api/texture/${id}`,
    stats: `${BASE}/api/stats/`,
};

export default APIList;
