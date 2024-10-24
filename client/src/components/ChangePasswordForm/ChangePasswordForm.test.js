import { render, screen, fireEvent } from '@testing-library/react'

import '@testing-library/jest-dom'
import ChangePasswordForm from './ChangePasswordForm'

describe('ChangePasswordForm', () => {
  it('submits form with valid data', () => {
    const mockSubmit = jest.fn() // Mocking form submission
    render(<ChangePasswordForm onSubmit={mockSubmit} />)

    const currentPasswordInput = screen.getByLabelText('Current Password')
    const newPasswordInput = screen.getByLabelText('New Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password')
    const submitButton = screen.getByRole('button', { name: /save new password/i })

    // Simulate valid input
    fireEvent.change(currentPasswordInput, { target: { value: 'oldpassword' } })
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword' } })

    // Simulate form submission
    fireEvent.click(submitButton)

    // Expect the form to be submitted
    expect(mockSubmit).toHaveBeenCalled()
  })
})
