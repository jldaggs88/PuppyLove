require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const { generate } = require('../../generateDogs');

const {
  DB_HOST,
  DB_USER,
  DB_NAME,
} = process.env;

const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  '',
  {
    host: DB_HOST,
    dialect: 'mysql',
    define: {
      timestamps: false,
    },
  },
);

sequelize.authenticate()
  .then(() => {
    console.log('Connection to db completed')
    generate(); // Generates new dogs from the generateDogs.js script
  })
  .catch((err) => console.error('Oopsies there is an error: ', err));

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: null,
  },
  cell: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.DECIMAL,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.DECIMAL,
    allowNull: true,
  },
  home_town: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Dog = sequelize.define('Dog', {
  dog_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weight: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fixed: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_user: {
    type: DataTypes.STRING,
    references: {
      model: 'user',
      key: 'id',
    },
    allowNull: false,
  },
});

const Location = sequelize.define('Location', {
  location_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const FriendJoint = sequelize.define('FriendJoint', {
  id_dog: {
    type: DataTypes.INTEGER,
    references: {
      model: 'dog',
      key: 'id',
    },
    allowNull: false,
  },
  id_dogFriend: {
    type: DataTypes.INTEGER,
    references: {
      model: 'dog',
      key: 'id',
    },
    allowNull: false,
  },
  bool_friend: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
}, {
  tableName: 'Friend_joint',
});

// define Matches table model
const Matches = sequelize.define('Matches', {
  id_userA: {
    type: Sequelize.INTEGER,
    references: {
      model: 'User',
      referencesKey: 'id',
    },
  },
  id_userB: {
    type: Sequelize.INTEGER,
    references: {
      model: 'User',
      referencesKey: 'id',
    },
  },
  result: Sequelize.BOOLEAN,
});

// define Like table model
const Likes = sequelize.define('Likes', {
  id_userA: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Matches',
      referencesKey: 'id_userA',
    },
  },
  id_userB: {
    type: Sequelize.INTEGER,
    references: 'Matches',
    referencesKey: 'id_userB',
  },
  result: Sequelize.BOOLEAN,
});

// added matches and like to be routed
module.exports = {
  Sequelize,
  User,
  Dog,
  Location,
  FriendJoint,
  Matches,
  Likes,
};
