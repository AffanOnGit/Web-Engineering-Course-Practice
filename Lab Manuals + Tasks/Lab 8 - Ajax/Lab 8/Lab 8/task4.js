const imageGallery = document.getElementById('image-gallery');
const loadMoreButton = document.getElementById('load-more');


let images = [];
let loadedImages = 0;
const imagesPerPage = 12; // Number of images to load per "Load More" click


// Fetch images from the API
function fetchImages() {
    return fetch('https://jsonplaceholder.typicode.com/photos')
        .then(response => response.json())
        .then(data => images = data);
}


// Render images in the gallery
function renderImages(startIndex, endIndex) {
    for (let i = startIndex; i < endIndex; i++) {
        const imageCard = document.createElement('div');
        imageCard.classList.add('image-card');
        imageCard.innerHTML = `
            <img src="${images[i].thumbnailUrl}" alt="${images[i].title}">
            <p>${images[i].title}</p>
        `;
        imageGallery.appendChild(imageCard);
    }
}


// Handle Load More button click
loadMoreButton.addEventListener('click', () => {
    loadMoreButton.classList.add('loading');


    // Simulate loading animation (minimum 1 second)
    setTimeout(() => {
        const nextStartIndex = loadedImages;
        const nextEndIndex = Math.min(loadedImages + imagesPerPage, images.length);


        renderImages(nextStartIndex, nextEndIndex);
        loadedImages = nextEndIndex;


        if (loadedImages === images.length) {
            loadMoreButton.classList.add('disabled');
            loadMoreButton.textContent = 'No more images to load';
        } else {
            loadMoreButton.classList.remove('loading');
        }
    }, 1000);
});


// Initial image loading
fetchImages()
    .then(() => {
        renderImages(0, imagesPerPage);
        loadedImages = imagesPerPage;
    })
    .catch(error => console.error('Error fetching images:', error));
