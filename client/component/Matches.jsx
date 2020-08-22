import React, { useState, useEffect } from 'react';
import { Link, Route } from 'react-router-dom';
import axios from 'axios';
import { Row, Col } from "react-bootstrap";

function Matches({ open, sessUser, sessDog, dogViews, getFriends, loadComplete, matches, matchViews, addToFriendsList}) {

  const [ dogDisplay, setDogDisplay ] = useState('');
  const [ dogDisplayInfo, setDogDisplayInfo ] = useState('');
  const [ index, setIndex ] = useState(0);


  useEffect(() => {
    if (matches.length) {
      setDogDisplayInfo(matches[index])
      setDogDisplay(matchViews[index]);
    } else {
      setDogDisplay(<div id='choice-box'><div id='alt'>Looks like you don't have any new matches.</div></div>)
    }
  }, [matchViews, matches]);

  const next = () => {
    const newIndex = index + 1;
    setIndex(newIndex);
    if (newIndex < matchViews.length) {
      setDogDisplay(matchViews[newIndex]);
      setDogDisplayInfo(matches[newIndex]);
    } else {
      setDogDisplay(<div id='choice-box'><div id='alt'>Looks like you don't have any new matches.</div></div>);
    }
  };

    const nextBtn = (index < matchViews.length) ?
        <Col>
          <button id='yes' onClick={() => next()}>Next</button>
        </Col> : '';

    const profileLink = (index < matchViews.length) ?
        <Col>
          <Link to={`/dogprofile/${dogDisplayInfo.id}`} id='view'>View Profile</Link>
        </Col> : '';
          // if (!dogDisplayInfo) setDogDisplay(<div id='choice-box'><div id='alt'>Looks like you've made it through all the dogs in you're area. Please check back later.</div></div>);
          return (
            <div>
      <div>
        <Row>
          <button id='settings' onClick={open}>Menu</button>
        </Row>
        <Row>
          <Col>
            {dogDisplay}
          </Col>
        </Row>
        <Row id='select'>
          {nextBtn}
          {profileLink}
          <button id='add-friends' onClick={()=> addToFriendsList(matches[index])}>Add to FriendsList</button>
        </Row>
      </div>
    </div>
  );
};

export default Matches;