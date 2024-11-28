import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import Card from './Card'

describe('Card Component', () => {
  test('renders children correctly', () => {
    render(<Card>Test Content</Card>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  test('applies custom height and width styles', () => {
    const { container } = render(
      <Card height="200px" width="300px">
        Test Content
      </Card>,
    )
    const card = container.firstChild
    expect(card).toHaveStyle('height: 200px')
    expect(card).toHaveStyle('width: 300px')
  })

  test('applies default styles', () => {
    const { container } = render(<Card>Test Content</Card>)
    const card = container.firstChild
    expect(card).toHaveClass('bg-white')
    expect(card).toHaveClass('rounded-md')
    expect(card).toHaveClass('shadow')
    expect(card).toHaveClass('p-4')
  })

  test('applies additional className', () => {
    const { container } = render(<Card className="custom-class">Test Content</Card>)
    const card = container.firstChild
    expect(card).toHaveClass('custom-class')
  })

  test('handles empty children gracefully', () => {
    const { container } = render(<Card></Card>)
    const card = container.firstChild
    expect(card).toBeEmptyDOMElement()
  })
})
