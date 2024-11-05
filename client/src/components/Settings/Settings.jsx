import axios from 'axios'
import { useState } from 'react'

import { useAuth } from '../../state/AuthProvider/AuthProvider'
//import './Settings.css'

const Settings = () => {
  const { user, updateUser } = useAuth()

  // State to store the display name shown on the page
  const [displayName, setDisplayName] = useState(user.user.displayName)

  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false)

  // State to display feedback messages to the user
  const [feedbackMessage, setFeedbackMessage] = useState('')

  // State to temporarily hold the new display name entered in the modal
  const [newDisplayName, setNewDisplayName] = useState(displayName)

  // Function to open the modal and reset feedback messages
  const handleOpenModal = () => {
    setIsModalOpen(true)
    setFeedbackMessage('')
  }

  // Function to close the modal and clear feedback messages
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFeedbackMessage('')
  }

  // Function to handle input changes in the modal's text field
  const handleDisplayNameChange = e => {
    setNewDisplayName(e.target.value)
  }

  // Function to handle the submission of a new display name
  const handleUpdateDisplayName = async () => {
    // Check if the input is empty
    if (newDisplayName.trim() === '') {
      setFeedbackMessage('Display name cannot be empty.')
    } else {
      try {
        // Make an API call to update the display name on the server
        await axios.put(
          `http://localhost:3000/api/users/${user.user.id}`,
          { displayName: newDisplayName },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )

        const updatedUser = {
          ...user,
          user: { ...user.user, displayName: newDisplayName },
        }
        updateUser(updatedUser) // Update global state
        setDisplayName(newDisplayName) // Update local state

        setFeedbackMessage('Display name updated successfully!')
        setIsModalOpen(false)
      } catch {
        setFeedbackMessage('Failed to update display name. Please try again.')
      }
    }
  }

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="profile-info">
        <h2>Profile Information</h2>
        <p>
          <strong>Display Name:</strong> {displayName}
        </p>
        <button onClick={handleOpenModal}>Change Display Name</button>
        {feedbackMessage && <p className="feedback">{feedbackMessage}</p>}
      </div>

      {/* Modal for changing the display name */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Change Display Name</h3>
            <input
              type="text"
              value={newDisplayName}
              onChange={handleDisplayNameChange}
              placeholder="Enter new display name"
            />
            <button onClick={handleUpdateDisplayName}>Save</button>
            <button onClick={handleCloseModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
