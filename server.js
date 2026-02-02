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

  // 1) responde IMEDIATO
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message("OK, recebi. Processando...");

  res.status(200);
  res.type("text/xml");
  res.send(twiml.toString());

  // 2) processa DEPOIS (Sheets/OpenAI/etc)
  setImmediate(async () => {
    try {
      const msg = req.body.Body || "";
      // TODO: sua lógica pesada aqui
      console.log("PROCESSANDO:", msg);
    } catch (e) {
      console.error("ERRO NO PROCESSAMENTO:", e);
    }
  });
});


// Porta dinâmica do Render
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
