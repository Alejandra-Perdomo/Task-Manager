//RUN npm run dev
//This file was excluded from project

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = 'mongodb://127.0.0.1:27017';
const database = 'task-manager';

const id = new ObjectId();
/* console.log(id);
console.log(id.getTimestamp()); */

const client = new MongoClient(uri,  {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
);

async function run() {
    try {
      // Connect the client to the server (optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");

      const db = client.db(database);

      //CREATING one doc in collection
      /* await db.collection('users').insertOne({
        user_name:'Sophia',
        age: 20
        }) */

        //CREATING multiple docs in collection 
       /*  try {
           await db.collection('tasks').insertMany( [
               { description: "Water the plants", completed: true },
               { description: "Feed the dogs", completed: false },
               { description: "Buy some milk", completed: false }
            ] );
         } catch (e) {
            console.log(e);
         } */

         //READING one doc in collection
        /* let found_doc = await db.collection('users').findOne({_id:new ObjectId('6442c1fafab6e34f0c0b46ef')});
 */
         //READING multiple docs in collection and returns a cursor.
         //If we want to get array then we must add .toArray() to convert cursor to array
         // .count() returns number of docs found by find()
        /* let found_docs = await db.collection('users').find({age:25}).toArray();
        let found_docs_count = await db.collection('users').find({age:25}).count();
        console.log(found_docs, found_docs_count);

        let task = await db.collection('tasks').findOne({_id: new ObjectId("6442c383f6a4f5e98255fae8")});
        console.log('Last task********************');
        console.log(task);
        let incomplete_tasks = await db.collection('tasks').find({completed:false}).toArray();
        console.log('Incomplete task***************');
        console.log(incomplete_tasks); */

        //UPDATING one doc in collection
        /* let update_return = await db.collection('users').updateOne({
          _id: new ObjectId("6442bd92d928220d785ecf39")
        },{
          $set:{
            user_name:'Michael'
          }
        })
        console.log(update_return);

        let update_returns = await db.collection('tasks').updateMany(
          {completed:'yes'},
          {
          $set:{
            completed:true
          }
        })

        console.log(update_returns); */

        //DELETING all docs with age value of 25
       /*  let delete_return = await db.collection('users').deleteMany({age:25});
        console.log(delete_return); */


      
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  
  run().catch(console.dir);