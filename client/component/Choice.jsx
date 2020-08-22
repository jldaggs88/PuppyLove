import React, { useState, useEffect } from 'react';
import { Link, Route } from 'react-router-dom';
import axios from 'axios';
import { Row, Col } from "react-bootstrap";

function Choice({ open, sessUser, sessDog, dogViews, displayDogs, getFriends, index, setIndex, loadComplete, setMatches, matches, matchViews, setMatchViews, matchPopUp }) {

  const [ dogDisplay, setDogDisplay ] = useState('');
  const [ dogDisplayInfo, setDogDisplayInfo ] = useState('');

  useEffect(() => {
    // console.log('the current index', index)
    if (displayDogs.length) {
      setDogDisplayInfo(displayDogs[index])
      setDogDisplay(dogViews[index]);
    } else if (loadComplete) {
      setDogDisplay(<div id='choice-box'><div id='alt'>Looks like you've made it through all the dogs in you're area. Please check back later.</div></div>)
    } else {
      setDogDisplay(<div id='choice-box'><div id='alt'>Looking for dogs...</div></div>)
    }
  }, [dogViews, displayDogs]);
  

  // useEffect(() => {
    
  //   console.log('the url', url)
  // }, [])

  const like = (result) => {
    const newIndex = index + 1;
    const likedIndex = index
    axios.post('/like', {
        result, // boolean
        dogOwnerId: displayDogs[index].id_user,
        userId: sessUser.id
      })
      .then(({ data }) => {
        console.log('the data from the match response:', data);
          if (data === true) {
            console.log('there was a match');
            setMatches(matches.concat(displayDogs[likedIndex]));
            setMatchViews(matchViews.concat(dogViews[likedIndex]));
            matchPopUp(displayDogs[likedIndex]);
          }
          // response should have bool if user was a match (if exists an entry in likes table that shows the dogOwnerID liked current user ID)
        })
        setIndex(newIndex);
        if (newIndex < dogViews.length) {
          setDogDisplay(dogViews[newIndex]);
          setDogDisplayInfo(displayDogs[newIndex]);
        } else {
          setDogDisplay(<div id='choice-box'><div id='alt'>Looks like you've made it through all the dogs in you're area. Please check back later.</div></div>);
        }
      };

      // const addFriend = () => {
        //   axios.post('/friends',  {
          //     id_dog: sessDog.id,
          //     id_friend: dogDisplayInfo.id,
          //     bool_friend: 0
          //   })
          //   .then(() => dislike())
          //   .then(() => console.log('this friend was added'))
          //   .catch((err) => console.error(err, 'we couldn\'t add this friend'));
          // };
    const no = dogDisplayInfo ?
        <Col>
          <button id='no' onClick={() => like(false)}>No</button>
        </Col> : '';

    const yes = dogDisplayInfo ?
        <Col>
          <button id='yes' onClick={() => like(true)}>Yes</button>
        </Col> : '';

    const profileLink = dogDisplayInfo ?
        <Col>
          <Link to={`/dogprofile/${dogDisplayInfo.id}`} id='view' onClick={() => getFriends(dogDisplayInfo.id)}>View Profile</Link>
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
          {no}
          {yes}
          {profileLink}
        </Row>
      </div>
    </div>
  );
};

export default Choice;