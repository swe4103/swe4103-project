import { render, cleanup } from '@testing-library/react'

import HelloWorld from './HelloWorld'
import '@testing-library/jest-dom'

afterEach(cleanup)

test('Contains "Hello World!" text', () => {
  const { getByText } = render(<HelloWorld />)
  const text = getByText(/Hello World!/i)
  expect(text).toBeInTheDocument()
})
