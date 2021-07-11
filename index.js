const express = require("express");
const app  = express();
const MongoClient = require('mongodb').MongoClient;
const path = require("path")
const fs = require("fs")
const bodyParser = require('body-parser');
const cors = require('cors');

 app.use(bodyParser.json())
 app.use(cors())



app.use(express.json())

const http = require('http');
const port = process.env.PORT || 3000;;
const server = http.createServer(app);


app.use(function(request, response, next){
  console.log("In comes a " + request.method + " Request to: " + request.url);
  next();
});

app.use(function(req, res, next){
  var filePath = path.join(__dirname, "static", req.url)
  fs.stat(filePath, function(err, fileInfo){
      if(err){
          next();
          return;
      }
      if(fileInfo.isFile()) res.sendFile(filePath)
      else next()
  });
});

// app.use(function(req, res){
//   res.status(404)
//   res.send('File not found')
// })


// Connect to MongoDb Atlas

 let db;
 //let user;
  MongoClient.connect('mongodb+srv://anu:kntjf04mwl06@cluster0.rpda3.mongodb.net/Fixit?retryWrites=true&w=majority', (err, client) => {
      db = client.db('Fixit');
 })

 

 // Get the collection Name 
 app.param('collectionName', (req, res, next, collectionName)=>{
     req.collection = db.collection(collectionName)
     
     return next();
 })
 
 // Display Message for the root path to show the API is working
 app.get('/', (req, res) =>{
     res.send('Welcome To FixitNG API 👋, Please select a collection to continue');
 })

 //Retrieve all the objects from a collection within MongoDB
 app.get('/collection/:collectionName', (req, res) =>{
     req.collection.find({}).toArray((e, results) => {
         if (e) return next(e)
         res.setHeader('Access-Control-Allow-Origin', '*');
         res.writeHead(200, {'Content-Type': 'text/plain'});
         res.end(JSON.stringify(results));
         
     })
 })

 //Retrieve a single object from repairs within MongoDB
 app.get('/collection/repairs/:id', (req, res) =>{
  db.collection('repairs').find({Uid: req.params.id}).toArray((e, results) => {
    if (e) return next(e)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(JSON.stringify(results));
  })
})

//Retrieve a single object from diagnosis within MongoDB
 app.get('/collection/diagnosis/:id', (req, res) =>{
  db.collection('diagnosis').find({Uid: req.params.id}).toArray((e, results) => {
    if (e) return next(e)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(JSON.stringify(results));
  })
})

 //Retrieve a single object from a collection within MongoDB
 app.get('/collection/:collectionName/:id', (req, res) =>{
  req.collection.find({ id: req.params.id}).next((e, results) => {
    if (e) return next(e)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(JSON.stringify(results));
  })
})

//Delete a single object from repairs within MongoDB
 app.delete('/collection/repairs/:Rid', (req, res) =>{
  db.collection('repairs').findOneAndDelete({RepairID: req.params.Rid})
})

//Delete a single object from repairs within MongoDB
 app.delete('/collection/diagnosis/:Did', (req, res) =>{
  db.collection('diagnosis').findOneAndDelete({DiagnosisID: req.params.Did})
})




//Add an object to Mongodb
app.post('/collection/:collectionName', (req,res,next) => {
 try{ req.collection.insert(req.body, (e, results) => {
      if (e) return next (e)
      res.send(results.ops)
  })
} catch(error){
  res.status(500).json({message:"Error Message"})
  console.log(error);
}
})


// app.put('/collection/:collectionName', (req,res,next) => {
//     req.collection.bulkWrite(
//         req.body.map(lesson => {
//             return {
//                 updateMany : {
//                     filter : {
//                         id:lesson.id
//                     },
//                     update : {
//                         $set:{
//                             id:lesson.id, 
//                             subject:lesson.subject,
//                             location:lesson.location,
//                             price:lesson.price,
//                             availablespace:lesson.availablespace,
//                             rating:lesson.rating,
//                         }
//                     }
//                 }
//             }
//         })
//     )
// res.status(202).send();

//    })


server.listen(port);
console.log('Sever Is Now Running On Port 3000');

