// import React, { useState } from 'react';
// import ReactDOM from 'react-dom/client';

export default function PieSort(ratings) {
  let pieSlices = {}

  ratings.forEach(rating => {
    if (pieSlices[rating]) {
      pieSlices[rating] += 1
    } else {
      pieSlices[rating] = 1
    }
  })

  return pieSlices
}

// const ratings = [2,3,-1,5,4,-1,2,3,4,5,-1];
// console.log(PieSort(ratings));

// module.exports = PieSort;
