const router = require("express").Router();
const controller = require("../dishes/dishes.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")

// TODO: Implement the /dishes routes needed to make the tests pass

router
    .route("/")
    .get(controller.list)
    .post(controller.create);

router
    .route("/:dishId")
    .get(controller.read)
    .put(controller.update)
    .delete(methodNotAllowed);


module.exports = router;


/*
2.	In the src/dishes/dishes.router.js file, add two routes: 
/dishes, and /dishes/:dishId and attach the handlers 
(create, read, update, and list) exported from 
src/dishes/dishes.controller.js.
*/