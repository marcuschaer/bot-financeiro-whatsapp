import express from "express";
import twilio from "twilio";

const app = express();

// Twilio envia x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Health + sanity endpoints (Render / você)
app.get("/", (req, res) => res.status(200).send("OK"));
app.get("/healthz", (req, res) => res.status(200).send("OK"));

// Webhook Twilio WhatsApp
app.post("/whatsapp", (req, res) => {
  try {
    console.log("BODY RECEBIDO:", req.body);

    const incomingText = (req.body.Body || "").trim();
    const from = req.body.From || "unknown";

    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();

    twiml.message(`✅ Bot ativo.\nDe: ${from}\nMensagem: ${incomingText || "(vazio)"}`);

    res.status(200).type("text/xml").send(twiml.toString());
  } catch (err) {
    console.error("ERRO /whatsapp:", err);
    // Evita retry infinito do Twilio
    res.status(200).send("OK");
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
