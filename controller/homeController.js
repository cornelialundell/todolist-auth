const TodoTask = require("../model/todoTasks.js");
const token = require("../middleware/verifyUser");
let isSorted = false;
let typeOfSort = "date";
let displayNone = "";
let oldestFirst = ""
let newestFirst = ""
let alphabeticAz = ""
let alphabeticZa = ""

const homeRender = async (req, res) => {

  let cookie = req.cookies.jwtToken
  let sorted = +req.query.sorted || 1;
  let page = +req.query.page || 1;
  console.log(req.user.user)
  const allTodos = await TodoTask.find({
    userid: req.user.user._id,
  }).countDocuments();
  const todosPerPage = 4;
  const totalPages = Math.ceil(allTodos / todosPerPage);
  const todosToShow = todosPerPage * page;
  await TodoTask.find({ userid: req.user.user._id})
    .limit(todosToShow)
    .sort([[typeOfSort, sorted]])
    .exec(function (err, tasks) {
      console.log(req.user.user)
      res.render("home.ejs", {
        user: req.user.user,
        sorted,
        page,
        allTodos,
        totalPages,
        todosToShow,
        todosPerPage,
        todoTasks: tasks,
        displayNone,
        oldestFirst,
        newestFirst,
        alphabeticAz,
        alphabeticZa
      });
    });
  let sortList = req.query.sorted;
  if (sortList) {
    isSorted = true;
  }
  if (allTodos === 0) {
    isSorted = false;
  }
  if (allTodos <= 4) {
    displayNone = "display-none";
  }
  if (allTodos > 4) {
    displayNone = "";
  }
};

const addTodo = async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = req.query.page;
  const todoTask = new TodoTask({
    content: req.body.content,
    userid: req.user.user._id,
  });
  try {
    await todoTask.save();
    res.redirect("/?page=" + page + "&&sorted=" + sorted);
  } catch (err) {
    res.redirect("/");
  }
};

const removeTodo = async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = +req.query.page;
  await TodoTask.deleteOne({ _id: req.params.id });
  let dataLength = await TodoTask.find({
    userid: req.user.user._id,
  }).countDocuments();
  if (dataLength <= 4) {
    res.redirect("/?page=" + 1 + "&&sorted=" + sorted);
  }
  if (dataLength > 4 && dataLength % 4 >= 1) {
    res.redirect("/?page=" + page + "&&sorted=" + sorted);
  }
  if (dataLength > 4 && dataLength % 4 === 0) {
    res.redirect("/?page=" + (page - 1) + "&&sorted=" + sorted);
  }
};

const editTodo = async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = +req.query.page;
  const id = req.params.id;
  const todosPerPage = 4;
  const todosToShow = todosPerPage * page;
  await TodoTask.find({ userid: req.user.user._id })
    .limit(todosToShow)
    .sort([[typeOfSort, sorted]])
    .exec(function (err, tasks) {
      res.render("editTodo.ejs", {
        todoTasks: tasks,
        idTask: id,
        page,
        sorted,
      });
    });
};

const editSubmit = async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = +req.query.page;
  const id = req.params.id;
  await TodoTask.findByIdAndUpdate(id, {
    content: req.body.content,
  });
  await res.redirect("/?page=" + page + "&&sorted=" + sorted);
};
const cancelEdit = async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = +req.query.page;
  await res.redirect("/?page=" + page + "&&sorted=" + sorted);
};
const checkTodo = async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = +req.query.page;
  const id = req.params.id;
  const todo = await TodoTask.findById(id);

  if (todo.checked == true) {
    todo.checked = false;
    todo.class = "";
    todo.save();
  } else {
    todo.checked = true;
    todo.class = "checked";
    todo.save();
  }
  await res.redirect("/?page=" + page + "&&sorted=" + sorted);
};
const sortTodo = async (req, res) => {
  let value = req.body.example;
  if (value == "oldFirst") {
    oldestFirst = "selected"
    newestFirst = ""
    alphabeticAz = ""
    alphabeticZa = ""
    typeOfSort = "date";
    value = 1;
  }
  if (value == "newFirst") {
    oldestFirst = ""
    newestFirst = "selected"
    alphabeticAz = ""
    alphabeticZa = ""
    typeOfSort = "date";
    value = -1;
  }
  if (value == "az") {
    oldestFirst = ""
    newestFirst = ""
    alphabeticAz = "selected"
    alphabeticZa = ""
    typeOfSort = "content";
    value = 1;
  }

  if (value == "za") {
    oldestFirst = ""
    newestFirst = ""
    alphabeticAz = ""
    alphabeticZa = "selected"
    typeOfSort = "content";
    value = -1;
  }

  res.redirect("/?sorted=" + value);
};

const showMoreTodos = async (req, res) => {
  let sorted = +req.query.sorted || 1;
  let page = +req.query.page;
  let totalPages = +req.query.totalPages;
  if (totalPages === 0) {
    res.redirect("/");
  }
  await res.redirect("/?page=" + (page + 1) + "&&sorted=" + sorted);
};

const showLessTodos = async (req, res) => {
  let sorted = +req.query.sorted || 1;
  await res.redirect("/?page=1&&sorted=" + sorted);
};

module.exports = {
  homeRender,
  addTodo,
  removeTodo,
  editTodo,
  editSubmit,
  cancelEdit,
  checkTodo,
  sortTodo,
  showMoreTodos,
  showLessTodos,
};
