
import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const loadMore = document.querySelector(".load-more");

loadMore.classList.add("hidden");

let page = 1;

searchForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  gallery.innerHTML = "";

  const searchQuery = document.querySelector('input[name="searchQuery"]').value;

  try {
    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: "37643260-361b699785f368081cbff175a",
        q: searchQuery,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        page: page,
        per_page: 40,
      },
    });

    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    } else {
      Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
      gallery.innerHTML = createMarkup(response.data);
      page +=1;
      loadMore.classList.remove("hidden");

      const lightbox = new SimpleLightbox(".lightbox");
      lightbox.refresh();
    }
  } catch (error) {
    console.log(error);
  }

});

function createMarkup(data) {
  return data.hits
    .map((image) => {
      const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;
      return `
        <div class="photo-card">
          <a href="${largeImageURL}" class="lightbox" data-lightbox="gallery">
            <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
          </a>
          <div class="info">
            <p class="info-item">
              <b>Likes: ${likes}</b>
            </p>
            <p class="info-item">
              <b>Views: ${views}</b>
            </p>
            <p class="info-item">
              <b>Comments: ${comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads: ${downloads}</b>
            </p>
          </div>
        </div>
      `;
    })
    .join("");
}

loadMore.addEventListener("click", async function () {
  const searchQuery = document.querySelector('input[name="searchQuery"]').value;

  try {
    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: "37643260-361b699785f368081cbff175a",
        q: searchQuery,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        page: page,
        per_page: 40,
      },
    });

    if (response.data.totalHits <= page * 40) {
      loadMore.classList.add("hidden");
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    } else {
      gallery.insertAdjacentHTML("beforeend", createMarkup(response.data));
      page += 1;
      loadMore.classList.remove("hidden");

      const lightbox = new SimpleLightbox(".lightbox");
      lightbox.refresh();

      const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 1,
        behavior: "smooth",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

