const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const schema = require('./schema/schema')
 
const app = express();
const port = 4000

const cors = require('cors')

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://tienkim9920:U4tQMg6Wfy8DaL@cluster0.hlyqt.mongodb.net/Library?retryWrites=true&w=majority", {
  useFindAndModify: false,
  useCreateIndex: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors())
 
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
  }),
);
 
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
});