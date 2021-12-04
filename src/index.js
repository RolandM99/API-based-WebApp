import './style.css';

const generateUrl = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&start_date=2018-07-15&end_date=2018-07-20';
const displayData = document.querySelector('body > main > section');

const getData = async (link) => {
  const response = await fetch(link);
  return response.json();
};

const displayDataTable = (image, title) => {
  const cardArt = document.createElement('div');
  cardArt.classList.add('card-container');
  cardArt.innerHTML = `
  <div class="art-picture">
    <img src="${image}" class="image" alt="artwork">
  </div>
  <div class="fix-bottom">
  <div class="title">
    <h3>${title}</h3>
  </div>
  <div class="like-comment">
  <a class="love"><i class="far fa-heart"></i><small>0 likes</small></a>
  <a class="comment"><i class="far fa-comment"></i><p id="text">comment</p></a>
   </div>
   </div>`;
  displayData.appendChild(cardArt);
};

const displayFromApi = () => {
  getData(generateUrl)
    .then((data) => {
      displayData.innerHTML = '';
      data.forEach((element) => displayDataTable(element.hdurl, element.title));
    });
};

displayFromApi();
