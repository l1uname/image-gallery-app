export default function imageElement(image) {
    const imageElement = document.createElement('img');
    imageElement.src = image.blurred;
    imageElement.dataset.src = image.thumbnail;
    imageElement.dataset.full_image = image.src;
    imageElement.dataset.modal = image.modal;
    imageElement.dataset.isFeatured = image.isFeatured;
    return imageElement;
}