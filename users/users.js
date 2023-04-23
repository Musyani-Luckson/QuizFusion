import { hp } from '../helper/lib.js';
import { Stack } from '../src/DS.js';

const usersData = [
  {
    user: {
      id: 'EO771420',
      name: 'Mercury',
      fullName: '',
    },
    records: {
      maxHit: 468,
      maxMiss: 68,
      maxResponse: 527,
      maxNoResponse: 9,
      stars: 12,
      time: 120,
    },
    position: {
      rank: 2,
      points: 912,
      level: 3,
      difficulty: 'medium',
    }
  },
  {
    user: {
      id: 'QR911880',
      name: 'Venus',
      fullName: '',
    },
    records: {
      maxHit: 827,
      maxMiss: 367,
      maxResponse: 1782,
      maxNoResponse: 12,
      stars: 78,
      time: 190,
    },
    position: {
      rank: 1,
      points: 1752,
      level: 4,
      difficulty: 'hard',
    }
  },
  {
    user: {
      id: 'QN153080',
      name: 'Space walker',
      fullName: 'Jeffrey Preston Bezos',
    },
    records: {
      maxHit: 567,
      maxMiss: 117,
      maxResponse: 677,
      maxNoResponse: 7,
      stars: 12,
      time: 150,
    },
    position: {
      rank: 3,
      points: 1234,
      level: 2,
      difficulty: 'easy',
    }
  },
  {
    user: {
      id: 'JJ955420',
      name: 'Sanctum',
      fullName: 'Sven Magnus Øen Carlsen',
    },
    records: {
      maxHit: 422,
      maxMiss: 0,
      maxResponse: 140,
      maxNoResponse: 0,
      stars: 14,
      time: 200,
    },
    position: {
      rank: 5,
      points: 453,
      level: 1,
      difficulty: 'easy',
    }
  },
  {
    user: {
      id: 'MW315080',
      name: 'Neptune',
      fullName: 'Sundararajan Narayen',
    },
    records: {
      maxHit: 122,
      maxMiss: 4,
      maxResponse: 123,
      maxNoResponse: 3,
      stars: 8,
      time: 90,
    },
    position: {
      rank: 4,
      points: 356,
      level: 2,
      difficulty: 'easy',
    }
  },
  {
    user: {
      id: 'ZR793606',
      name: 'Ceres',
      fullName: 'Viswanathan Anand',
    },
    records: {
      maxHit: 118,
      maxMiss: 1,
      maxResponse: 118,
      maxNoResponse: 0,
      stars: 6,
      time: 60,
    },
    position: {
      rank: 6,
      points: 235,
      level: 1,
      difficulty: 'easy',
    }
  },
  {
    user: {
      id: 'KZ807120',
      name: 'Makemake',
      fullName: 'Melinda Brown',
    },
    records: {
      maxHit: 120,
      maxMiss: 3,
      maxResponse: 115,
      maxNoResponse: 2,
      stars: 10,
      time: 90,
    },
    position: {
      rank: 3,
      points: 207,
      level: 3,
      difficulty: 'medium',
    }
},
  {
    user: {
      id: 'LF106960',
      name: 'Nebula',
      fullName: 'Oliver Young',
    },
    records: {
      maxHit: 128,
      maxMiss: 1,
      maxResponse: 125,
      maxNoResponse: 0,
      stars: 16,
      time: 120,
    },
    position: {
      rank: 2,
      points: 201,
      level: 4,
      difficulty: 'hard',
    }
},
  {
    user: {
      id: 'HS503720',
      name: 'Jupiter',
      fullName: 'Nadia Patel',
    },
    records: {
      maxHit: 112,
      maxMiss: 4,
      maxResponse: 110,
      maxNoResponse: 1,
      stars: 8,
      time: 150,
    },
    position: {
      rank: 5,
      points: 200,
      level: 2,
      difficulty: 'easy',
    }
},
  {
    user: {
      id: 'FT406400',
      name: 'Nova',
      fullName: 'Andrew Rivera',
    },
    records: {
      maxHit: 708,
      maxMiss: 355,
      maxResponse: 1063,
      maxNoResponse: 3,
      stars: 18,
      time: 180,
    },
    position: {
      rank: 0,
      points: 1498,
      level: 6,
      difficulty: 'hard',
    }
},
  {
    user: {
      id: 'YC706420',
      name: 'Andromeda',
      fullName: 'Katie Lee',
    },
    records: {
      maxHit: 118,
      maxMiss: 2,
      maxResponse: 115,
      maxNoResponse: 2,
      stars: 12,
      time: 90,
    },
    position: {
      rank: 4,
      points: 197,
      level: 2,
      difficulty: 'easy',
    }
},
  {
    user: {
      id: 'RP404920',
      name: 'Comet',
      fullName: 'William Yang',
    },
    records: {
      maxHit: 122,
      maxMiss: 2,
      maxResponse: 120,
      maxNoResponse: 1,
      stars: 14,
      time: 120,
    },
    position: {
      rank: 3,
      points: 300,
      level: 4,
      difficulty: 'hard',
    }
},
  {
    user: {
      id: 'YC7064200',
      name: 'Pluto',
      fullName: 'Katie will',
    },
    records: {
      maxHit: 6,
      maxMiss: 28,
      maxResponse: 22,
      maxNoResponse: 4,
      stars: 12,
      time: 90,
    },
    position: {
      rank: 4,
      points: -13,
      level: 2,
      difficulty: 'easy',
    }
},
  {
    user: {
      id: 'RP404927',
      name: 'Uranus',
      fullName: 'William Ast',
    },
    records: {
      maxHit: 0,
      maxMiss: 0,
      maxResponse: 0,
      maxNoResponse: 0,
      stars: 0,
      time: 0,
    },
    position: {
      rank: 0,
      points: 0,
      level: 1,
      difficulty: 'easy',
    }
}
];

// Define a class called Users
export class Users {
  // Constructor initializes an empty users array
  constructor(users) {
    this.users = [];
  }
}


// Add a stack method to the Users prototype
Users.prototype.stack = function(users) {
  // Create a new Stack object
  let stack = new Stack();
  // Add each user in the input array to the stack
  users.map((user) => {
    stack.push(user);
  });
  // Set the users array to the stack
  this.users = stack;
};

// Add an addUser method to the Users prototype
Users.prototype.addUser = function(user, storage = localStorage) {

  this.users.push(user);

  hp.browserStorageUse(
    "post",
    "USERS",
    storage,
    user
  );

  let userRecordDB = hp.browserStorageUse(
    "get",
    "userRecords",
    storage,
  );

  hp.browserStorageUse(
    'delete',
    'userRecords',
    storage
  )
  let dr = dataRecord(usersData);

  let usersObj

  if (userRecordDB[0] !== undefined && userRecordDB[0] !== null) {
    usersObj = userRecordDB[0]
  } else {
    usersObj = {}
  }
  usersObj[user.username] = {
    user: {
      id: user.userId,
      name: user.username,
      fullName: user.fullname,
    },
    records: {
      maxHit: 0,
      maxMiss: 0,
      maxResponse: 0,
      maxNoResponse: 0,
      stars: 0,
      time: 0,
    },
    position: {
      rank: 0,
      points: 0,
      level: 1,
      difficulty: 'easy',
    }
  }

  hp.browserStorageUse(
    "post",
    "userRecords",
    storage,
    Object.assign({}, usersObj, dataRecord(usersData))
  );
  let db = hp.browserStorageUse(
    "get",
    "userRecords",
    storage,
  );
};
// Add a findUser method to the Users prototype
Users.prototype.findUser = function(loggingUser, action) {
  let users = {},
    userExist
  this.users.map((user) => {
    users[user.username] = user;
  })
  if (users[loggingUser.username]) {
    switch (action) {
      case 'login':
        if (users[loggingUser.username].username === loggingUser.username && users[loggingUser.username].password === loggingUser.password) {
          userExist = {
            isExist: true,
            userId: users[loggingUser.username].userId,
            username: users[loggingUser.username].username,
          }
        }
        else {
          userExist = {
            isExist: false,
          }
        }
        break
      case 'create':
        userExist = {
          isExist: true,
        }
        break
    }
  } else {
    switch (action) {
      case 'login':
        userExist = {
          isExist: false,
        };
        break
      case 'create':
        userExist = {
          isExist: false,
        }
        break
    }
  }
  return userExist;
}

// Add a userId method to the Users prototype
Users.prototype.userId = function() {
  let usersIds = [];
  let newId = ``;
  if (this.users.size() > 0) {
    // If there are users in the array, generate a new ID
    newId = hp.idGenerator();
    // Add all existing user IDs to an array
    this.users.toArray().filter((user) => {
      usersIds.push(user.userId);
    });
    // Check if the new ID is already in use
    if (!usersIds.includes(newId)) {
      // If not, return the new ID
      newId = newId;
      return newId;
    } else {
      // If it is, generate a new ID recursively
      this.userId();
    }
  } else {
    // If there are no users in the array, generate a new ID
    newId = hp.idGenerator();
    return newId;
  }

}



function dataRecord(data) {
  let dataRecords = {}
  for (let item of data) {
    dataRecords[item.user.name] = item
  }
  return dataRecords
}