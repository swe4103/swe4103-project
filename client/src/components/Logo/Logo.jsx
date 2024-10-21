import colouredIcon from '../../assets/images/icon-coloured.svg'
import whiteIcon from '../../assets/images/icon-white.svg'

const Logo = ({ coloured = true, withText = false, size = 2.3, ...props }) => {
  const fontSize = `${size}rem`
  const imageSize = `${size * 2}rem`
  return (
    <div className={`flex items-center ${props.className}`} style={{ fontSize: fontSize }}>
      <img
        src={coloured ? colouredIcon : whiteIcon}
        alt="Logo Icon"
        style={{ width: imageSize, height: imageSize }}
      />

      {withText &&
        (coloured ? (
          <>
            <span className="text-accent">Time</span>
            <span className="text-primary">Flow</span>
          </>
        ) : (
          <span className="text-white">TimeFlow</span>
        ))}
    </div>
  )
}

export default Logo
