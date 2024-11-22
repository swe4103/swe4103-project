import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import '@testing-library/jest-dom'
import { sendRegistrationEmail } from '../../../../api/app/services/emailService'

import InstructorInviteStudents from './InstructorInviteStudents'

jest.mock('../../../../api/app/services/emailService', () => ({
  sendRegistrationEmail: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(() => jest.fn()),
}))

describe('InstructorInviteStudents', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {}) // Suppress console.error
  })

  afterAll(() => {
    console.error.mockRestore() // Restore original implementation
  })

  test('renders the component correctly', () => {
    render(
      <MemoryRouter>
        <InstructorInviteStudents />
      </MemoryRouter>,
    )

    expect(screen.getByText('Invite Students')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Enter student emails, separated by commas'),
    ).toBeInTheDocument()
    expect(screen.getByText('Send Invites')).toBeInTheDocument()
  })

  test('sends invitations on valid form submission', async () => {
    sendRegistrationEmail.mockResolvedValueOnce()

    render(
      <MemoryRouter>
        <InstructorInviteStudents />
      </MemoryRouter>,
    )

    const emailInput = screen.getByPlaceholderText('Enter student emails, separated by commas')
    const sendButton = screen.getByText('Send Invites')

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test1@example.com, test2@example.com' } })
      fireEvent.click(sendButton)
    })

    expect(sendRegistrationEmail).toHaveBeenCalledTimes(2) // Called once per email
  })

  test('displays error message on failure', async () => {
    sendRegistrationEmail.mockRejectedValueOnce(new Error('Failed to send invites'))

    render(
      <MemoryRouter>
        <InstructorInviteStudents />
      </MemoryRouter>,
    )

    const emailInput = screen.getByPlaceholderText('Enter student emails, separated by commas')
    const sendButton = screen.getByText('Send Invites')

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(sendButton)
    })

    expect(
      await screen.findByText('Failed to send invites. Please check the emails and try again.'),
    ).toBeInTheDocument()
  })
})
