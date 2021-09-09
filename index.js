const { Telegraf, Murkup } = require("telegraf");
const { Pool } = require("pg");
require("dotenv").config();
const text = require("./const");

const bot = new Telegraf(process.env.BOT_TOKEN);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
}).get("/db", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM test_table");
    const results = { results: result ? result.row : null };
    res.render("pages/db", results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send(err);
  }
});

bot.start((ctx) => ctx.reply(`Hello ${ctx.message.from.first_name}`));
bot.help((ctx) => ctx.reply(text.commands));

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
