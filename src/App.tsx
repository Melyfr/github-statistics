import { useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl'
import IUser from './interfaces/IUser';
import IFollower from './interfaces/IFollower';
import IRepo from './interfaces/IRepo';
import 'mapbox-gl/dist/mapbox-gl.css';
import './style/App.css';
import User from './components/User';


mapboxgl.accessToken = import.meta.env.VITE_MAPBOXGL_API_KEY;

const App = () => {
  const [userName, setUserName] = useState('');
  const [status, setStatus] = useState(0);
  const [user, setUser] = useState<IUser | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const followerHanlder = async(follower:string) => {
    if (buttonRef.current) {
      await setUserName(follower);
      buttonRef.current.click();
    }
  };

  const getFollowers = async():Promise<IFollower[]> => {
    let followersList:IFollower[] = [];

    const followersResponse = await fetch(`https://api.github.com/users/${userName}/followers?per_page=6`);
    if (followersResponse.ok) {
      const followersData = await followersResponse.json();
      followersData.map((follower:any) => followersList = followersList.concat({id: follower.id, username: follower.login, img: follower.avatar_url}));
    };
    
    return followersList;
  };

  const getRepos = async():Promise<IRepo[]> => {
    let repsList:IRepo[] = [];

    const repsResponse = await fetch(`https://api.github.com/users/${userName}/repos?per_page=8&sort=updated`);
    if (repsResponse.ok) {
       const repsData = await repsResponse.json();
       repsData.map((repo:any) => repsList = repsList.concat({id: repo.id, name: repo.name, url: repo.html_url, updateDate:  repo.updated_at.split('T')[0], forks: repo.forks, watchers: repo.watchers, openIssues: repo.open_issues}));
    };
    
    return repsList;
  }

  const getReposPerYears = async():Promise<number[]> => {
    let reposPerYears:number[] = [];
    const date = new Date().getFullYear();

    for(let i = date - 4; i <= date; i++) {
      const response = await fetch(`https://api.github.com/search/repositories?q=owner:${userName}+created:${i}`);
      if (response.ok) {
        const responseData = await response.json();
        reposPerYears.push(responseData.total_count);
      }
    }
    
    return reposPerYears;
  }

  const getLocation = async(location: string):Promise<number[]> => {
    let cords:number[] = [];
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${mapboxgl.accessToken}`);

    if (response.ok) {
      const responseData = await response.json();
      cords.push(responseData.features[0].center[0]);
      cords.push(responseData.features[0].center[1]);
    }

    return cords;
  }

  const searchHandler = async() => {
    setStatus(1);
    setUser(null);
    
    const userResponse = await fetch(`https://api.github.com/users/${userName}`);
    if (userResponse.ok) {
      const data = await userResponse.json();
      setUser({
        name: data.name,
        username: data.login,
        img: data.avatar_url,
        email: data.email,
        followers: data.followers,
        repsCount: data.public_repos,
        url: data.html_url,
        company: data.company,
        creationDate: data.created_at.split('T')[0],
        bio: data.bio,
        location: data.location ? await getLocation(data.location) : null,
        followersList: data.followers > 0 ? await getFollowers() : null,
        repsList: data.public_repos > 0 ? await getRepos() : null,
        reposPerYears: data.public_repos > 0 ? await getReposPerYears() : null
      });
      setStatus(2);
    } else {
      setStatus(3);
    }
  };

  return (
    <div className='container'>
      <header className={status ? 'header' : 'header header--active'}>
        <a href="#" className='title'>GitHub Statistics</a>
        <div className='search'>
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className='search__input' placeholder=''/>
          <button onClick={searchHandler} className='search__button' ref={buttonRef}/>
        </div>
      </header>
      <main>
        {status == 1 ? <div className="loader"></div> : ''}
        {user && status == 2 ? <User user={user} handler={followerHanlder}/> : ''}
        {status == 3 ?  <div className="error">A user with this name was not found</div> : ''}
      </main>
      
    </div>
  )
}

export default App;
