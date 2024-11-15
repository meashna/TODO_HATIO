// // src/services/api.js
// import axios from 'axios';

// // Base URL of your backend
// const API_BASE_URL = 'http://localhost:3000/api';

// // Function to create an Axios instance with Basic Auth
// const createApi = (username, password) => {
//     const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
//     return axios.create({
//         baseURL: API_BASE_URL,
//         headers: {
//             'Authorization': `Basic ${token}`,
//             'Content-Type': 'application/json',
//         },
//     });
// };

// export default createApi;

// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const createApi = (username, password) => {
    const token = btoa(`${username}:${password}`); // Use btoa instead of Buffer
    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Authorization': `Basic ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

export default createApi;

