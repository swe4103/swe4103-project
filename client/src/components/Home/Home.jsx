import StudentJoyForm from '../../components/TeamJoyRating/StudentJoyForm'
import AggregateStudentJoyRatingsChart from '../StudentJoyChart/AggregateStudentJoyChart'
import IndividualStudentJoyChart from '../StudentJoyChart/IndividualStudentJoyChart'

const Home = () => {
  return (
    <>
      <StudentJoyForm />
      <AggregateStudentJoyRatingsChart />
      <IndividualStudentJoyChart />
    </>
  )
}

export default Home

// JoyRating:
//       type: object
//       properties:
//         id:
//           type: string
//         userId:
//           type: string
//           description: GUID (String)
//         teamId:
//           type: string
//           description: GUID (String)
//         date:
//           type: string
//           format: date-time
//         rating:
//           type: integer
//           description: Int from 0-5
