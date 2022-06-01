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
  asyncHandler(async (req, res, next) => {
    const url = req.query.url;
    const errorUrl = "/?error=You put an invalid url";
    if (!url) return res.status(400).send(errorUrl);
    try {
      const stream = ytdl(url, {
        quality: "highestaudio",
      }).on("error", (err) => next(err));

      const videoInfo = await ytdl.getInfo(url);
      const filePath = `${__dirname}/tmp/${videoInfo.videoDetails.title}.mp3`;
      ffmpeg({ source: stream })
        .setFfmpegPath("ffmpeg")
        .toFormat("mp3")
        .on("error", (err) => next(err))
        .saveToFile(filePath)
        .on("end", () => {
          res.download(filePath, () => {
            fs.unlinkSync(filePath);
          });
        });
    } catch (error) {
      return res.status(500);
    }
  })
);

app.listen(PORT);
