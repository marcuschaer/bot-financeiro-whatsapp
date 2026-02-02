// server.js (ESM)
import express from "express";
import twilio from "twilio";

const app = express();

// Twilio envia application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// =============================
// Health checks (Render)
// =============================
app.get("/", (req, res) => {
  return res.status(200).send("OK");
});

app.get("/healthz", (req, res) => {
  return res.status(200).send("OK");
});

// =============================
// WhatsApp webhook (Twilio)
// =============================
app.post("/whatsapp", (req, res) => {
  try {
    console.log("BODY RECEBIDO:", req.body);

    const incomingText = (req.body.Body || "").trim();

    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();

    // Resposta simples (confirmação)
    twiml.message(`✅ Bot ativo. Recebi: ${incomingText || "(vazio)"}`);

    // IMPORTANTE: responder 200 + XML
    res.status(200);
    res.type("text/xml");
    return res.send(twiml.toString());
  } catch (err) {
    console.error("ERRO /whatsapp:", err);
    return res.status(200).send("OK"); // evita retries agressivos do Twilio
  }
});

// =============================
// Start server
// =============================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
