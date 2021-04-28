import './styles.css';
import  PixabayService from '../src/js/apiService';
import hitsTpl from '../src/templates/templates.hbs';
import { onOpenModal } from '../src/js/modal';


const refs = getRefs();
const pixabayService = new PixabayService();

refs.searchForm.addEventListener('submit', onSearch);
refs.gallery.addEventListener('click', onOpenModal);

function onSearch(e) {
    e.preventDefault();

    pixabayService.query = e.currentTarget.elements.query.value;

    if (pixabayService.query === '') {
    return alert('Enter the word');
  }

    pixabayService.resetPage();
    clearHits();
    pixabayService.fetchHits().then(hits => {
        appendHitsMarkup(hits);
        pixabayService.incrementPage();
    });
}

function appendHitsMarkup(hits) {
    refs.gallery.insertAdjacentHTML('beforeend', hitsTpl(hits));
}

function clearHits(){
    refs.gallery.innerHTML = '';
}

function getRefs() {
    return {
        searchForm: document.querySelector('.search-form'),
        gallery: document.querySelector('.gallery'),
        scroll: document.querySelector('#scroll'),
    };
}

const onEntry = entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && pixabayService.query !== '') {
            pixabayService.fetchHits().then(hits => {
                appendHitsMarkup(hits);
                pixabayService.incrementPage();
            });
        }
    });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe(refs.scroll);