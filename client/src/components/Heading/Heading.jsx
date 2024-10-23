import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Button from '../Button/Button'

const Heading = ({ title, isAllowed = false }) => {
  return (
    <div className="flex w-full justify-between items-center pb-4">
      <h3 className="text-lg font-bold">{title}</h3>
      {isAllowed && (
        <div className="flex gap-4">
          <Button>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon="plus" />
              <span>New</span>
            </div>
          </Button>
          <Button>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon="pen-to-square" />
              <span>Update</span>
            </div>
          </Button>
          <Button>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon="trash-can" />
              <span>Remove</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}

export default Heading
