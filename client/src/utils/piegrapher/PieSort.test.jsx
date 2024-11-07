import PieSort from './PieSort.jsx'

test('Counts instances of each array value', () => {
  let ratings = [2, 3, -1, 5, 4, -1, 2, 3, 4, 5, -1]
  expect(PieSort(ratings)).toEqual({ '2': 2, '3': 2, '-1': 3, '5': 2, '4': 2 })
})
