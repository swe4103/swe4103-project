import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'

import { useAuth } from '../../state/AuthProvider/AuthProvider'

import Settings from './Settings'

// Mock useAuth to simulate user context
jest.mock('../../state/AuthProvider/AuthProvider')
jest.mock('axios')

const mockUser = {
  user: {
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
})

test('renders Settings component with user display name', () => {
  render(<Settings />)

  // Verify display name text is defined
  expect(screen.queryByText(/Display Name:/)).not.toBeNull()
  expect(screen.queryByText(/John Doe/)).not.toBeNull()
})

test('opens modal on clicking Change Display Name button', () => {
  render(<Settings />)

  // Click the "Change Display Name" button using getByRole to avoid ambiguity
  fireEvent.click(screen.getByRole('button', { name: /Change Display Name/i }))

  // Verify that the modal opens by checking for the modal's input field
  expect(screen.queryByPlaceholderText(/Enter new display name/)).not.toBeNull()
})

test('shows validation message for empty display name', async () => {
  render(<Settings />)

  fireEvent.click(screen.getByText(/Change Display Name/))

  fireEvent.change(screen.getByPlaceholderText(/Enter new display name/), {
    target: { value: '' },
  })
  fireEvent.click(screen.getByText(/Save/))

  expect(screen.queryByText('Display name cannot be empty.')).not.toBeNull()
})

test('updates display name on successful API call', async () => {
  axios.put.mockResolvedValueOnce({})
  render(<Settings />)

  // Open modal
  fireEvent.click(screen.getByRole('button', { name: /Change Display Name/i }))

  // Enter new display name and submit
  fireEvent.change(screen.getByPlaceholderText(/Enter new display name/), {
    target: { value: 'Jane Doe' },
  })
  fireEvent.click(screen.getByText(/Save/))

  // Wait for updateUser to be called with new display name
  await waitFor(() =>
    expect(mockUpdateUser).toHaveBeenCalledWith({
      ...mockUser,
      user: { ...mockUser.user, displayName: 'Jane Doe' },
    }),
  )

  // Check for success feedback message and confirm the modal is closed
  expect(screen.queryByText('Display name updated successfully!')).not.toBeNull()
  expect(screen.queryByPlaceholderText(/Enter new display name/)).toBeNull() // Modal should be closed
})

test('shows error message on failed API call', async () => {
  axios.put.mockRejectedValueOnce(new Error('Network Error'))
  render(<Settings />)

  fireEvent.click(screen.getByText(/Change Display Name/))

  fireEvent.change(screen.getByPlaceholderText(/Enter new display name/), {
    target: { value: 'Jane Doe' },
  })
  fireEvent.click(screen.getByText(/Save/))

  await waitFor(() =>
    expect(screen.queryByText('Failed to update display name. Please try again.')).not.toBeNull(),
  )
})
