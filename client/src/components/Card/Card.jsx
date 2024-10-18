const Card = ({ children, height, width, ...props }) => (
  <div
    className={`bg-white rounded-md shadow p-4 ${props}`}
    style={{ height: height, width: width }}
  >
    {children}
  </div>
)

export default Card
