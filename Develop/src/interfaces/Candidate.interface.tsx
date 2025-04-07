// TODO: Create an interface for the Candidate objects returned by the API
export interface Candidate {
    id: number;
    login: string;       
    avatar_url: string;  
    html_url: string;     
    name: string | null;
    email: string | null;
    company: string | null;
    location: string | null;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
}