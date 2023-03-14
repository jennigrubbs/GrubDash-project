const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// List all the orders

function list (req, res) {
  res.json({ data: orders });
}

// Check for valid order with specified properties inputed from the req body

const orderHasProperties = (req, res, next) => {
    const { data } = req.body;
    const requiredProperties = ['deliverTo', 'mobileNumber', 'dishes'];
    requiredProperties.forEach(property => {
        if (!data[property]) {
            next({
                status: 400, 
                message: `Order must include a ${property}`
            });
        }
        if (property === 'dishes') {
            // Check if data['dishes'] is an array OR || if it has length > 0 
            if (data[property].length === 0 || !Array.isArray(data[property])) {
                next({
                    status: 400, 
                    message: 'Order must include at least one dish'
                });
            }
            // Check each dish for having a quantity
            data[property].forEach((dish, index) => {
                if (!dish['quantity'] || !Number.isInteger(dish['quantity']) || dish['quantity'] <= 0) {
                    next({
                        status: 400, 
                        message: `Dish ${index} must have a quantity that is an integer greater than 0`
                    });
                }
            })
        }
    })
    next();
}

// Create new order {} w/ID, then push it into orders data

function create(req, res) {
    const { data: { deliverTo, mobileNumber, dishes, status } = {} } = req.body;
    const order = {
        id: nextId(), 
        deliverTo, 
        mobileNumber, 
        status, 
        dishes
    };
    orders.push(order);
    res.status(201).json({ data: order });
}

// Check if a specific order ID exists

function orderIdExists(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id == orderId);
    if (foundOrder) {
        res.locals.order = foundOrder;
        next();
    }
    next({
        status: 404, 
        message: `Order does not exist: ${orderId}.`,
    })
}

function read(req, res) {
     res.json({data:res.locals.order});
}

function validateId(req, res, next) {
    const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    const { orderId } = req.params;
    if (!req.body.data.id || req.body.data.id === "") {
        next();
    }
    if (req.body.data.id != res.locals.order.id) {
        next({
            status: 400,
            message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`,
        })
    }
        else {
            next();
    }
  
}

function validateStatus(req, res, next) {
    const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    if (!status || status === "" || status === "invalid") {
        next({
            status: 400,
            message: "Order must have a status of pending, preparing, out-for-delivery, delivered",
        });
    }
    else if (status === "delivered") {
        next({
            status: 400,
            message: "A delivered order cannot be changed",
      })
    }
    else {
        next();
    }
}


function update(req, res, next) {
    const order = res.locals.order;
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    
    order.id = res.locals.order.id;
    order.deliverTo = deliverTo;
    order.mobileNumber = mobileNumber;
    order.status = status;
    order.dishes = dishes;

    res.json({ data: order });
}

function orderIsPending(req, res, next) {
    const { status } = res.locals.order;
    if (status !== "pending") {
        next({
            status: 400, 
            message: "An order cannot be deleted unless it is pending.",
        })
    }
    next();
}

function destroy(req, res) {
    const { orderId } = req.params;
    const index = orders.findIndex((order) => order.id === Number(orderId));
    const deletedOrders = orders.splice(index, 1);
        // Using splice() as above returns an array of deleted elements, even if it is one element
    res.sendStatus(204);
}

module.exports = {
    list,
    create: [
        orderHasProperties,
        create,
    ],
    read: [
        orderIdExists, 
        read,
    ],
    update: [
        orderIdExists, 
        orderHasProperties, 
        validateId, 
        validateStatus, 
        update],
    destroy: [
        orderIdExists, 
        orderIsPending,
        destroy,
    ]
}

/*
3.	In the src/orders/orders.controller.js file, add handlers 
and middleware functions to create, read, update, delete, 
and list orders.
*/