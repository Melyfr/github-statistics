import IUser from "../interfaces/IUser";
import mapboxgl from 'mapbox-gl'
import React, { useRef, useEffect } from 'react';
import '../style/User.css'

type UserProps = {
    user: IUser
    handler: (follower: string) => void
}

 const User:React.FC<UserProps> = ({user, handler}) => {
  const date = new Date().getFullYear();
  const maxPerYear = user.reposPerYears ? Math.max.apply(null, user.reposPerYears) : 0;
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current && user.location) {
      const cords = new mapboxgl.LngLat(user.location[0], user.location[1]);
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: cords,
        zoom: 1,
      });
      new mapboxgl.Marker({color: "#1B1C1E",}).setLngLat(cords).addTo(map);
  
      return () => map.remove();
    }
  }, []);

  return (
    <div className="user">
        <div className="user__user-card">
          <img src={user.img} alt="User image" className="user__user-img" />
          <div className="user__user-info">
            <span className="user__name">{user.name}</span>
            <span className="user__username">@{user.username}</span>
            <p className="user__desc">{user.bio}</p>
          </div>
          <a href={user.url} target="_blank" className="btn">Open in GitHub</a>
        </div>

        <div className="user__cards">

          {user.location ? 
            <div className="user__card user__card--map" ref={mapContainerRef}></div>
          : ''}

          {user.reposPerYears && user.reposPerYears.some(value => value > 0) ? 
            <div className="user__card user__card--year">
              <h2 className="user__card__title">Repos per year</h2>
              <div className="user__card__diagramm">
                { user.reposPerYears.map((count, index) => 
                    <div key={index} className="user__diagramm__item">
                      {count > 0 ? 
                        <p className="user__diagramm__count">{count}</p>
                      : ''}
                      {count > 0 ? 
                        <div key={index} className="user__diagramm__line" style={{height: `${count / maxPerYear * 130}px`}}></div>  
                      : ''}                
                      <p className="user__diagramm__year">{date + index - 4}</p>
                    </div>
                )}     
              </div>
            </div>
          : ''}

          {user.followersList ?  
            <div className="user__card user__card--followers">
              <div>
                <h2 className="user__card__title">Followers</h2>
                <p className="user__card__desc"><span className="accent">{user.followers}</span> total</p>
              </div>
              <div>
                <p>Latests:</p>
                <div className="user__card__followers">
                  {user.followersList.map(follower => 
                    <img key={follower.id} src={follower.img} alt={follower.username} title={follower.username} onClick={() => handler(follower.username)} className="user__card__follower"/>
                  )} 
                </div> 
              </div>
            </div>  
          : ''} 
        </div>

        {user.repsList ? 
          <div className="user__repos">
          <div className="user__repos__header">
            <h2 className="user__repos__title">Recent repos</h2>
            <p className="user__repos__desc"><span className="accent">{user.repsCount}</span> total</p>
          </div>
          <table className="user__repos__table">
            <thead>
              <tr className="user__table__stroke--header">
                <th className="user__table__title table__title--name">Name</th>
                <th className="user__table__title table__title--update">Last update</th>
                <th className="user__table__title table__title--issues">Open issues</th>
                <th className="user__table__title table__title--watchers">Watchers</th>
                <th className="user__table__title table__title--forks">Forks</th>
              </tr>
            </thead>
            
            <tbody>
              {user.repsList.map(repo => 
                <tr key={repo.id} className="user__table__stroke">
                    <td className="user__table__item"><a href={repo.url} target="_blank">{repo.name}</a></td>
                    <td className="user__table__item user__table__item--date"><a href={repo.url} target="_blank">{repo.updateDate}</a></td>
                    <td className="user__table__item"><a href={repo.url} target="_blank">{repo.openIssues}</a></td>
                    <td className="user__table__item"><a href={repo.url} target="_blank">{repo.watchers}</a></td>
                    <td className="user__table__item"><a href={repo.url} target="_blank">{repo.forks}</a></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        : ''
        }
        {user.repsList ? 
          <div className="repos__mobile">
            <div className="mobile__header">
              <h2 className="user__repos__title">Recent repos</h2>
              <p className="user__repos__desc"><span className="accent">{user.repsCount}</span> total</p>
            </div>
            <div className="mobile__items">
              {user.repsList.map(repo => 
                <div className="mobile__item" key={repo.id}>
                  <p className="mobile__item__title">{repo.name}</p>

                  <div className="mobile__stoke">
                    <p className="mobile__stroke-name table__title--update">Last update:</p>
                    <p className="mobile__content">{repo.updateDate}</p>
                  </div>
        
                  <div className="mobile__stoke">
                    <p className="mobile__stroke-name table__title--issues">Open issues:</p>
                    <p className="mobile__stoke__content">{repo.openIssues}</p>
                  </div>
        
                  <div className="mobile__stoke">
                    <p className="mobile__stroke-name table__title--watchers">Watchers:</p>
                    <p className="mobile__stoke__content">{repo.watchers}</p>
                  </div>
        
                  <div className="mobile__stoke">
                    <p className="mobile__stroke-name table__title--forks">Forks:</p>
                    <p className="mobile__stoke__content">{repo.forks}</p>
                  </div>
                </div>  
              )}
            </div>
          </div>
        : ''}
    </div>
  )
}

export default User;