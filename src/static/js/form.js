const $ = (selector) => document.querySelector(selector);
const downloadButton = $("#download-button");

const changeDownloadUrl = (value) => {
  downloadButton.setAttribute("href", `/download?url=${value}`);
  //   downloadButton.setAttribute("download", `/donwload?url=${value}`);
};

$("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  changeDownloadUrl(e.target[0].value);
});

$("#search-input").addEventListener("input", (e) => {
  downloadButton.href = `/donwload?url=${e.target.value}`;
  changeDownloadUrl(e.target.value);
});
