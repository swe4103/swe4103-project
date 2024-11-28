import { render, fireEvent, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'

import Sidebar from './Sidebar'
import '@testing-library/jest-dom'

const mockNavRoutes = {
  home: { path: '/', label: 'Home', icon: 'home' },
  about: { path: '/about', label: 'About', icon: 'info-circle' },
  contact: { path: '/contact', label: 'Contact', icon: 'phone' },
}
// mock icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }) => <span data-testid={`icon-${icon.iconName}`} />,
}))

describe('Sidebar Component', () => {
  test('renders with default collapsed state', () => {
    render(
      <Router>
        <Sidebar navRoutes={mockNavRoutes} />
      </Router>,
    )

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('w-20')
    expect(nav).not.toHaveClass('w-60')

    const logo = screen.getByAltText(/logo/i)
    expect(logo).toBeInTheDocument()

    const toggleButton = screen.getByRole('button')
    expect(toggleButton).toBeInTheDocument()
  })

  test('expands when the toggle button is clicked', () => {
    render(
      <Router>
        <Sidebar navRoutes={mockNavRoutes} />
      </Router>,
    )

    const nav = screen.getByRole('navigation')
    const toggleButton = screen.getByRole('button')

    fireEvent.click(toggleButton)

    expect(nav).toHaveClass('w-60')
    expect(nav).not.toHaveClass('w-20')
  })
})
