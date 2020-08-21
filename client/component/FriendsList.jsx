import React, { useState, useEffect } from 'react';
import ReactDom from "react-dom";
import axios from 'axios';

function FriendsList({ open, friendsList }) {

  return ( 
    <div className="flist">
      <button id='settings' onClick={open}>Menu</button>
      <div> FriendsList: </div>
      <ul>
        {console.log('working!!!!!!!!', friendsList)}
        {friendsList.map((friend, i) => {
          return (
            <li>{friend.username}</li>
          )
        })}
      </ul>
    </div>
  )
};

export default FriendsList;
