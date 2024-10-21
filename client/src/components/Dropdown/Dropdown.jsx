import { useState, useRef, useEffect } from 'react'

function Dropdown({ children, content, width }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => setIsOpen(!isOpen)

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="p-2">
        {children}
      </button>
      <div
        style={{ width }}
        className={`absolute bg-white rounded top-12 right-0 border border-slate-200 transition-transform duration-200 origin-top ${isOpen ? 'scale-y-100' : 'scale-y-0'}`}
      >
        {isOpen && content}
      </div>
    </div>
  )
}

export default Dropdown
