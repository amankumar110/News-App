import { API_key } from "./api.js";
const Base_Url = "https://newsapi.org/v2/everything";
const searchForm = document.querySelector("form.search");
window.addEventListener("DOMContentLoaded", () => fetchNews("india"));
async function fetchNews(topic) {
  try {
    const news = await fetch(`${Base_Url}?q=${topic}&apiKey=${API_key}`);
    const data = await news.json();
    if (data.status === "ok") {
      if (data.totalResults === 0) {
        bindData(null);
      } else {
        bindData(data.articles);
      }
    }
  } catch (error) {
    bindData(null);
  }
}
function bindData(articles) {
  const cardContainer = document.querySelector(".cards-container");
  const newsTemplate = document.querySelector("#news-template");
  if (!articles) {
    cardContainer.innerHTML = `<h1 class="alert-msg">Something went wrong 😢</h1>`;
  } else {
    cardContainer.innerHTML = "";
    articles.forEach((article) => {
      if (!article.urlToImage) return;
      const cardClone = newsTemplate.content.cloneNode(true);
      fillInCard(cardClone, article);
      cardContainer.appendChild(cardClone);
    });
  }
}
function fillInCard(card, article) {
  const newsImg = card.querySelector("#card-img");
  const newsTitle = card.querySelector("#news-title");
  const newsSource = card.querySelector("#news-source");
  const newsDesc = card.querySelector("#news-desc");
  newsImg.src = article.urlToImage;
  newsTitle.textContent = article.title;
  newsDesc.textContent = article.description;
  const publishDate = new Date(article.publishedAt).toLocaleDateString(
    "en-US",
    {
      timeZone: "Asia/Jakarta",
    }
  );
  card.children[0].addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
  newsSource.textContent = `${article.source.name} ~ ${publishDate}`;
}

function navItemClick(topic) {
  fetchNews(topic);
}
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formInput = searchForm.firstElementChild;
  fetchNews(formInput.value.trim());
});
