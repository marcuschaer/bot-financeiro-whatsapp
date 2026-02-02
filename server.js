const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();

// ⚠️ OBRIGATÓRIO para Twilio
app.use(bodyParser.urlencoded({ extended: false }));

// Health check (opcional, mas útil)
app.get("/", (req, res) => {
  res.send("OK");
});

// Endpoint do WhatsApp
app.post("/whatsapp", (req, res) => {
  console.log("BODY RECEBIDO:", req.body);

  const mensagem = req.body.Body || "mensagem vazia";

  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(`Recebi: ${mensagem}`);

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

// Porta dinâmica do Render
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
