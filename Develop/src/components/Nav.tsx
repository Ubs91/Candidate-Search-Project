import { Link } from 'react-router-dom';


const Nav = () => {
  return (
    <nav className="navbar">
      <h1>GitHub Candidate Search</h1>
      <ul className="nav-links">
        <li>
          <Link to="/">Search Candidates</Link>
        </li>
        <li>
          <Link to="/SavedCandidates">Potential Candidates</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;