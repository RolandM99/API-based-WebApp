const displayData = document.querySelector('body > main > section');
export default function commentPopup(image, title, text, id) {
  const commentDiv = document.createElement('div');
  commentDiv.classList.add('main-popup');
  commentDiv.innerHTML = `
       <div class="popup-container">
        <span id="close-btn"><i class="fal fa-times"></i></span>
        <div class="popup-image">
           <img src="${image}" class="img" alt="art-image">
        </div>
        <h2 class="pop-title">${title}</h2>
       <p class="description">${text}</p>
       <div>
           <h2 class="commentaire">Comments</h2>
           <ul id="comment-container">
           </ul>
         </div>
         <form id="${id}form" action="POST">
           <input type="text" id="username" placeholder="Your Name">
           <textarea name="text" id="comment-area" cols="30" rows="10" placeholder="Write your insight here"></textarea>
           <input type="button" value="Comment" id="comment-btn">
         </form>
       </div>
        `;
  displayData.appendChild(commentDiv);
}