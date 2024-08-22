const express = require ('express');
const app = express ();
app.use (express.json ());
const cors = require ('cors');
const zod = require ('zod');
const {User} = require ('./db/db');
const jwt = require ('jsonwebtoken');
const dotenv = require ('dotenv');
// const {authMiddleware} = require ('./authMiddleware');
const ws=require('ws');
const { authMiddleware } = require('./Middleware/authMiddleware');
dotenv.config ();

const JWT_SECRET = process.env.JWT_SECRET;

app.use (
  cors ({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: 'Authorization, token, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  })
);

const signUpSchema = zod.object ({
  email: zod.string (),
  username: zod.string (),
  password: zod.string (),
});
const signinBody = zod.object ({
  email: zod.string (),
  password: zod.string (),
});

app.get ('/', (req, res) => {
  res.json ({
    message: 'hello',
  });
});
app.post ('/signup', async (req, res) => {
  
  try {
    const body = req.body;
    const {success} = signUpSchema.safeParse (req.body);
    if (!success) {
      return res.status (400).json ({
        message: 'Email already taken/ Incorrect inputs',
      });
    }
    const user = await User.findOne ({
      email: body.email,
      username: body.username,
    });

    if (user) {
      return res.status (400).json ({
        message: 'Email already taken/ Incorrect inputs',
      });
    }
    const dbUser = await User.create (body);
   
    const token = jwt.sign (
      {
        userId: dbUser._id,
        username:dbUser.username
      },
      JWT_SECRET
    );
    res.json ({
      message: 'User created successfully',
      token: token,
      userId:dbUser._id,
      username:dbUser.username
    });
  } catch (error) {
    console.log (error);
    res.status (504).json ({
      message: `Email or Username already taken try again with different credential or it can be database error Please contact Zaid`,
    });
  }
});

app.post ('/signIn', async (req, res) => {
  try {
    const {success} = signinBody.safeParse (req.body);
    if (!success) {
      return res.status (400).json ({
        message: 'Incorrect inputs',
      });
    }
    const user = await User.findOne ({
      email: req.body.email,
      password: req.body.password,
    });

    if (user) {
      const token = jwt.sign (
        {
          userId: user._id,
          username:user.username
        },
        JWT_SECRET
      );

      res.json ({
        message: 'Signed In successfully',
        token: token,
        userId:user._id,
        username:user.username
      });
      return;
    }
    res.status (401).json ({
      message: 'Wrong Credentials',
    });
  } catch (error) {
    res.status (504).json ({
      message: `${error} Database error Please contact Zaid`,
    });
  }
});
app.get('/profile',authMiddleware,async(req,res)=>{
  try {
    const userId = req.userId;
    const user = await User.findOne ({
      _id: userId,
    });
    if (user) {
      res.json ({
        message: 'OK',
        userId,
        username:user.username
      });
    } else {
      res.status(401).json ({
        message: 'User Unauthorized',
      });
    }
  } catch (error) {
    res.status(504).json ({
      message: `${error} Database error Please contact Zaid`
    });
  }

})

const server=app.listen (3000, () => {
  console.log ('Server is running at port 3000');
});
const wss=new ws.WebSocketServer({server})
const clients=new Map()
wss.on('connection',(connection,req)=>{
  function notifyAboutOnlinePeople(){
    [...wss.clients].forEach(client=>{
      client.send (JSON.stringify({online:[...wss.clients].map (c => ({userId:c.userId,username:c.username}))}))
    });
    [...wss.clients].forEach(client=>{
      console.log(client.username)
    })
  }
  const params = new URLSearchParams (req.url.replace ('/?', ''));
  const token = params.get ('token');
  // console.log('token is:',token)
  if(token){
    jwt.verify(token,JWT_SECRET,{},(err,userData)=>{
      if(err){
        throw new err
      }
      connection.userId=userData.userId
      connection.username=userData.username
      if (clients.has(userData.userId)) {
        clients.get(userData.userId).terminate ();
      }
      clients.set (userData.userId, connection);
    })
    notifyAboutOnlinePeople()
  }
  connection.on('message',async(message)=>{
    console.log('In message')
    const messageData=JSON.parse(message)
    console.log ('message is:', messageData);
    // console.log('message is:',messageData.message.userId);
    if('message' in messageData){
      [...wss.clients].forEach(client=>{
        client.send(JSON.stringify({
        request:{
          username:messageData.message.username,
          userId:messageData.message.userId,
          requestedId:connection.userId
        }
      }))
      })
    }
    if('accepted' in messageData){
      [...wss.clients].forEach(client=>{
        client.send(JSON.stringify({
        accept:{
          userId:messageData.userId,
          requestedId:connection.userId,
          requestedUsername:connection.username
        }
      }))
      })
    }
    if('rejected' in messageData){
      console.log('rejected username is:',messageData.username);
      [...wss.clients].forEach (client => {
      client.send (
        JSON.stringify ({
          rejected: {
            username: messageData.username,
            userId:messageData.userId
          },
        })
      );
      });

    }
    if('boardState' in messageData){
      console.log('board in backend is:',messageData.boardState.board);
      [...wss.clients].forEach(client=>{
        client.send(JSON.stringify({
        boardState:{
          board:messageData.boardState.board,
          playerId:messageData.boardState.playerId,
          userId:messageData.boardState.userId,
        }
      }))
      })
    }
    // if('winnerId' in messageData){
    //   console.log('In winner');
    //   [...wss.clients].forEach(client=>{
    //     client.send(JSON.stringify({
    //     winnerId:messageData.winnerId,
    //     winnerName:messageData.winnerName
    //   }))
    //   })

    // }
    if('isPlaying' in messageData){
      console.log('Lobby id:',messageData.loserId);
      [...wss.clients].forEach(client=>{
        client.send(JSON.stringify({
        loserId:messageData.loserId,
        isPlaying:false
      }))
      })
    }
    
  })

})

