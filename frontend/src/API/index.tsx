/*
前后端沟通的API
 */
const BASE = "http://localhost:8000";
export const APIList = {
    index: `${BASE}/api/index/`,
    repo: `${BASE}/api/repo/`,
    stats: `${BASE}/api/stats/`,
};

export default APIList;