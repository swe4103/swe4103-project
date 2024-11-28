import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import Button from './Button'

describe('Button Component', () => {
  test('renders with default props', () => {
    render(<Button>Click Me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary')
    expect(button).toBeEnabled()
  })

  test('renders with isLoading state', () => {
    render(<Button isLoading>Click Me</Button>)
    const button = screen.getByRole('button', { name: /loading/i })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
    expect(button).toHaveClass('bg-accent')
  })

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('applies custom className and style', () => {
    const style = { backgroundColor: 'red' }
    render(
      <Button className="custom-class" style={style}>
        Styled Button
      </Button>,
    )
    const button = screen.getByRole('button', { name: /styled button/i })
    expect(button).toHaveClass('custom-class')
    expect(button).toHaveStyle('background-color: red')
  })
})
