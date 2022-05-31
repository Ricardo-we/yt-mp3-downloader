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
    const { error } = req.query;

    res.render("main-view", { error });
  } catch (error) {
    res.send("<h2>Something went wrong</h2>");
  }
});

app.get("/download", async (req, res, next) => {
  try {
    const url = req.query.url;
    const urlIsValid = "https://www.youtube.com/watch?" === url.split("?")[0];
    const errorUrl =
      "/?error=You did'nt put a url, url shoud be like https://www.youtube.com/watch?v=9lHbSPmKOrs";
    let stream;

    if (!url || !urlIsValid) return res.redirect(errorUrl);

    try {
      stream = ytdl(url, {
        quality: "highestaudio",
      });
    } catch (error) {
      return res.redirect(errorUrl);
    }
    if (!stream) return res.redirect(errorUrl);

    const videoInfo = await ytdl.getInfo(url);
    const filePath = `${__dirname}/tmp/${videoInfo.videoDetails.title}.mp3`;
    ffmpeg({ source: stream })
      .setFfmpegPath("ffmpeg")
      .toFormat("mp3")
      .saveToFile(filePath)
      .on("end", () => {
        res.download(filePath, (err) => {
          if (err) throw new Error("Failed");
          fs.unlinkSync(filePath);
        });
        res.redirect("/");
      });
  } catch (error) {
    res.redirect("/?error=Something went wrong");
  }
});

app.listen(PORT);
