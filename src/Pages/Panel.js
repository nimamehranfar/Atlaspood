import React from "react";
import {Link} from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import {Outlet} from "react-router";


function Panel() {
    return (
        <div className="panel_page_container">
            <Navbar bg="light" expand="lg">
                <Container fluid>
                    <Navbar.Brand>Admin Panel</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link as={Link} to="/admin/panel">Dashboard</Nav.Link>
                            <NavDropdown title="HomePage" id="navbarScrollingDropdown">
                                <NavDropdown.Item as={Link} to="/admin/panel/menu">Menu</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/admin/panel/slideshow">Slide Show</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/admin/panel/banner">Banner</NavDropdown.Item>
                                {/*<NavDropdown.Divider />*/}
                                {/*<NavDropdown.Item disabled>Footer</NavDropdown.Item>*/}
                            </NavDropdown>
                            <NavDropdown title="Curtains" id="navbarScrollingDropdown">
                                <NavDropdown.Item as={Link} to="/admin/panel/models">Models</NavDropdown.Item>
                                {/*<NavDropdown.Divider />*/}
                                {/*<NavDropdown.Item disabled>Footer</NavDropdown.Item>*/}
                            </NavDropdown>
                            <Nav.Link disabled>Products</Nav.Link>
                        </Nav>
                        <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="outline-success">Search</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
        </div>
    );
}
export default Panel;