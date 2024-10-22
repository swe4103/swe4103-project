import AggregateJoyRatingsChart from '../../components/StudentJoyChart/AggregateStudentJoyChart'
import IndividualStudentJoyChart from '../../components/StudentJoyChart/IndividualStudentJoyChart'
import TotalTeamJoyChart from '../../components/StudentJoyChart/TotalTeamJoyChart'
import StudentJoyForm from '../../components/TeamJoyRating/StudentJoyForm'
const ClassesView = () => {
  return (
    <>
      <div>
        <StudentJoyForm />
      </div>
      <div>
        <AggregateJoyRatingsChart />
      </div>
      <div>
        <IndividualStudentJoyChart />
      </div>
      <div>
        <TotalTeamJoyChart />
      </div>
    </>
  )
}

export default ClassesView
