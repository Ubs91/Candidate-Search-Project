import { useState, useEffect } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';


const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  
  // Load saved candidates from localStorage on component mount
  useEffect(() => {
    const loadSavedCandidates = () => {
      const candidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
      setSavedCandidates(candidates);
    };
    
    loadSavedCandidates();
    
    // Add event listener to update the list if localStorage changes in another tab/window
    window.addEventListener('storage', loadSavedCandidates);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('storage', loadSavedCandidates);
    };
  }, []);

  // Function to remove a candidate from the saved list
  const removeCandidate = (id: number) => {
    const updatedCandidates = savedCandidates.filter(candidate => candidate.id !== id);
    setSavedCandidates(updatedCandidates);
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
  };

  return (
    <div className="saved-candidates">
      <h1>Potential Candidates</h1>
      
      {savedCandidates.length === 0 ? (
        <div className="no-candidates-message">No candidates have been accepted yet.</div>
      ) : (
        <div className="candidates-grid">
          {savedCandidates.map((candidate) => (
            <div key={candidate.id} className="candidate-card">
              <div className="candidate-header">
                <img 
                  src={candidate.avatar_url} 
                  alt={`${candidate.login}'s avatar`} 
                  className="avatar"
                />
                <div className="candidate-info">
                  <h2>{candidate.name || 'No name provided'}</h2>
                  <p className="username">@{candidate.login}</p>
                  <p className="location">
                    {candidate.location || 'Location not provided'}
                  </p>
                </div>
              </div>
              
              <div className="candidate-details">
                <p><strong>Email:</strong> {candidate.email || 'Not provided'}</p>
                <p><strong>Company:</strong> {candidate.company || 'Not provided'}</p>
                <p>
                  <strong>GitHub:</strong> 
                  <a href={candidate.html_url} target="_blank" rel="noopener noreferrer">
                    {candidate.html_url}
                  </a>
                </p>
              </div>
              
              <div className="candidate-actions">
                <button 
                  onClick={() => removeCandidate(candidate.id)} 
                  className="reject-btn"
                >
                  -
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedCandidates;