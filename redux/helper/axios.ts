import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  headers: {
    
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
        config.headers.Authorization = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZWM5ZDdkYS0wMWJjLTQxZTctOThjOC1kZTIyNGVlYTRmNWIiLCJqdGkiOiJmZWQ1ZmRjMjQwNDNkM2RkMWJkODMyZGIzNjRmZDI1NzM1Nzc2YmY1YmZhZmY1ZTg0ODYwOTg2ZGExNmJhYTIwMjc4ZTM2NjkzOWE5NTEzYiIsImlhdCI6MTc1NDI5NTgzMS44Njk1MjgsIm5iZiI6MTc1NDI5NTgzMS44Njk1MywiZXhwIjoxNzcwMTkzNDMxLjg0ODE2Niwic3ViIjoiMSIsInNjb3BlcyI6W119.dbdd_XRI5pV5qBhe410LeVFIeheu-FE5wIYpk3QZ48xpN8uvo8VuHyWnrbYZOnDnVL5CEGXwD_vni_CrzIKO6yISF__6sW_7fVAXpMiMQIEbeGokx-PlYBvSOLueV9kUuLjAXzBy1WgECUuNoxs9kTUOLxD4hIyGr48rFhZ9xcmRlCB37v6DeNLfMZLxUFxS1uDYILt1sosyKQbYqxz3XNSwaE-b9or94azoRrcm2YyXkZrXUY77X9_NHrBAB20QHJkyWpbdI0JOpa3yiF8vK0ezX1p3XCcqUGE1NXwfpptTeyy2x8FoTkzBkqyK_i2wVTMa2pOZ_AtNEoksCyT-Y5zBw8y8tc99OoSFyQ3I0q4dpDxjygreVVAO7byl5v5Dd3d-eBJzmex0Cui1FLtpGUSsum_iiRRLkkRhnl7qxgaLhXilEFDzhpRsxtDVe4b-YJg4GAd3OhXP0IeeIeZaxt_KYGfpPtLPo-mNH1SZIuT1OKbSF-lvb_5CpofbILZtSx78yDxUfutKygT25qHV7Z5xl_Fuq1XRnJG4jJRJ-I7fyadb7m7_NmoFH5Os3oI4Ityxn_V38wbCHCClErZXMxuxhkeIUhy0aTrQsDcw6Z9tK_WIqzlwcoem0Dnv8Ar6ykV8B2mG_Fe39xwnNdfbnLho_tZ4UtEBB_cYaSdFLhY`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
