import express from "express";
import bodyParser from "body-parser";
import { google } from "googleapis";
import twilio from "twilio";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Google Sheets
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

app.post("/whatsapp", async (req, res) => {
  const msg = (req.body.Body || "").toLowerCase();
  const from = req.body.From || "";

  const twiml = new twilio.twiml.MessagingResponse();

  const valorMatch = msg.match(/(\d+[.,]?\d*)/);
  if (!valorMatch) {
    twiml.message("Exemplo: gasto 30 comida credito c6 marcus");
    return res.type("text/xml").send(twiml.toString());
  }

  const valor = Number(valorMatch[1].replace(",", "."));
  const tipo = msg.includes("entrada") ? "ENTRADA" : "DESPESA";
  const meio = msg.includes("pix") ? "PIX" : msg.includes("debito") ? "DEBITO" : "CREDITO";

  let cartao = "";
  if (msg.includes("c6 marcus")) cartao = "CREDITO C6 MARCUS";
  if (msg.includes("c6 amanda")) cartao = "CREDITO C6 AMANDA";
  if (msg.includes("9169")) cartao = "CREDITO 9169";
  if (msg.includes("credito amanda")) cartao = "CREDITO AMANDA";

  const row = [
    new Date().toISOString(),
    new Date().toISOString().slice(0,10),
    tipo,
    valor,
    msg,
    "",
    meio,
    cartao,
    from
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "A:I",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });

  twiml.message("Registrado ✅");
  res.type("text/xml").send(twiml.toString());
});

app.listen(process.env.PORT || 3000);
