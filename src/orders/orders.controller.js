const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

// List all the orders
function list(req, res) {
    res.json({ data: orders })
}

// Checks for valid order with specified properties inputed from the req body
function orderHasProperties(req, res, next) {
    const { data } = req.body 
    const requiredProperties = ['deliverTo', 'mobileNumber', 'dishes']    
    requiredProperties.forEach(property => {
        if (!data[property]) {
            next({
                status: 400,
                message: `Order must include a ${prop}`
            })
        }
        if (property === 'dishes') {
            // check if data['dishes'] is an array OR || if it has length > 0
            if (data[property].length === 0 || !Array.isArray(data[property])) {   
                next({
                    status: 400,
                    message: 'Order must include at least one dish'
                })
            }
            // check each dish for having a quantity
            data[property].forEach((dish, index) => {
                if (!dish['quantity'] || !Number.isInteger(dish['quantity']) || dish['quantity'] <= 0) {
                    next({
                        status: 400,
                        message: `Dish ${index} must have a quantity that is an integer greater than 0`
                    })
                }
            })
        }
    })
    next()
}

// Creates new order {} w/ID, then push into orders data
function create(req, res) {
    const { data: { deliverTo, mobileNumber, dishes, status } = {} } = req.body
    const order = {
        id: nextId,
        deliverTo, 
        mobileNumber, 
        status, 
        dishes,
    }
    orders.push(order)
    res.status(201).json({ data: order })
}

const foundOrder = (orderId) => {
    return orders.find(({id}) => id === orderId)
}

function orderExists(req, res, next) {
    const { orderId } = req.params
    const foundOrder = orders.find((order) => order.id == orderId)
    if (foundOrder) {
        res.locals.order = foundOrder
        next()
    }
        next({ 
            status: 404,
            message: `Order does not exist: ${orderId}.`,
        })
}

function read(req, res) {
    res.json({ data: res.locals.order })
}

function doesOrderMatchOrderId(req, res, next) {
    const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } = req.body
    const { orderId } = req.params
    if (!req.body.data.id || res.body.data.id === "") {
        next()
    } 
    if (req.body.data.id != res.locals.order.id) {
        next({
            status: 400,
            message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`,
        })
    }
    else {
        next()
    }
}

function checkOrderStatus(req, res, next) {
    const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } = req.body
    if (!status || status === "" || status === "invalid") {
        next({
            status: 400,
            message: "Order must have a status of pending, preparing, out-for-delivery, delivered",
        })
    }
    else if (status === "delivered") {
        next({
            status: 400,
            message: "A delivered order cannot be changed",
        })
    }
    else {
        next()
    }
}

function update(req, res, next) {
    const order = res.locals.order
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body

    order.id = res.locals.order.id
    order.deliverTo = deliverTo
    order.mobileNumber = mobileNumber
    order.status = status
    order.dishes = dishes   

    res.json({ data: order })
}

function statusIsPending(req, res, next) {
    const { status } = res.locals.order
    if (status !== "pending") {
        next({
            status: 400,
            message: "An order cannot be deleted unless it is pending.",
        })
    }
    next()
}

function destroy(req, res) {
    const { orderId } = req.params
    const orderIndexToDelete = orders.findIndex((order) => order.id === Number(orderId))
    const deletedOrders = orders.splice(orderIndexToDelete, 1)
    res.sendStatus(204)
}

module.exports = {
    list,
    create: [orderHasProperties, create,],
    read: [orderExists, read,],
    update: [orderExists, orderHasProperties, doesOrderMatchOrderId, checkOrderStatus, update,],
    destroy: [orderExists, statusIsPending, destroy]
}

/*
3.	In the src/orders/orders.controller.js file, add handlers 
and middleware functions to create, read, update, delete, 
and list orders.
*/