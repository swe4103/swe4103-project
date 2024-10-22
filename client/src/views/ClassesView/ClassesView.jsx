import AggregateJoyRatingsChart from '../../components/StudentJoyChart/AggregateStudentJoyChart'
import IndividualStudentJoyChart from '../../components/StudentJoyChart/IndividualStudentJoyChart'
import StudentJoyForm from '../../components/TeamJoyRating/StudentJoyForm'
const ClassesView = () => {
  return (
    <>
      <StudentJoyForm />
      <AggregateJoyRatingsChart />
      <IndividualStudentJoyChart />
    </>
  )
}

export default ClassesView
