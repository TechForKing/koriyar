import axios from "axios";

export const parseOrderText = async (userText) => {
    const systemPrompt = `You are Shipping agent bot & the data parser. Convert the user message into the following JSON format.

                            Required JSON structure:
                            {
                              isAddress : true / false,
                              if ( true ){ 
                                //transform the user message in this format 
                                "pickup_pincode": 110051 ( always to be this only )
                                "delivery_pincode": ,
                                "payment_type": "PREPAID / COD",
                                "shipment_type": "FORWARD",
                                "order_amount": 1000,
                                "type_of_package": "SPS",
                                "rov_type": "ROV_OWNER",
                                "cod_amount": "" ( fill this same when payment_type is COD),
                                "weight": 500 ( in gm ),
                                "dimensions": ( take this default if not given ) [
                                    {
                                    "no_of_box": "1",
                                    "length": "22",
                                    "width": "20",
                                    "height": "10"
                                    }
                                ]
                              }else{
                                "answer" : Return the relevant answer to user query
                              }
                            }

                            Follow these rules:
                            - Extract fields directly from the text where available.
                            - Leave values blank ("") if not provided.
                            - Only respond with valid raw JSON.
                            - Do not add explanations, markdown, or comments.

                            Now parse this:
                            ${userText}`;

    const response = await axios
        .post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: systemPrompt }],
                    },
                ],
            },
            {
                "Content-Type": "application/json",
            }
        )
        .then((response) => {
            const rawText = response.data.candidates[0].content.parts[0].text;
            return rawText.replace(/```json|```/g, "").trim();
        })
        .catch((error) => {
            console.error("Error:", error.response?.data || error.message);
        });

    return response;
}
