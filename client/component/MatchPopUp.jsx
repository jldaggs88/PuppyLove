import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function MatchPopUp({ dog }) {

  const close = () => {
    document.getElementById("matchPopUp").style.width = "0px";
  };

  const logout = () => {
    axios.get('/logout')
    .then(() => console.log('successful logout'))
    .catch((err) => console.log('unsucessful logout: ', err))
  };
  
  return (
    <div id="matchPopUp" className="navbar">
      <h3>New Match!</h3>
      <button id='settings' onClick={close}>Close</button>
      <Link to="/" id='choice'>Home</Link>
      <Link to="/matches" id='matches'>Matches</Link>
      <div id='choice-box' key={dog.id} style={{ backgroundImage: `url('${dog.image}')` }}>
         <div id='title'>{dog.dog_name}</div>
         <div id='breed'>{dog.breed}</div>
         <div id='age'>{`${dog.age} Years Old`}</div>
      </div>
      <div className="nav">
      </div>
    </div>
  );
};

export default MatchPopUp;
