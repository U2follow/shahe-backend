const router = require("express").Router();       //import from express router methode
const User = require("../model/User");        //import user model
const bcrypt = require("bcrypt");         //bcrypt is a library that enable us to encrypt data

// regsiter
router.post("/register", async (req, res) => { // async , send request when all other task comlpeted
  try {
    const salt = await bcrypt.genSalt(10); // create variable salt and call the function
    const hashedPass = await bcrypt.hash(req.body.password, salt);// varable containing new password which is encrypted

    const newUser = new User({
      username: req.body.username, // store name which comes with request
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save(); // saving new user in db
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

// login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong Credntials!");

    const validate = await bcrypt.compare(req.body.password, user.password);

    !validate && res.status(400).json("Wrong Credentials!");

    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;  //export routes
