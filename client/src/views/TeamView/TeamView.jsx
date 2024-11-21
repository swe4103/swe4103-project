import AggregateJoyRatingsChart from '../../components/StudentJoyChart/AggregateStudentJoyChart'
import IndividualStudentJoyChart from '../../components/StudentJoyChart/IndividualStudentJoyChart'
import TotalTeamJoyChart from '../../components/StudentJoyChart/TotalTeamJoyChart'
import StudentJoyForm from '../../components/TeamJoyRating/StudentJoyForm'

const TeamView = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    gap: '20px',
  }

  const formContainerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center', // Fix typo (flex-center -> center)
    padding: '10px',
    backgroundColor: '#f1f3f5', // Optional background for visual separation
    borderRadius: '8px',
  }

  const chartsContainerStyle = {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap', // Allows charts to stack on smaller screens
    justifyContent: 'space-between',
    gap: '20px',
    padding: '10px',
  }

  const chartStyle = {
    flex: '1 1 30%', // Each chart takes 30% width and can shrink if needed
    minWidth: '200px', // Ensures the charts are at least 250px wide
    height: '300px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
  }

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <StudentJoyForm />
      </div>
      <div style={chartsContainerStyle}>
        <div style={chartStyle}>
          <AggregateJoyRatingsChart />
        </div>
        <div style={chartStyle}>
          <IndividualStudentJoyChart />
        </div>
        <div style={chartStyle}>
          <TotalTeamJoyChart />
        </div>
      </div>
    </div>
  )
}

export default TeamView
