import React, { useState, useEffect } from 'react';
import ReactDom from "react-dom";
import axios from 'axios';
import { Link } from 'react-router-dom';


function FriendsList({ open, friend, dogDisplayInfo }) {

  return ( 

    <div className="flist">
      <button id='settings' onClick={open}>Menu</button>
      <div> FriendsList: </div>
        <ul>
          <li>
            <img src={friend.image} />
            <Link to={`/dogprofile/${friend.id}`} id='view'>{`${friend.dog_name} the ${friend.breed}`}</Link>
          </li>
          {/* <li onClick={}>{`${friend.dog_name} the ${friend.breed}`}</li> */}
        </ul>
      {/* <ul>
        {console.log('added friend!!!!!!!!', friendsList)}
        {friendsList.map((friend, i) => {
          return (
            <li>{friend.username}</li>
          )
        })}
      </ul> */}
    </div>
  )
};

export default FriendsList;
