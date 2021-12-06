import './style.css';
import commentPopup from './popup.js';

const generateUrl = 'https://api.nasa.gov/planetary/apod?api_key=lbhIC5GaLFk8aa2ltHB7NCsAMv0h7zAXHEK2rKV4&start_date=2021-11-22&end_date=2021-11-27';
const datesForPopup = ['2021-11-22', '2021-11-23', '2021-11-24', '2021-11-25', '2021-11-26', '2021-11-27'];
const generateImage = () => `https://api.nasa.gov/planetary/apod?api_key=lbhIC5GaLFk8aa2ltHB7NCsAMv0h7zAXHEK2rKV4&date=${datesForPopup[1]}`;
const displayData = document.querySelector('body > main > section');
const starLink = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/9mAPgvMc6PjOJk4JU1ZU/likes/';
const commentLink = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/9mAPgvMc6PjOJk4JU1ZU/comments';

const getData = async (link) => {
  const response = await fetch(link);
  return response.json();
};

const postData = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
};

const displayDataTable = (image, title, index) => {
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
    <div class="my-love">
      <a class="love" id="${index}like"><i class="far fa-heart"></i></a>
    </div>
     <small id="small">${index}likes</small>
    <a class="comment" id="${index}"><i class="far fa-comment"></i><p id="text">comment</p></a>
   </div>
   </div>`;
  displayData.appendChild(cardArt);
};

function countElements(elem) {
  return elem.childElementCount;
}

const closeDisplayPop = (target) => {
  target.parentElement.parentElement.remove();
};

const countItems = () => {
  const itemCount = document.querySelector('#item-count');
  const mySection = document.querySelector('body > main > section');
  itemCount.firstChild.innerHTML = `Exhibition ${countElements(mySection)}`;
};

const countComment = () => {
  const commentCount = document.getElementById('comment-container');
  commentCount.previousElementSibling.innerHTML = `Comments ${countElements(commentCount)}`;
};

function showComment(user, str) {
  const ulContainer = document.querySelector('#comment-container');
  const li = document.createElement('li');
  li.innerHTML = `${user} : ${str}`;
  ulContainer.appendChild(li);
}

function displayComments(id) {
  const showProper = `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/9mAPgvMc6PjOJk4JU1ZU/comments?item_id=${id}`;
  getData(showProper)
    .then((data) => data.forEach((elem) => showComment(elem.username, elem.comment)))
    .then(() => countComment());
}

function addComment(id, user, str) {
  const data = {
    item_id: id,
    username: user,
    comment: str,
  };

  postData(commentLink, data)
    .then((data) => {
      if (data.status === 201) {
        showComment(user, str);
      }
    });
}

const displayImagePopup = (id) => {
  getData(generateImage(id))
    .then((data) => commentPopup(data.hdurl, data.title, data.explanation, id))
    .then(() => {
      displayComments(id);
      const closeBtn = document.getElementById('close-btn');
      closeBtn.addEventListener('click', () => {
        closeDisplayPop(closeBtn);
      });
    });
  // .catch((error) => console.log(error));
};

const clickLove = (id, likes) => {
  const small = document.getElementById(id);
  small.parentElement.nextElementSibling.innerHTML = `${likes} likes`;
};

function displayLike() {
  getData(starLink)
    .then((data) => data.forEach((elem) => clickLove(elem.item_id, elem.likes)));
}

function displayFromApi() {
  getData(generateUrl)
    .then((data) => data.forEach((elem, index) => displayDataTable(elem.hdurl, elem.title, index)))
    .then(() => {
      displayLike();
      countItems();
    });
}

function giveLikes(id, stars) {
  const data = { item_id: id };
  postData(starLink, data)
    .then((data) => {
      if (data.status === 201) {
        clickLove(id, stars);
      }
    });
}

displayFromApi();

displayData.addEventListener('click', (e) => {
  if (e.target.classList.contains('fa-heart')) {
    e.preventDefault();
    const oneL = parseInt(e.target.parentElement.parentElement.nextElementSibling.textContent, 10);
    const likes = oneL + 1;
    giveLikes(e.target.parentElement.id, likes);
  }
  if (e.target.classList.contains('fa-comment')) {
    displayImagePopup(parseInt(e.target.id, 10));
  }
  if (e.target.id === 'comment-btn') {
    e.preventDefault();
    const id = (e.target.parentElement.id).match(/[0-9]/g);
    const userName = document.getElementById('username');
    const comment = document.getElementById('comment-area');
    addComment(id, userName.value, comment.value);
    userName.value = '';
    comment.value = '';
  }
});
