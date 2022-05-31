const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const ytdl = require("ytdl-core");
const fs = require("fs");
// port
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.static(__dirname + "/src/static"));
app.set("views", "./src/controllers/views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  try {
    res.render("main-view");
  } catch (error) {
    res.send("<h2>Something went wrong</h2>");
  }
});

app.get("/download", async (req, res) => {
  try {
    const url = req.query.url;
    const stream = ytdl(url, {
      quality: "highestaudio",
    });

    const videoInfo = await ytdl.getInfo(url);
    const filePath = `${__dirname}/tmp/${videoInfo.videoDetails.title}.mp3`;

    const proc = ffmpeg({ source: stream })
      .setFfmpegPath("ffmpeg")
      .toFormat("mp3")
      .saveToFile(filePath)
      .on("end", () => {
        res.download(filePath, (err) => {
          if (err) throw new Error("Failed");
          fs.unlinkSync(filePath);
          res.redirect("/");
        });
      });
  } catch (error) {
    res.send(error);
  }
});

app.listen(PORT);
