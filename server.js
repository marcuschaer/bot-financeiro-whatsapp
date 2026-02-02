const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// 🔹 ROTA DE TESTE (opcional, só pra não ver "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Bot financeiro rodando 🚀");
});

// 🔹 ROTA DO WHATSAPP (ESSA É A IMPORTANTE)
app.post("/whatsapp", (req, res) => {
  const incomingMsg = req.body.Body?.toLowerCase() || "";

  let responseText = "Não entendi. Exemplo: Gastei 30 reais no cartão C6 Marcus";

  if (incomingMsg.includes("gastei")) {
    responseText = "💸 Gasto registrado! (em breve vai para a planilha)";
  }

  if (incomingMsg.includes("saldo")) {
    responseText = "📊 Seu saldo atual será informado em breve.";
  }

  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(responseText);

  res.type("text/xml");
  res.send(twiml.toString());
});

// 🔹 PORTA OBRIGATÓRIA DO RENDER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
