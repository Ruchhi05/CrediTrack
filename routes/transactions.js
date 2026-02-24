const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");


// IMPORT CONTROLLER
const { 
  getTransactions, 
  addTransaction, 
  deleteTransaction,
  updateTransaction
} = require("../controllers/transactions");



// USE CONTROLLER
router.get("/", protect, getTransactions);
router.post("/", protect, addTransaction);
router.delete("/:id", protect, deleteTransaction);
router.put("/:id", protect, updateTransaction);




module.exports = router;
