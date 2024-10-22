import { useState } from 'react'

const LazyImage = ({ src, alt, className, placeholderClassName }) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative">
      {!loaded && <div className={placeholderClassName}></div>}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loaded ? 'block' : 'hidden'}`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  )
}

export default LazyImage
