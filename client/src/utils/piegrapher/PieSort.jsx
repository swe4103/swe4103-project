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
