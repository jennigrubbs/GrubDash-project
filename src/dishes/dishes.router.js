const router = require("express").Router();

// TODO: Implement the /dishes routes needed to make the tests pass

const controller = require("../dishes/dishes.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")
const errorHandler = require("../errors/errorHandler")
const notFound = require("../errors/notFound")
const ordersRouter = require("../orders/orders.router")

router.dish("/:dishId/dishes", controller.dishExists, dishes.router)

router
    .route("/dishes")
    .post(controller.create)
    .get(controller.list)
    .all(methodNotAllowed)

router
    .route("/dishes/:dishId")
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed)

module.exports = router;


/*
2.	In the src/dishes/dishes.router.js file, add two routes: 
/dishes, and /dishes/:dishId and attach the handlers 
(create, read, update, and list) exported from 
src/dishes/dishes.controller.js.
*/