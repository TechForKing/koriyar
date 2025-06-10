import axios from "axios";

export const sendRateMessage = async ({ data }) => {
    let message = "*Here are your shipping options:*\n\n";

    const sortedData = [...data].sort((a, b) => a.total_charges - b.total_charges);

    sortedData.slice(0, 4).forEach((item, index) => {
        message += `${index + 1}. *${item.name}*\n`;
        message += `   🚚 Estimated Delivery: ${item.estimated_delivery}\n`;
        message += `   💰 Total Charges: ₹${Math.round(item.total_charges)}\n`;
        message += `   ⚖️ Minimum Weight: ${item.minimum_chargeable_weight}\n\n`;
    });


    await axios.post("https://graph.facebook.com/v22.0/727792423740049/messages", {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "919667067062",
        type: "text",
        text: {
            preview_url: false,
            body: message
        }
    }, {
        headers: {
            "Authorization": `Bearer ${process.env.GRAPH_API_TOKEN}`
        }
    }).then(() => {
        console.log("sent");
    }).catch((err) => {
        console.log("Error :- ", err);
    });
}

export const sendTextMessage = async (message) => {

    await axios.post("https://graph.facebook.com/v22.0/727792423740049/messages", {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "919667067062",
        type: "text",
        text: {
            preview_url: false,
            body: message
        }
    }, {
        headers: {
            "Authorization": `Bearer ${process.env.GRAPH_API_TOKEN}`
        }
    }).then(() => {
        console.log("sent");
    }).catch((err) => {
        console.log("Error :- ", err);
    });
}


export const sendTypingIndicator = async (messageID) => {
    await axios.post("https://graph.facebook.com/v22.0/727792423740049/messages", {
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageID,
        typing_indicator: {
            type: "text"
        }
    }, {
        headers: {
            "Authorization": `Bearer ${process.env.GRAPH_API_TOKEN}`
        }
    }).then(() => {
        console.log("sent indicator");
    }).catch((err) => {
        console.log("Error :- ", err);
    });
}