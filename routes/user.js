const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// Update user by id
router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    const { password, ...others } = updatedUser._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete user by id
router.delete("/delete/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted user");
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get single user by id
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get all users
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(1)
      : await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get user stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.setFullYear()-1))

    try {
      const data = await User.aggregate([
        { $match:{createdAt: { $gte: lastYear}}},
        {$project:{ month: { $month: "$createdAt"}}},
        {$group:{_id:"$month", total:{$sum:1}}}
      ])
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  });


module.exports = router;
