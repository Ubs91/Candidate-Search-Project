import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';


const CandidateSearch = () => {
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [noMoreCandidates, setNoMoreCandidates] = useState<boolean>(false);

  // Function to fetch a new candidate
  const fetchCandidate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get list of users
      const users = await searchGithub();
      
      if (users && users.length > 0) {
        // Get detailed information for the first user
        const userData = await searchGithubUser(users[0].login);
        setCurrentCandidate(userData);
      } else {
        setNoMoreCandidates(true);
      }
    } catch (err) {
      setError('Error fetching candidates. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCandidate();
  }, []);

  // Function to save the current candidate
  const saveCandidate = () => {
    if (currentCandidate) {
      // Get existing saved candidates from localStorage
      const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
      
      // Add current candidate to the list if not already saved
      if (!savedCandidates.some((candidate: Candidate) => candidate.id === currentCandidate.id)) {
        savedCandidates.push(currentCandidate);
        localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
      }
      
      // Fetch the next candidate
      fetchCandidate();
    }
  };

  // Function to reject the current candidate
  const rejectCandidate = () => {
    fetchCandidate();
  };

  if (loading) {
    return <div className="loading">Loading candidate...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (noMoreCandidates) {
    return <div className="no-candidates">No more candidates available to review.</div>;
  }

  return (
    <div className="candidate-search">
      <h1>Candidate Search</h1>
      
      {currentCandidate && (
        <div className="candidate-card">
          <div className="candidate-header">
            <img 
              src={currentCandidate.avatar_url} 
              alt={`${currentCandidate.login}'s avatar`} 
              className="avatar"
            />
            <div className="candidate-info">
              <h2>{currentCandidate.name || 'No name provided'}</h2>
              <p className="username">@{currentCandidate.login}</p>
              <p className="location">
                {currentCandidate.location || 'Location not provided'}
              </p>
            </div>
          </div>
          
          <div className="candidate-details">
            <p><strong>Email:</strong> {currentCandidate.email || 'Not provided'}</p>
            <p><strong>Company:</strong> {currentCandidate.company || 'Not provided'}</p>
            <p><strong>Bio:</strong> {currentCandidate.bio || 'No bio provided'}</p>
            <p>
              <strong>GitHub:</strong> 
              <a href={currentCandidate.html_url} target="_blank" rel="noopener noreferrer">
                {currentCandidate.html_url}
              </a>
            </p>
            <div className="stats">
              <div>Public Repos: {currentCandidate.public_repos}</div>
              <div>Followers: {currentCandidate.followers}</div>
              <div>Following: {currentCandidate.following}</div>
            </div>
          </div>
          
          <div className="candidate-actions">
            <button onClick={rejectCandidate} className="reject-btn">
              -
            </button>
            <button onClick={saveCandidate} className="accept-btn">
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateSearch;