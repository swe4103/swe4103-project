import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import ChangePassword from './ChangePassword';
import '@testing-library/jest-dom';

jest.mock('axios');

test('renders password change form', () => {
  render(<ChangePassword />);
  expect(screen.getByText(/Change Password/)).toBeInTheDocument();
});

test('updates password successfully', async () => {
  axios.put.mockResolvedValueOnce({ message: 'Password updated successfully.' });

  render(<ChangePassword />);

  fireEvent.click(screen.getByText(/Change Password/));
  fireEvent.change(screen.getByPlaceholderText('Enter your old password'), {
    target: { value: 'oldpassword123' },
  });
  fireEvent.change(screen.getByPlaceholderText('Enter your new password'), {
    target: { value: 'newpassword456' },
  });

  fireEvent.click(screen.getByText(/Save/));

  await waitFor(() => {
    expect(screen.getByText('Password updated successfully!')).toBeInTheDocument();
  });
});
