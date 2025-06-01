import express from "express";
import { parseOrderText } from "./gemini.js";
import { config } from "dotenv";
import cors from "cors";
import localtunnel from "localtunnel"
import { rateCalulator } from "./shipmozo.js";
import { sendTextMessage, sendTypingIndicator } from "./whatsapp.js";

const app = express();
config();
app.use(express.json());
app.use(cors());

app.post("/webhook", async (req, res) => {
    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

    if (message?.type === "text") {
        sendTypingIndicator(message?.id);
        console.log(message.text.body);
        await parseOrderText(message.text.body).then(async (stringJson) => {
            console.log(JSON.parse(stringJson))
            await rateCalulator(JSON.parse(stringJson)).then(async (res) => {
                await sendTextMessage(res);
            })
        })
    }

    res.sendStatus(200);
});

app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
        console.log('✅ Webhook verified!');
        res.status(200).send(challenge);
    } else {
        console.log('❌ Verification failed');
        res.sendStatus(403);
    }
});

app.get("/", (req, res) => {
    res.send(`Hello Koriyar - 9667067062`);
});

app.listen(process.env.PORT, async () => {
    console.log(`Server is listening on port: ${process.env.PORT}`);
    const tunnel = await localtunnel({ port: 4000, subdomain: "mohit8181" });
    console.log(tunnel.url)
});
