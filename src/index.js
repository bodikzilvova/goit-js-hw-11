
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchImages } from './api';

const lightbox = new SimpleLightbox(".lightbox");
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
    const data = await fetchImages(searchQuery, 1);

    if (data.hits.length === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      loadMore.classList.add("hidden");
    } else {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      gallery.innerHTML = createMarkup(data);
      loadMore.classList.remove("hidden");
     
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
    const data = await fetchImages(searchQuery, page);

    if (data.totalHits <= page * 40) {
      loadMore.classList.add("hidden");
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    } else {
      gallery.insertAdjacentHTML("beforeend", createMarkup(data));
      page += 1;
      loadMore.classList.remove("hidden");
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

