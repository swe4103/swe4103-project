import '../../App.css'
import { useState } from 'react'

const TreeNode = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={{ marginLeft: '20px' }}>
      <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        {label} {isOpen ? '▼' : '►'}
      </div>
      {isOpen && <div>{children}</div>}
    </div>
  )
}

const TeamListView = ({ data }) => {
  if (!data || !data.classes) {
    return <div>No data available</div>
  }

  return (
    <div>
      {data.classes.map(classItem => (
        <TreeNode key={classItem.id} label={classItem.name}>
          {classItem.projects.map(project => (
            <TreeNode key={project.id} label={project.name}>
              {project.teams.map(team => (
                <TreeNode key={team.id} label={team.name}>
                  <button onClick={() => console.log(`Go to team ${team.name} dashboard`)}>
                    View Team Dashboard
                  </button>
                </TreeNode>
              ))}
            </TreeNode>
          ))}
        </TreeNode>
      ))}
    </div>
  )
}

export default TeamListView
