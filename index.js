const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const ytdl = require("ytdl-core");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
// port
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.static(__dirname + "/src/static"));
app.set("views", "./src/controllers/views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  try {
    const { error } = req.query;

    res.render("main-view", { error });
  } catch (error) {
    res.send("<h2>Something went wrong</h2>");
  }
});

app.get(
  "/download",
  asyncHandler(async (req, res) => {
    const url = req.query.url;
    const errorUrl = "/?error=You put an invalid url";
    if (!url) return res.redirect(errorUrl);
    try {
      const stream = ytdl(url, {
        quality: "highestaudio",
      }).on("error", (err) => res.redirect(errorUrl));

      const videoInfo = await ytdl.getInfo(url);
      const filePath = `${__dirname}/tmp/${videoInfo.videoDetails.title}.mp3`;
      ffmpeg({ source: stream })
        .setFfmpegPath("ffmpeg")
        .toFormat("mp3")
        .pipe(res)
        .on("error", (err) => {
          res.status(500).send("<h3>Error</h3>");
        });
    } catch (error) {
      return res.status(500).send("<h3>Error</h3>");
    }
  })
);

app.listen(PORT);
