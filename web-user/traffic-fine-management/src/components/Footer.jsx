import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-light text-center text-lg-start border-top mt-auto">
      <div className="container py-3 d-flex justify-content-between align-items-center">
        <div>
          <span className="text-muted">© {new Date().getFullYear()} Traffic Fine Management</span>
        </div>
        <div>
          <Link className="text-muted me-3" to="/">Home</Link>
          <Link className="text-muted me-3" to="/fines">My Fines</Link>
          <a className="text-muted" href="#">Privacy</a>
        </div>
      </div>
    </footer>
  )
}
