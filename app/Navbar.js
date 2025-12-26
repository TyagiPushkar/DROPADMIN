"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";

export default function MainNavbar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar expand="lg" className="bg-white shadow-sm py-3" sticky="top">
        <Container>
          <Navbar.Brand
            as={Link}
            href="/"
            className="d-flex align-items-center fw-bold fs-3"
          >
            <div className="me-2" style={{ width: "40px", height: "40px" }}>
              <Image
                src="/images/droplogo.jpg"
                alt="DROP Logo"
                width={40}
                height={40}
                className="rounded"
              />
            </div>
            <span style={{ color: "#A1D9F1" }}>DROP</span>
          </Navbar.Brand>

          <Button
            variant="outline-primary"
            className="d-lg-none"
            onClick={handleShow}
            style={{ borderColor: "#A1D9F1", color: "#A1D9F1" }}
          >
            Menu
          </Button>

          <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-block">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} href="/" className="mx-3 fw-medium">
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                href="/food-delivery"
                className="mx-3 fw-medium"
              >
                Food Delivery
                <span className="badge bg-success ms-1">New</span>
              </Nav.Link>
              <Nav.Link as={Link} href="/bike-taxi" className="mx-3 fw-medium">
                Bike Taxi
                <span className="badge bg-warning ms-1">Hot</span>
              </Nav.Link>
              <Nav.Link as={Link} href="/partner" className="mx-3 fw-medium">
                Become a Partner
              </Nav.Link>
              <Nav.Link as={Link} href="/about" className="mx-3 fw-medium">
                About Us
              </Nav.Link>
              <Nav.Link as={Link} href="/contact" className="mx-3 fw-medium">
                Contact
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="d-flex align-items-center">
            <div className="me-2" style={{ width: "35px", height: "35px" }}>
              <Image
                src="/images/droplogo.jpg"
                alt="DROP Logo"
                width={35}
                height={35}
                className="rounded"
              />
            </div>
            <span style={{ color: "#A1D9F1" }}>DROP</span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link
              as={Link}
              href="/"
              onClick={handleClose}
              className="py-3 border-bottom"
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/food-delivery"
              onClick={handleClose}
              className="py-3 border-bottom"
            >
              Food Delivery
              <span className="badge bg-success ms-2">New</span>
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/bike-taxi"
              onClick={handleClose}
              className="py-3 border-bottom"
            >
              Bike Taxi
              <span className="badge bg-warning ms-2">Hot</span>
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/partner"
              onClick={handleClose}
              className="py-3 border-bottom"
            >
              Become a Partner
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/about"
              onClick={handleClose}
              className="py-3 border-bottom"
            >
              About Us
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/contact"
              onClick={handleClose}
              className="py-3 border-bottom"
            >
              Contact
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
