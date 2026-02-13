import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import axios from "axios";
import ejs from "ejs";
import dotenv from "dotenv";
const port = 5000;
dotenv.config();

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const apiKey = process.env.API_KEY_NAME;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/get-weather", async (req, res) => {
  const latitude = req.body["latitude"];
  const longitude = req.body["longitude"];
  try {
    const response = await axios.get(
      `https://weatherbit-v1-mashape.p.rapidapi.com/forecast/3hourly?lat=${latitude}&lon=${longitude}&units=imperial&lang=en`,
      {
        headers: {
          "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com",
          "x-rapidapi-key": `${apiKey}`,
        },
      }
    );

    res.render("index", {
      weatherData: response.data,
      latitude,
      longitude,
      error: null,
    });
  } catch (err) {
    console.log(err);
    res.render("index", {
      weatherData: null,
      latitude: latitude || null,
      longitude: longitude || null,
      error: "Error, please try again",
    });
    return;
  }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log("");
});
