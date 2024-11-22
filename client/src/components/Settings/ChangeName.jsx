import axios from 'axios'
import { useState } from 'react'

import { useAuth } from '../../state/AuthProvider/AuthProvider'

const ChangeName = () => {
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
    }
    // Check if the input name is the same as the current name
    else if (newDisplayName.trim() === displayName.trim()) {
      setFeedbackMessage('Cannot be the same as the current name.')
    } else {
      try {
        // Make an API call to update the display name on the server
        await axios.put(
          `/api/users/${user.user.id}`,
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-semibold text-[var(--color-primary)]">Settings</h1>
      <div className="profile-info w-full max-w-md bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-semibold text-[var(--color-dark)]">Profile Information</h2>
        <p className="mt-4">
          <strong>Display Name:</strong> {displayName}
        </p>
        <button
          onClick={handleOpenModal}
          className="mt-4 bg-[var(--color-primary)] text-[var(--color-white)] px-4 py-2 rounded transition-ease hover:bg-[var(--color-accent)]"
        >
          Change Display Name
        </button>
        {!isModalOpen && feedbackMessage && (
          <p
            className={`mt-2 ${
              feedbackMessage.includes('successfully')
                ? 'text-[var(--color-success)]'
                : 'text-[var(--color-danger)]'
            }`}
          >
            {feedbackMessage}
          </p>
        )}
      </div>

      {/* Modal for changing the display name */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h3 className="text-xl font-semibold text-[var(--color-dark)]">Change Display Name</h3>
            <input
              type="text"
              value={newDisplayName}
              onChange={handleDisplayNameChange}
              placeholder="Enter new display name"
              className="mt-4 w-full p-3 border rounded transition-ease focus:border-[var(--color-primary)]"
            />
            {feedbackMessage && (
              <p
                className={`mt-2 ${
                  feedbackMessage.includes('successfully')
                    ? 'text-[var(--color-success)]'
                    : 'text-[var(--color-danger)]'
                }`}
              >
                {feedbackMessage}
              </p>
            )}
            <div className="flex justify-around mt-6">
              <button
                onClick={handleCloseModal}
                className="bg-[var(--color-danger)] text-[var(--color-white)] px-4 py-2 rounded transition-ease hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDisplayName}
                className="bg-[var(--color-primary)] text-[var(--color-white)] px-4 py-2 rounded transition-ease hover:bg-[var(--color-accent)]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChangeName
