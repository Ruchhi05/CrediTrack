const Transaction = require("../models/transaction");

// @desc    Get all transactions
// @route   GET /api/transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction
      .find({ user: req.user })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};



// @desc    Add transaction
// @route   POST /api/transactions
exports.addTransaction = async (req, res, next) => {
  try {
    const { text, amount, category } = req.body;

    if (!text || amount === undefined || !category) {
      return res.status(500).json({
        success: false,
        message: "All fields are required"
      });
    }

    const transaction = await Transaction.create({
      user: req.user,
      text,
      amount,
      category
    });

    res.status(201).json({
      success: true,
      data: transaction
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Server Error"
    });
  }
};



// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user
    });


    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "No transaction found"
      });
    }

    await transaction.deleteOne();

    res.status(200).json({
      success: true,
      message: "Transaction deleted"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


// @desc    Update transaction
// @route   PUT /api/transactions/:id
exports.updateTransaction = async (req, res) => {
  try {
    const { text, amount, category } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.user },

      { text, amount, category },
      {  returnDocument: "after" , runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

