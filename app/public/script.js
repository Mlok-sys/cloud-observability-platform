// Simple popup image viewer
const popup = document.getElementById('image-popup');
const popupImg = document.getElementById('popup-img');
const closeBtn = document.querySelector('.close');
const images = document.querySelectorAll('.clickable');

images.forEach(img => {
  img.addEventListener('click', () => {
    popup.style.display = 'block';
    popupImg.src = img.src;
  });
});

closeBtn.onclick = () => {
  popup.style.display = 'none';
};

popup.onclick = e => {
  if (e.target === popup) popup.style.display = 'none';
};
