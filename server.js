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
app.post("/", (req, res) => {
  console.log("BODY RECEBIDO:", req.body);

  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message("✅ Bot ativo. Mensagem recebida.");

  res.status(200);
  res.type("text/xml");
  res.send(twiml.toString());

  setImmediate(() => {
    console.log("PROCESSANDO:", req.body.Body);
  });
});



// Porta dinâmica do Render
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
