import config from '#config'
import Roles from '#constants/roles.js'
import bcrypt from 'bcryptjs'; // For password hashing
import { inviteSchema, updateUserSchema } from '#schemas/users.js'
import {
  inviteUsersByEmail,
  getUserById,
  updateUserById,
  deleteUserById,
  updateUserPasswordById, // Import the service function for updating password
} from '#services/usersService.js'

export const inviteUsers = async (req, res) => {
  const { error, value } = inviteSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    await inviteUsersByEmail(value)
    return res.status(200).json({ message: `${req.body.role} invitations sent successfully.` })
  } catch (error) {
    console.error('Error sending invites:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getUser = async (req, res) => {
  const { id } = req.params
  try {
    const user = await getUserById(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json(user)
  } catch (error) {
    console.error('Error retrieving user: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateUser = async (req, res) => {
  const { id } = req.params

  // Validate the request body against the updateUserSchema
  const { error, value } = updateUserSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    // Call the service function to update the user by ID
    const updatedUser = await updateUserById(id, value)
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json(updatedUser)
  } catch (error) {
    console.error('Error updating user: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const deleteUser = async (req, res) => {
  const { id } = req.params
  try {
    const deletedId = await deleteUserById(id) // Fix variable name to deletedId
    if (!deletedId) {
      // Check for the correct variable name
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(204).send()
  } catch (error) {
    console.error('Error deleting user: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const changePassword = async (req, res) => {
  const { id } = req.params
  const { oldPassword, newPassword } = req.body
  // Validate the passwords
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old and new passwords are required.' });
  }

  try {
    // Fetch the current user from the database
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
  
