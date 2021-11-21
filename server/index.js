const express = require('express')
const path  =require('path')
const hbs = require('hbs')
const http = require('http')
const socketio = require('socket.io')
const firebase = require('firebase')
require('firebase/database')

const app = express()
const server = http.createServer(app)


const io = socketio(server)
const PORT = process.env.PORT || 5000
app.use(express.json())
const pathdirectories = path.join(__dirname , "../public")
app.use(express.static(pathdirectories))
app.set('view engine', 'hbs')

const temppath = path.join(__dirname , "../templates/views")
app.set('views',temppath)

app.get('',(req,res)=>
{
    res.render('index')
})

//////firebase connections





  // var firebaseConfig = {

  // };
  // // Initialize Firebase
  // firebase.initializeApp(firebaseConfig);
  // const database = firebase.firestore();

////////



////socket part

io.on('connection',(socket)=>{
    console.log('New Connection')

    socket.on('joinroom',(roomname,name,is_created)=>{
        console.log("room "+roomname+" joined")
        socket.join(roomname);
        

        if(is_created == 1)
        {
          // database.collection('real-time-info').doc('online-rooms').set({
          //   [roomname] :{ members : [name] , admin : name}
          // })
          
           io.in(roomname).emit('newbie',name);
        }
        else{
          // database.collection('real-time-info').doc('online-rooms/'+roomname+"/members").get().then((doc)=>{
          //   if(doc){
          //     console.log(doc)
          //   }
          //   else console.log("not found")

          // })

          
          // database.collection('real-time-info').doc('online-rooms').update({
          //   roomname :{ members : [name] , admin : name}
          // })
          io.in(roomname).emit('admin_here_me',name);
        }
        
    })
    
    socket.on('new_mem_from_admin',(roomname,array)=>{
      
      console.log("sample array  :::=> "+array)
      
      socket.to(roomname).emit('newbie',array);
    })
    


    socket.on('tic-tac-toe-listen-to-move',(pos,value,chance,room)=>{
       io.in(room).emit('tic-tac-toe-move',pos,value,chance)
    })

    socket.on('distribute-quiz-question',(res,room)=>{
      console.log(res)
      io.in(room).emit('take-quiz-question',res)
    })

    socket.on('here-quiz-answer',(roomname,name,score)=>{
      io.in(roomname).emit('listen-answer',name,score);
    })

    socket.on('quiz-event',(roomname,caseCode)=>{
      io.in(roomname).emit('quiz-event-callback',caseCode);
    })
})


server.listen(PORT,()=>{
    console.log("listning on "+PORT)
})