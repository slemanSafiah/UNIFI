const router = require("express").Router();
const todoController = require("../controller/todo.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, todoController.addTodo);
router.post("/:id", auth, todoController.updateTodo);
router.delete("/:id", auth, todoController.deleteTodo);
router.get("/:id", auth, todoController.getTodo);
router.get("/", auth, todoController.getAllTodos);

module.exports = router;
