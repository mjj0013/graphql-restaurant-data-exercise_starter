var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType, isRequiredInputField } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
  id: Int
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant: ({id}) => {
    // Your code goes here
    var item=null;
    for(let i=0; i < restaurants.length; ++i) {
      if(restaurants[i].id == id) {
        item = restaurants[i];
        break;
      }
    }
    if(item==null) throw new Error("restaurant doesn't exist");
    else return item;
  },
  restaurants: () => {
    // Your code goes here
    return restaurants
  },
  setrestaurant: ({ input }) => {
    // Your code goes here
    restaurants.push({id:input.id, name:input.name, description:input.description, dishes:input.dishes})
    return restaurants[restaurants.length-1]
  },
  deleterestaurant: ({ id }) => {
    // Your code goes here
    const ok = Boolean(restaurants[id]);
    var delc = restaurants[id];
    restaurants = restaurants.filter(item=> item.id!==id)
    console.log(JSON.stringify(delc));
    return {ok}

  },
  editrestaurant: ({ id, ...restaurant }) => {
    // Your code goes here
    
    var item=null;
    for(let i=0; i < restaurants.length; ++i) {
      if(restaurants[i].id == id) {
        item=restaurants[i];
        restaurants[i] = {...restaurants[i], ...restaurant};
        break;
      }
    }
    if(item==null) throw new Error("restaurant doesn't exist"); 
    else return item;
    
    
  },
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

// export default root;
