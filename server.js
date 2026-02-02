const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * ROTA DE TESTE (NAVEGADOR)
 */
app.get("/", (req, res) => {
  res.send("Bot financeiro WhatsApp está online ✅");
});

/**
 * ROTA DO TWILIO (WHATSAPP)
 */
app.post("/whatsapp", (req, res) => {
  console.log("BODY RECEBIDO:", req.body);

  const mensagem = req.body.Body || "mensagem vazia";

  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(`Recebi: ${mensagem}`);

  res.type("text/xml");
  res.send(twiml.toString());
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
