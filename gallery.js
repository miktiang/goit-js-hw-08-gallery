import galleryItems from "./app.js";

// Создание и рендер разметки по массиву данных galleryItems из app.js и предоставленному шаблону.

const galleryOfImages = document.querySelector('.js-gallery');
const imagesMarkup = createImages(galleryItems);

galleryOfImages.insertAdjacentHTML("beforeend", imagesMarkup);

function createImages(images) {
  return images.map(({preview,original,description}) =>
  {
    return `<li class="gallery__item">
  <a
    class="gallery__link"
    href="#"
  >
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>`
  }).join('') 
};

//  Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.

const modalOpen = document.querySelector('.lightbox');
const modalImage = document.querySelector('.lightbox__image')

galleryOfImages.addEventListener('click', onImageClick);

const originalImagesArrow = [];

for (const item of galleryItems) {
  originalImagesArrow.push(item.original);
};

let idxOfOpenedImage = originalImagesArrow.indexOf(modalImage.src);

function onImageClick(evt) {
  if (!evt.target.classList.contains('gallery__image')) {
    return
  } else {
    
// Открытие модального окна по клику на элементе галереи.
    
    modalOpen.classList.add('is-open');
    
    // Подмена значения атрибута src элемента img.lightbox__image.
    
    modalImage.src = evt.target.dataset.source;
    modalImage.alt = evt.target.alt;

    // Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".

    window.addEventListener('keydown', onRightKeyClick);
    window.addEventListener('keydown', onLeftKeyClick);

    onRightKeyClick(evt);
    onLeftKeyClick(evt);
  };
}

function onRightKeyClick(evt) {
  if (evt.keyCode === 39 && idxOfOpenedImage < originalImagesArrow.length-1) {
      modalImage.src = originalImagesArrow[idxOfOpenedImage += 1]
    }
  }

function onLeftKeyClick(evt) {
  if (evt.keyCode === 37 && idxOfOpenedImage > 0) {
      modalImage.src = originalImagesArrow[idxOfOpenedImage -= 1]
    }
  }

// Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].

const onCloseBtnClick = document.querySelector('.lightbox__button');

onCloseBtnClick.addEventListener('click', closeModal);

// Закрытие модального окна по клику на overlay.

const onOverlayClick = document.querySelector('.lightbox__overlay');

onOverlayClick.addEventListener('click', closeModal);

// Закрытие модального окна по клику на Esc.

window.addEventListener('keydown', closeModalOnEscKeyClick);

function closeModal() {
  modalOpen.classList.remove('is-open');
  window.removeEventListener('keydown', onRightKeyClick);
  window.removeEventListener('keydown', onLeftKeyClick);

  // Очистка значения атрибута src элемента img.lightbox__image. 
  // Это необходимо для того, чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.
  
  modalImage.src = "";
  modalImage.alt = "";
}

function closeModalOnEscKeyClick(evt) {
  if (evt.keyCode === 27) {
    closeModal();
  }
}