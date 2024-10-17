import { Navbar, Nav } from 'react-bootstrap'

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <Navbar bg="primary" variant="dark" expand="lg" className="w-100">
        <Navbar.Brand href="/">Dawn&apos;s Favourite App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="flex-column">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/">Classes</Nav.Link>
            <Nav.Link href="/">My Account</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </aside>
  )
}

export default Sidebar
