const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

// List all the dishes
function listDishes(req, res) {
    res.json({ data: dishes })
}

// Checks for valid dish with specified properties inputed from the req body
function dishHasRequiredProperties(req, res, next) {
    const { data: { id, name, description, price, image_url } = { } } = req.body;
    if ({ id, name, description, price, image_url }) {
        return next()
    }
    next({
        status: 400, 
        message: "Dish must include `${{ id, name, description, price, image_url }}` properties.",
    })
}

function dishExists(req, res, next) {
    const { dishId } = req.params
    const foundDish = dishes.find(dish => dish.id === Number(dishId))
    if (foundDish) {
        res.locals.dish = foundDish
        next()
    }
        next({ notFound })
}

/*
// Gets max ID from urls data
let lastDishId = dishes.reduce((maxId, url) => Math.max(maxId, url.id), 0)
*/

// Creates new dish {} w/ID, then push into dishes data
function create(req, res) {
    const { data: { id, name, description, price, image_url } = { } } = req.body
    const newDish = {
        id: nextId,
        name, 
        description, 
        price, 
        image_url,
    }
    dishes.push(newDish)
    res.status(201).json({ data: newDish })
}

function read(req, res) {
    const { dishId } = req.params
    const dishNeeded = foundDish(dishId)
    res.json({ data: dishNeeded })
  }

function sendDishes(req, res) {
    const { dishToSend } = req.params
    const allDishes = dishes.filter(dish => dish.dishId === Number(dishId))
    res.json( { data: allDishes })
}

function readDishForDishId(req, res) {
    const { dishId } = req.params
    const resultDish = dishes.filter(dish => dish.dishId === Number(dishId)).find(dish => dish.id === Number(dishId))
    res.json( { data: resultDish })
}

function update(req, res) {
    const { dishId } = req.params
    const foundDish = findDish(dishId)
    const dishIndex = dishes.findIndex((dish) => dish.id === Number(dishId))
    const { data: { id, name, description, price, image_url } = { } } = req.body
    // Replace the old object at dishIndex
    dishes.splice(dishIndex, 1, {
      data: {
          ...dish
        }
    });
    res.json({ data: dish })
}


module.exports = {
    create: [dishHasRequiredProperties, create],
    listDishes,
    readDish: [dishExists, sendDishes],
    readDishForDishId: [dishExists, readDishForDishId],
    read: [dishExists, read],
    update: [dishExists, dishHasRequiredProperties, update],
    dishExists,
}

/*
1.	In the src/dishes/dishes.controller.js file, add handlers 
and middleware functions to create, read, update, and list dishes. 
Note that dishes cannot be deleted.
*/