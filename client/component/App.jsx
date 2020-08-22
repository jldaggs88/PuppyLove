import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar.jsx';
import Choice from './Choice.jsx';
import Login from './Login.jsx';
import MyProfile from './MyProfile.jsx';
import DogProfile from './DogProfile.jsx';
import PopularLocations from './PopularLocations.jsx';
import SignUp from './SignUp.jsx';
import Preferences from './Preferences.jsx';
import FriendsList from './FriendsList.jsx';
import Matches from './Matches.jsx';
import MatchPopUp from './MatchPopUp.jsx';

function App(props) {
   const [ lat, setLat ] = useState('');
   const [ lng, setLng ] = useState('');
   const [ sessUser, setSessUser ] = useState({id: 0});
   const [ sessDog, setSessDog ] = useState('');
   const [ dogViews, setDogViews ] = useState([]);
   const [ allDogs, setAllDogs ] = useState([]);
   const [ displayDogs, setDisplayDogs ] = useState([]);
   const [ matches, setMatches ] = useState([]);
   const [ matchViews, setMatchViews ] = useState([]);
   const [ newMatch, setNewMatch ] = useState({});
   // const [ friends, setFriends ] = useState('');
   const [ index, setIndex ] = useState(0);
   const [ filter, setFilter ] = useState(0);
   const [ friend, setFriend ] = useState({});
   const [ loadComplete, setLoadComplete ] = useState(false);
   // const [ likes, setLikes ] = useState('');

   useEffect(() => {
      axios.get('/session')
      .then(response => {
         setSessUser(response.data)
         return response.data.id
      })
      .then((id) => {
         getDogs(id);
      })
      .catch(err => console.error(err));
   }, []);

   // const getLikes = (id) => {
   //    const currentId = sessUser.id || id;
   //    axios.get(`/like/${currentId}`)
   //    .then(({ data }) => {
   //       // filterDogs({ likes: data });
   //       setLikes(data);
   //       console.log('the likes obj A', data)
   //    })
   // }

   // useEffect(() => {
   //    if (displayDogs.length) {
   //       filterDogs({ likes })
   //    }
   //    console.log('dogs:', displayDogs, 'likes', likes);
   // }, [likes, allDogs, index])

   // useEffect(() => {
   //    axios.get('/myProfileInfo')
   //       .then(response => setSessUser(response.data[0]))
   //       .catch(err => console.log(16, err));
   // }, [])

   // useEffect(() => {
   //    axios.get('/currentDog')
   //    .then(response => setSessDog(response.data[0]))
   //    .catch(err => console.error('could not set session dog: ', err));
   // }, []);
   const getDogs = (id) => {
      axios.get(`/dogs/${id}`)
      .then((response) => {
         const { dogs, matches } = response.data;
         console.log('the matches from the request body', matches);
         setLoadComplete(true);
         setDisplayDogs(dogs);
         setAllDogs(dogs);
         setMatches(matches);
         return { dogs, matches }
      })
      .then(({ dogs, matches }) => {
         if (dogs.length) {
            setDogViews(dogs.map(option => {
               return (
                  <div id='choice-box' key={option.id} style={{ backgroundImage: `url('${option.image}')` }}>
                     <div id='title'>{option.dog_name}</div>
                     <div id='breed'>{option.breed}</div>
                     <div id='age'>{`${option.age} Years Old`}</div>
                  </div>
               );
            }));
         } else {
            setDogViews(<div id='choice-box'><div id='alt'>Looks like you've made it through all the dogs in you're area. Please check back later.</div></div>)
         }
         if (matches.length) {
            setMatchViews(matches.map(option => {
               return (
                  <div id='choice-box' key={option.id} style={{ backgroundImage: `url('${option.image}')` }}>
                     <div id='title'>{option.dog_name}</div>
                     <div id='breed'>{option.breed}</div>
                     <div id='age'>{`${option.age} Years Old`}</div>
                  </div>
               );
            }));
         }
            // setDogViews(
            // <div id='choice-box'>
            //    <div id='title'>{option.dog_name}</div>
            //    <div id='breed'>{option.breed}</div>
            //    <div id='age'>{`${option.age} Years Old`}</div>
            // </div>)
         
      })
      .catch((err) => console.error(err, 'Could not get all dogs.'));
   }

   // useEffect(() => {
      
   // }, []);

    useEffect(() => {
      const showPosition = (position) => {
         setLng(position.coords.longitude);
         setLat(position.coords.latitude);
      }

      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(showPosition);
      } else {
         console.log("Geolocation is not supported by this browser....");
      }
   }, []);

   const open = () => {
      document.getElementById("mySidenav").style.width = "280px";
   };

   const matchPopUp = (dog) => {
      
      console.log('the matched dog is:', dog);
      setNewMatch(dog);
      document.getElementById("matchPopUp").style.width = "800px";

   }

   const getFriends = (dogId) => {
      // console.log('hit getFriends', dogId);
      // axios.post('/dogFriends', { doggyId: dogId })
      // .then(response => setFriends(response.data))
      // .catch(() => console.error('We could not get this dog\'s friends'));
   };

   const getSessDog = () => {
      axios.get('/currentDog')
      .then(response => setSessDog(response.data[0]))
      .catch(err => console.error('could not set session dog: ', err));
   }

   const filterDogs = ({ minAge, maxAge, breed }) => {
      let dogs = allDogs.slice();
      // console.log('displayDogs are initially', dogs, dogs.length)
      // console.log('the likes obj B', likes, 'the sessUser Id:', sessUser.id)
      // if (typeof likes === 'object') {
      //    dogs = dogs.filter((dog) => !(likes.hasOwnProperty(dog.id_user) || dog.id_user === sessUser.id))
      //    console.log('displayDogs are now', dogs.length)
      // }

      dogs = dogs.filter((dog) => {
         let bool = true;
         if (minAge && minAge !== '') {
            bool = dog.age >= minAge;
         }
         if (maxAge && bool && maxAge !== '') {
            bool = dog.age <= maxAge;
         }
         if (breed && bool && breed !== '') {
            bool = dog.breed.toUpperCase().includes(breed.toUpperCase());
         }
         return bool;
      })
      setDisplayDogs(dogs);
      setDogViews(dogs.map(option => {
         return (
            <div id='choice-box' key={option.id} style={{ backgroundImage: `url('${option.image}')` }}>
               <div id='title'>{option.dog_name}</div>
               <div id='breed'>{option.breed}</div>
               <div id='age'>{`${option.age} Years Old`}</div>
            </div>
         );
      }));
   }

   // when invoked add the match as the friend to be added
   const addToFriendsList = (match) => {
      console.log("addtofriends invoked", match);
      setFriend(match);

      axios.post('/friendslist', {
         userId: sessUser.id,
         friend: match.id_user
      }).then(() => console.log('friend added to db from client', ))
      .catch((err) => console.error("failed to post friend to db from client", err))
   }   


   return (
      <Router>

         <Sidebar sessUser={sessUser} sessDog={sessDog} getFriends={getFriends} allDogs={allDogs} />
         <MatchPopUp dog={newMatch} />
         <div className='App'>
            <Switch>
               <Route exact={true} path="/" render={() => (<Choice open={open} sessUser={sessUser} sessDog={sessDog} dogViews={dogViews} displayDogs={displayDogs} index={index} setIndex={setIndex} loadComplete={loadComplete} setMatches={setMatches} matches={matches} matchViews={matchViews} setMatchViews={setMatchViews} matchPopUp={matchPopUp} />)} />
               <Route exact path="/login" render={() => (<Login />)} />
               <Route path="/myprofile" render={() => (<MyProfile open={open} sessUser={sessUser} sessDog={sessDog} />)} />
               <Route path="/dogprofile" render={() => (<DogProfile open={open} sessUser={sessUser} sessDog={sessDog} allDogs={allDogs} matches={matches}/>)} />
               <Route path="/popular" render={() => (<PopularLocations sessUser={sessUser} sessDog={sessDog} google={props.google} open={open} center={{ lat: 29.9511, lng: 90.0715 }} zoom={10} />)} />
               <Route path="/signUp" render={() => (<SignUp sessUser={sessUser} sessDog={sessDog} getSessDog={getSessDog}/>)} />
               <Route path="/preferences" render={() => (<Preferences open={open} filterDogs={filterDogs} setFilter={setFilter} setIndex={setIndex}></Preferences>)} />
               <Route path="/friendslist" render={() => (<FriendsList open={open} friend={friend} />)} />
               <Route path="/matches" render={() => (<Matches open={open} sessUser={sessUser} sessDog={sessDog} getSessDog={getSessDog} matches={matches} matchViews={matchViews} addToFriendsList={addToFriendsList} />)} />
            </Switch>
         </div>
      </Router>
   );
};

export default App;
