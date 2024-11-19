import { render, screen, fireEvent, act } from '@testing-library/react'
import axios from 'axios'
import { MemoryRouter, useNavigate } from 'react-router-dom'

import '@testing-library/jest-dom' // Import jest-dom matchers
import { AuthProvider } from '../../state/AuthProvider/AuthProvider'

import InstructorInviteStudents from './InstructorInviteStudents'

// Mock axios
jest.mock('axios')

// Suppress console.error logs during tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  console.error.mockRestore()
})

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}))

// Mock navigate
const mockNavigate = jest.fn()
useNavigate.mockImplementation(() => mockNavigate)

describe('InstructorInviteStudents Component', () => {
  const mockUser = { token: 'mock-token' } // Mock user with token

  beforeEach(() => {
    jest.clearAllMocks() // Clear mocks before each test
  })

  const renderWithProviders = () => {
    render(
      <AuthProvider value={{ user: mockUser, logout: jest.fn() }}>
        <MemoryRouter>
          <InstructorInviteStudents />
        </MemoryRouter>
      </AuthProvider>,
    )
  }

  test('renders the component correctly', () => {
    renderWithProviders()

    expect(screen.getByText('Invite Students')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Enter student emails, separated by commas'),
    ).toBeInTheDocument()
    expect(screen.getByText('Send Invites')).toBeInTheDocument()
  })

  test('sends invitations on valid form submission', async () => {
    axios.post.mockResolvedValueOnce({ status: 200 }) // Mock successful API call

    renderWithProviders()

    const emailInput = screen.getByPlaceholderText('Enter student emails, separated by commas')
    const sendButton = screen.getByText('Send Invites')

    // Use act to wrap the state changes
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test1@example.com, test2@example.com' } })
      fireEvent.click(sendButton)
    })

    expect(axios.post).toHaveBeenCalledWith(
      '/api/users/invite',
      { emails: ['test1@example.com', 'test2@example.com'], role: 'STUDENT' },
      { headers: { Authorization: 'Bearer mock-token' } },
    )
  })

  test('displays an error message on API failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('Failed to send invites')) // Mock API failure

    renderWithProviders()

    const emailInput = screen.getByPlaceholderText('Enter student emails, separated by commas')
    const sendButton = screen.getByText('Send Invites')

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } })
      fireEvent.click(sendButton)
    })

    const errorMessage = await screen.findByText(
      'Failed to send invites. Please check the emails and try again.',
    )
    expect(errorMessage).toBeInTheDocument()
  })

  test('disables the textarea and button while loading', async () => {
    axios.post.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 1000))) // Simulate delay

    renderWithProviders()

    const emailInput = screen.getByPlaceholderText('Enter student emails, separated by commas')
    const sendButton = screen.getByText('Send Invites')

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(sendButton)
    })

    // Ensure textarea and button are disabled during the loading state
    expect(emailInput).toBeDisabled()
    expect(sendButton).toBeDisabled()
  })

  test('navigates to success page on successful form submission', async () => {
    axios.post.mockResolvedValueOnce({ status: 200 })

    renderWithProviders()

    const emailInput = screen.getByPlaceholderText('Enter student emails, separated by commas')
    const sendButton = screen.getByText('Send Invites')

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test1@example.com, test2@example.com' } })
      fireEvent.click(sendButton)
    })

    expect(mockNavigate).toHaveBeenCalledWith('/success')
  })
})
