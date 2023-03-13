const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

// List all the orders
function listOrders(req, res) {
    res.json({ data: orders })
}

// Checks for valid order with specified properties inputed from the req body
function orderHasRequiredProperties(req, res, next) {
    const { data: { id, deliverTo, mobileNumber, status, dishes } = { } } = req.body;
    if ({ id, deliverTo, mobileNumber, status, dishes }) {
        return next()
    }
    next({
        status: 400, 
        message: "Order must include `${{ id, deliverTo, mobileNumber, status, dishes }}` properties.",
    })
}

function orderExists(req, res, next) {
    const { orderId } = req.params
    const foundOrder = orders.find(order => order.id === Number(orderId))
    if (foundOrder) {
        res.locals.order = foundOrder
        next()
    }
        next({ notFound })
}

/*
// Gets max ID from urls data
let lastDishId = orders.reduce((maxId, url) => Math.max(maxId, order.id), 0)
*/

// Creates new order {} w/ID, then push into orders data
function create(req, res) {
    const { data: { id, deliverTo, mobileNumber, status, dishes } = { } } = req.body
    const newDish = {
        id: nextId,
        deliverTo, 
        mobileNumber, 
        status, 
        dishes,
    }
    orders.push(newOrder)
    res.status(201).json({ data: newOrder })
}

function read(req, res) {
    const { orderId } = req.params
    const orderNeeded = foundOrder(orderId)
    res.json({ data: orderNeeded })
  }

function sendOrders(req, res) {
    const { orderToSend } = req.params
    const allOrders = orders.filter(order => order.orderId === Number(orderId))
    res.json( { data: allOrders })
}

function readOrderForOrderId(req, res) {
    const { orderId } = req.params
    const resultOrder = orders.filter(order => order.orderId === Number(orderId)).find(order => order.id === Number(orderId))
    res.json( { data: resultOrder })
}

function update(req, res) {
    const { orderId } = req.params
    const foundOrder = findOrder(orderId)
    const orderIndex = orders.findIndex((order) => order.id === Number(orderId))
    const { data: { id, deliverTo, mobileNumber, status, dishes } = { } } = req.body
    // Replace the old object at dishIndex
    orders.splice(orderIndex, 1, {
      data: {
          ...orders
        }
    });
    res.json({ data: order })
}

function deleteOrder(req, res) {
    const { orderId } = req.params
    const orderToDelete = orders.find(order => order.id === Number(orderId))
    if (orderToDelete) {
        orders = orders.filter(order => order.id !== id)
    } else {
        res.status(404).json({ message: "Order does not exist."})
    }
}


module.exports = {
    create: [orderHasRequiredProperties, create],
    listOrders,
    readOrder: [orderExists, sendOrders],
    readOrderForOrderId: [orderExists, readOrderForOrderId],
    read: [orderExists, read],
    update: [orderExists, orderHasRequiredProperties, update],
    orderExists,
    deleteOrder,
}

/*
3.	In the src/orders/orders.controller.js file, add handlers 
and middleware functions to create, read, update, delete, 
and list orders.
*/