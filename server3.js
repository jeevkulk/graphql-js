var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
	type RandomDie {
		numSides: Int!
		rollOnce: Int!
		roll(numRolls: Int!): [Int]
	}

	type Query {
	  numSides (numSides: Int) : Int!
	  getDie(numSides: Int): RandomDie
	}
`);

// The root provides a resolver function for each API endpoint
class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({numRolls}) {
    var output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

var root = {
  numSides: function({numSides}) {
    return numSides;
  },
  getDie: function ({numSides}) {
    return new RandomDie(numSides || 6);
  }
}

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');




// Query
/*
{
  numSides(numSides: 6)
  getDie(numSides: 6) {
    rollOnce
    roll(numRolls: 3)
  }
}
*/