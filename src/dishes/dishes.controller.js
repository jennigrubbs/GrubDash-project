const path = require("path");

// Use the existing dishes data
//create, read, update, and list dishes. Note that dishes cannot be deleted.
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// GET /dishes - This route will list all the existing dish data in the response.

function list (req, res) {
    res.json({ data: dishes });
}

// POST /dishes - This route will save the dish and have the newly created dish in the response.

// Check for valid dish with specified properties inputed from the req body

const checkRequiredProperties = (req, res, next) => {
    const { data } = req.body;
    const requiredProps = ['name', 'description', 'price', 'image_url'];
    requiredProps.forEach(prop => {
        if (!data[prop]) {
        next({
            status: 400, 
            message: `Dish must include a ${prop}`
        });
        }
        if (prop === 'price') {
            if (!Number.isInteger(data['price']) || data['price'] <= 0)
                next({
                    status: 400, 
                    message: `Dish must have a price with an integer greater than 0`
            });
        }
    });
    next();
}

// Check if the dishId exists

function dishIdExists(req, res, next) {
    const { dishId } = req.params;
     const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        res.locals.dish = foundDish;
        next();
    }
    next({
        status: 404, 
        message: `Dish does not exist: ${dishId}.`,
    })
}

// Check if id info all matches

const doesIdMatchDishId = (req, res, next) => {
    const { dishId } = req.params;
    const { data: { id } = {} } = req.body;
    if (id && id !== dishId) {
        next({
            status: 400, 
            message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
        })
    }
    next();
}

function read(req, res) {
    res.json({data:res.locals.dish});
}

// Update a dish and its properties

function update(req, res, next) {
    const dish = res.locals.dish;
    const { data: { name, description, price, image_url } = {} } = req.body;

    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;

    res.json({ data: dish });
}

// Creates new dish {} w/ID, then push into dishes data

function create(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: nextId(), 
        name, 
        description, 
        price, 
        image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

module.exports = {
    list,
    read: [
      dishIdExists, 
      read
    ],
    update: [
      dishIdExists, 
      checkRequiredProperties, 
      doesIdMatchDishId, 
      update
    ],
    create: [
        checkRequiredProperties,
        create
    ]
}

/*
1.	In the src/dishes/dishes.controller.js file, add handlers 
and middleware functions to create, read, update, and list dishes. 
Note that dishes cannot be deleted.
*/