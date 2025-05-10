import tagSelection from "./components/tagSelection.js";
import imageElement from "./components/imageElement.js"
import {images} from "./utils/images.js";
import '../css/styles.css';

const sectionSelectTags = document.querySelector('.section--select-tags');
const sectionImages = document.querySelector('.section--images');
const btnClearTags = document.querySelector('.clear-selection');
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.close-button');
const modalImage = document.querySelector('.modal-content');
const downloadButton = document.querySelector('.download-button');
const sectionWelcome = document.querySelector('.welcome-section');
const tagsList = [
    "all",
    "featured",
    "christmas",
    "summer",
    "winter",
    "autumn",
    "spring",
    "mountains",
    "cityscape",
    "sunset",
    "sunrise",
    "night",
    "day",
    "animals",
    "nature",
    "food",
    "people",
    "sports",
    "travel",
];
let currentlySelectedTags = ['featured'];

// Setting up a 'featured' array in the images object
images.featured = [];
for (let key in images) {
    if (key !== 'featured') {
        images[key].forEach(image => {
            if (image.isFeatured) {
                images.featured.push(image);
            }
        });
    }
}

// Defining the callback for the Intersection Observer
const handleImgIntersection = function (entries) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.src = entry.target.dataset.src;
    });
};

// Creating the Intersection Observer
const imgObserver = new IntersectionObserver(handleImgIntersection, {
    root: null,
    threshold: 0.2,
});

// Download images function
function downloadImage() {
    const a = document.createElement('a');
    a.href = this.dataset.full_image;
    a.download = this.dataset.full_image.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


// Creating tag selection divs
tagsList.forEach(tag => {
    const tagDiv = tagSelection(tag);
    sectionSelectTags.appendChild(tagDiv);

    tagDiv.addEventListener('click', (e) => {
        const checkbox = document.getElementById(tag);
        if (e.target !== checkbox) checkbox.checked = !checkbox.checked;

        // Handling tag selection
        if (tag === 'all') {
            currentlySelectedTags = checkbox.checked ? tagsList.slice() : [];
        } else {
            if (checkbox.checked && !currentlySelectedTags.includes(tag)) {
                currentlySelectedTags.push(tag);
            } else if (!checkbox.checked) {
                currentlySelectedTags = currentlySelectedTags.filter(item => item !== tag);
            }
        }

        // Update checkboxes based on currentlySelectedTags
        tagsList.forEach(anyTag => {
            const anyCheckbox = document.getElementById(anyTag);
            if (anyCheckbox) {
                anyCheckbox.checked = currentlySelectedTags.includes(anyTag);
            }
        });
        displayImages();
    });
    if (tag === 'featured') {
        const featuredCheckbox = document.getElementById('featured');
        featuredCheckbox.checked = true;
    }
});

// Display 'featured' images on initial page load
displayImages();

// Main function for rendering images
function displayImages() {
    sectionImages.innerHTML = '';

    // Tracking added images
    let addedImages = new Set();
    const displayOrderTags = [...currentlySelectedTags].reverse();
    displayOrderTags.forEach(item => {
        for (let key in images) {
            if (key === item) {
                images[key].forEach(image => {
                    if (!addedImages.has(image.src)) {
                        const imageElementDiv = imageElement(image);
                        sectionImages.appendChild(imageElementDiv);
                        addedImages.add(image.src);
                    }
                });
            }
        }
    });

    // Condition for displaying Welcome section or Images section
    if (addedImages.size === 0) {
        sectionWelcome.classList.remove('hidden');
        sectionImages.classList.add('hidden');
    } else {
        sectionWelcome.classList.add('hidden');
        sectionImages.classList.remove('hidden');
    }

    // Define image targets for observer
    const imgTargets = document.querySelectorAll('img[data-src]');
    // Unobserve images when images are re-displayed
    imgTargets.forEach(img => imgObserver.unobserve(img));
    // Observe each new image
    imgTargets.forEach(img => imgObserver.observe(img));

    imgTargets.forEach(img => {
        img.addEventListener('click', () => {
            modalImage.src = img.dataset.modal;
            modal.style.display = 'flex';

            // Clearing existing event listener
            downloadButton.removeEventListener('click', downloadImage);
            downloadButton.dataset.full_image = img.dataset.full_image;

            // Event listener download button
            downloadButton.addEventListener('click', downloadImage);
        });
    });
}

// Closing the modal
closeButton.addEventListener('click', () => modal.style.display = 'none');
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') modal.style.display = 'none';
});
modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.style.display = 'none';
});

// Clearing tags
btnClearTags.addEventListener('click', () => {
    currentlySelectedTags = [];
    sectionWelcome.classList.remove('hidden');
    tagsList.forEach(tag => {
        const checkbox = document.getElementById(tag);
        if (checkbox) {
            checkbox.checked = currentlySelectedTags.includes(tag);
        }
    });

    // Re-display images
    displayImages();
});
