import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'

import { useAuth } from '../../state/AuthProvider/AuthProvider'

import ChangeName from './ChangeName'
import '@testing-library/jest-dom' // Add this import for custom matchers

// Mock useAuth to simulate user context
jest.mock('../../state/AuthProvider/AuthProvider')
jest.mock('axios')

const mockUser = {
  user: {
    id: '123',
    displayName: 'John Doe',
    email: 'john@example.com',
    role: 'user',
  },
  token: 'sample-token',
}

const mockUpdateUser = jest.fn()

beforeEach(() => {
  useAuth.mockReturnValue({
    user: mockUser,
    updateUser: mockUpdateUser,
  })
  jest.clearAllMocks()
})

test('renders Settings component with user display name', () => {
  render(<ChangeName />)
  expect(screen.getByText(/Display Name:/)).toBeInTheDocument()
  expect(screen.getByText(/John Doe/)).toBeInTheDocument()
})

test('opens modal on clicking Change Display Name button', () => {
  render(<ChangeName />)
  fireEvent.click(screen.getByRole('button', { name: /Change Display Name/i }))
  expect(screen.getByPlaceholderText(/Enter new display name/)).toBeInTheDocument()
})

// TODO fix this test
// test('shows validation message for empty display name', () => {
//   render(<ChangeName />)
//   fireEvent.click(screen.getByRole('button', { name: /Change Display Name/i }))
//   fireEvent.change(screen.getByPlaceholderText(/Enter new display name/i), {
//     target: { value: '' },
//   })
//   fireEvent.click(screen.getByText(/Save/i))
//   screen.id
//   expect(screen.getByText('Display name cannot be empty.')).toBeInTheDocument()
// })

test('updates display name on successful API call', async () => {
  axios.put.mockResolvedValueOnce({})
  render(<ChangeName />)
  fireEvent.click(screen.getByRole('button', { name: /Change Display Name/i }))
  fireEvent.change(screen.getByPlaceholderText(/Enter new display name/i), {
    target: { value: 'Jane Doe' },
  })
  fireEvent.click(screen.getByText(/Save/i))

  await waitFor(() => {
    expect(mockUpdateUser).toHaveBeenCalledWith({
      ...mockUser,
      user: { ...mockUser.user, displayName: 'Jane Doe' },
    })
  })
  expect(screen.getByText('Display name updated successfully!')).toBeInTheDocument()
  expect(screen.queryByPlaceholderText(/Enter new display name/)).toBeNull() // Modal should be closed
})

// test('shows error message on failed API call', async () => {
//   axios.put.mockRejectedValueOnce(new Error('Network Error'))
//   render(<ChangeName />)
//   fireEvent.click(screen.getByRole('button', { name: /Change Display Name/i }))
//   fireEvent.change(screen.getByPlaceholderText(/Enter new display name/i), {
//     target: { value: 'Jane Doe' },
//   })
//   fireEvent.click(screen.getByText(/Save/i))

//   await waitFor(() =>
//     expect(
//       screen.getByText('Failed to update display name. Please try again.'),
//     ).toBeInTheDocument(),
//   )
// })
