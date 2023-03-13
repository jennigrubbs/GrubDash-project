const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

// List all the dishes
function list(req, res) {
    res.json({ data: dishes })
}

// Checks for valid dish with specified properties inputed from the req body
function dishHasProperties(req, res, next) {
    const { data } = req.body;
    const requiredProperties = ['name', 'description', 'price', 'image_url']
    requiredProperties.forEach(property => {
        if (!data[property]) {
            next({
                status: 400,
                message: `Dish must include a ${property}`
            })
        }
        if (property === 'price') {
            if (!Number.isInteger(data['price']) || data['price'] <= 0)
            next({
                status: 400,
                message: `Dish must have a price that is an integer greater than 0`
            })
        }
    })
    return next()
}

const findDishId = (dishId) => {
    return dishes.find(({id}) => id === dishId)
}

function dishIdExists(req, res, next) {
    const { dishId } = req.params
    const foundDish = dishes.find((dish) => dish.id === dishId)
    if (foundDish) {
        res.locals.dish = foundDish
        next()
    }
        next({ 
            status: 404,
            message: `Dish does not exist: ${dishId}.`,
        })
}

const doesIdMatchDishId = (req, res, next) => {
    const { dishId } = req.params
    const { data: { id } = {} } = req.body
    if (id && id !== dishId) {
        next({
            status: 400,
            message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
        })
    }
    next()
}

function read(req, res) {
    res.json({ data: res.locals.dish })
}

function update(req, res, next) {
    const dish = res.locals.dish
    const { data: { name, description, price, image_url } = {} } = req.body    
    
    dish.name = name
    dish.descriptipon = description
    dish.price = price
    dish.image_url = image_url

    res.json({ data: dish })
}

// Creates new dish {} w/ID, then push into dishes data
function create(req, res) {
    const { data: { name, description, price, image_url } = { } } = req.body
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

module.exports = {
    list,
    read: [dishIdExists, read],
    update: [dishIdExists, dishHasProperties, doesIdMatchDishId, update],
    create: [dishHasProperties, create],
}

/*
1.	In the src/dishes/dishes.controller.js file, add handlers 
and middleware functions to create, read, update, and list dishes. 
Note that dishes cannot be deleted.
*/