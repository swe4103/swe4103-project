import { render, cleanup, fireEvent } from '@testing-library/react'

import '@testing-library/jest-dom'
import TeamListView from './TeamListView'

afterEach(cleanup)

const mockData = {
  classes: [
    {
      id: 1,
      name: 'Class 101',
      projects: [
        {
          id: 1,
          name: 'Project A',
          teams: [
            { id: 1, name: 'Team Alpha' },
            { id: 2, name: 'Team Beta' },
          ],
        },
      ],
    },
  ],
}

test('renders the correct structure for classes, projects, and teams', () => {
  const { getByText } = render(<TeamListView data={mockData} />)

  // Use a flexible matcher to account for any extra spaces or formatting differences
  const classNode = getByText(content => content.includes('Class 101'))
  fireEvent.click(classNode)

  const projectNode = getByText(content => content.includes('Project A'))
  fireEvent.click(projectNode)

  // Check if team names are in the document
  expect(getByText(content => content.includes('Team Alpha'))).toBeInTheDocument()
  expect(getByText(content => content.includes('Team Beta'))).toBeInTheDocument()
})

test('displays "No data available" when data is null', () => {
  const { getByText } = render(<TeamListView data={null} />)

  // Check that the fallback message is displayed
  expect(getByText('No data available')).toBeInTheDocument()
})
