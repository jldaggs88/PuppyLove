require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
const flash = require('connect-flash');
require('./passport/passport');
// const data = require('../data.json')
const {
  addUser, getUsers, getDogs,
  addFriend, isAccCreated,
  addDog, addLoc, getLocs, getFriends,
  getCurrentDog, addNewFriend,

} = require('./queries.js');
const { Likes, Matches, Sequelize, Dog } = require('./db/db.js');

const { Op } = Sequelize;

const PORT = process.env.PORT || 3000;
const CLIENT_PATH = path.join(__dirname, '../client/dist');

const app = express();

/* Middleware================================================================== */

app.use(express.json());
app.use(cors());
app.use(express.static(CLIENT_PATH));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  secure: false,
}));
app.use(flash());

/* ============================================================================ */

/* Routes====================================================================== */
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const { googleId } = req.user;
    isAccCreated(googleId)
      .then((acc) => {
        if (acc) {
          res.redirect('/');
        } else {
          res.redirect('/signUp');
        }
      })
      .catch((err) => res.status(500).send(err));
  });

app.get('/dogs/:id', (req, res) => {
  const { id } = req.params;
  getDogs()
    .then(async (list) => {
      const likes = await Likes.findAll({
        where: {
          id_userA: id,
        },
        raw: true,
      });
      const likesObj = {};
      if (likes !== null) {
        likes.forEach((like) => {
          likesObj[like.id_userB] = null;
        });
      }
      const responseObj = {};
      responseObj.dogs = list.filter((dog) => !((dog.id_user in likesObj) || dog.id_user.toString() === id));
      const matchIDs = await Matches.findAll({
        where: {
          [Op.or]: {
            id_userA: { [Op.like]: `%${id}%` },
            id_userB: { [Op.like]: `%${id}%` },
          },
        },
      });
      if (matchIDs !== null) {
        responseObj.matches = await Promise.all(
          matchIDs.map(async (entry) => {
            const id_user = entry.id_userA.toString() === id ? entry.id_userB : entry.id_userA;
            const dog = await Dog.findOne({ where: { id_user } });
            return dog;
          }),
        );
      }
      // responseObj.matches = await

      res.send(responseObj);
    })
    .catch((err) => res.status(500).send(err));
});

// app.get('/myProfileInfo', (req, res) => {
//   const userId = req.session.passport.user.id;
//   getUser(userId)
//     .then((list) => res.send(list))
//     .catch((err) => res.sendStatus(500));
// });
// app.get('/like/:id', async (req, res) => {
//   const { id } = req.params;
//   const dogs = await Dog.findAll({});
//   const likes = await Likes.findAll({
//     where: {
//       id_userA: id,
//     },
//     raw: true,
//   });
//   const likesObj = {};
//   likes.forEach((like) => {
//     likesObj[like.id_userB] = null;
//   });
//   dogs.filter((dog) => !((dog.id_user in likesObj) || dog.id_user === id));
// });

app.post('/dogs', (req, res) => {
  const dogInfo = req.body;
  addDog(dogInfo)
    .then(() => res.sendStatus(201))
    .catch((err) => res.status(500).send(err));
});

// app.post('/updateUserAndDog', (req, res) => {
//   const userEditObj = req.body.user;
//   const dogEditObj = req.body.dog;
//   console.log('dogObj: ', dogEditObj);
//   const userId = req.session.passport.user.id;
//   const updateUserObj = null;
//   addUser(userId, userEditObj)
//     .then((result) => console.log(result))
//     .catch((err) => console.log(err));
//   updateDog(userId, dogEditObj).then((result) => {
//     res.send({ user: updateUserObj, dog: result.data });
//   })
//     .catch((err) => console.log(err));
// });

app.get('/currentDog', (req, res) => {
  const userId = req.session.passport.user.id;
  getCurrentDog(userId)
    .then((dog) => {
      console.log('/currentDog', dog);
      res.status(200).send(dog);
    })
    .catch((err) => res.sendStatus(500));
});

app.get('/users', (req, res) => {
  getUsers()
    .then((list) => res.status(200).send(list))
    .catch((err) => res.sendStatus(500));
});

app.post('/users', (req, res) => {
  const userInfoObj = req.body;
  const userId = req.session.passport.user.id;
  addUser(userId, userInfoObj).then(() => res.sendStatus(201).redirect('/')).catch((err) => res.sendStatus(500));
});

app.post('/dogFriends', (req, res) => {
  const { doggyId } = req.body;
  console.log('/dogFriends', req.body);
  getFriends(doggyId).then((list) => res.status(200).send(list)).catch(() => res.sendStatus(500));
});

app.post('/friends', (req, res) => {
  const friendObj = {
    dogId: req.session.passport.dog,
    friendId: req.body,
    bool_friend: 1,
};
  addFriend(friendObj)
    .then(() => res.sendStatus(201))
    .catch(() => res.sendStatus(500));
});

// // add friend to friend table not sure about the function above but this one works
// app.post('/friendslist', (req, res) => {
//   const { userId, friend } = req.body;
//   addNewFriend(userId, friend)
//     .then((res) => res.status(201).send('add new friend route success!'))
//     .catch((err) => console.error('route to db failed to add new freind', err));
// });

// app.post('/unfriend', (req, res) => {
//   const dogId = req.session.passport.dog;
//   const friendId = req.body;
//   const bool = 0;
//   unFriend(dogId, friendId, bool)
//     .then(() => res.sendStatus(201))
//     .catch((err) => res.sendStatus(500));
// });

app.get('/loc', (req, res) => {
  getLocs()
    .then((list) => res.status(200).send(list))
    .catch((err) => res.sendStatus(500));
});

app.post('/loc', (req, res) => {
  const locObj = req.body;
  addLoc(locObj)
    .then(() => res.sendStatus(201))
    .catch((err) => res.sendStatus(500));
});

app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/login');
});

app.get('/session', (req, res) => {
  if (req.session.passport) {
    res.send(req.session.passport.user);
  } else {
    res.sendStatus(200);
  }
});

app.get('*', (req, res) => {
  res.sendFile(`${CLIENT_PATH}/index.html`);
});

// route to post like by user to db
app.post('/like', async (req, res) => {
  const { result, dogOwnerId, userId } = req.body;
  console.log('this is the request body in like route', req.body);
  // res.sendStatus(200);
  const newLike = await Likes.create({
    id_userB: dogOwnerId,
    id_userA: userId,
    result,
  });

  const likes = await Likes.findOne({
    where: {
      id_userA: dogOwnerId,
      id_userB: userId,
      result: true,
    },
  });

  if (likes !== null && result === true) {
    res.send(true);
    Matches.create({
      id_userA: userId,
      id_userB: dogOwnerId,
      result: true,
    });
  } else {
    res.send(false);
  }
});

/* ============================================================================ */

/* Starting server */
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
