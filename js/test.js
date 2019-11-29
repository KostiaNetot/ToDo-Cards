'use strict';

// $(".my-rating").starRating({
//   starSize: 20,
//   totalStars: 4,
//   useFullStars: true,
//   disableAfterRate: false,
//   initialRating: 3,
//   callback: function(currentRating, $el){
//     changePriority();
//   }
// });

let paRRR = document.querySelector('.task-cards-wrapper');
let newSSS = document.querySelector('.card').cloneNode(true);

paRRR.appendChild(newSSS);
console.log(newSSS);

$(".my-rating").starRating({
  starSize: 20,
  totalStars: 4,
  useFullStars: true,
  disableAfterRate: false,
  initialRating: 3,
  callback: function(currentRating, $el){
    changePriority();
  }
});