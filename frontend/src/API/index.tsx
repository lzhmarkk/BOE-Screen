/*
前后端沟通的API
 */
const BASE = "http://localhost:8000";
export const APIList = {
    flow: `${BASE}/api/flow/`,
    image: (id: number) => `${BASE}/api/image/${id}`,
    prodline: `${BASE}/api/prodline/index`,
    prodlineDetail: (id: number) => `${BASE}/api/prodline/${id}`,
    stats: `${BASE}/api/stats/`,
};

export default APIList;