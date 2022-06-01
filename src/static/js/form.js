const $ = (selector) => document.querySelector(selector);
const downloadButton = $("#download-button");
const searchInput = $("#search-input");

const changeDownloadUrl = (value) => {
  downloadButton.setAttribute("href", `/download?url=${value}`);
  downloadButton.classList.remove("disabled");
  if (value.length < 10) downloadButton.classList.add("disabled");
};

$("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  changeDownloadUrl(e.target[0].value);
});

searchInput.addEventListener("input", (e) => {
  const videoKey = e.target.value.split("=")[1];
  downloadButton.href = `/donwload?url=${e.target.value}`;
  changeDownloadUrl(e.target.value);
});

document.addEventListener("DOMContentLoaded", (e) => {
  changeDownloadUrl(searchInput.value);
});
