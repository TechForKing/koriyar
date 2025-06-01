import axios from "axios";


export const rateCalulator = async (data) => {
    const response = await axios.post("https://shipping-api.com/app/api/v1/rate-calculator", data, {
        headers: {
            "Content-Type": "application/json",
            "public-key": process.env.SHIPMOZO_PUBLIC_KEY,
            "private-key": process.env.SHIPMOZO_PRIVATE_KEY
        }
    }).then(({data}) => {
        return data;
    }).catch((err) => {
        console.log("Error ", err);
    });

    return response;
}