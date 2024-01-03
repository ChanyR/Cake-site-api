const { BakerModel } = require("../models/bakerModel");
const {
  UserModel,
  validateUser,
  loginValid,
  createToken,
  validateEditUser,
} = require("../models/userModel");
const bcrypt = require("bcrypt");
const { transporter, generatePassword } = require("../middlewares/email");

let mailPassword = [];
function updateArray(updatedArray) {
  // הצהרה חוזרת על המערך המעודכן
  mailPassword = [...updatedArray];
}

exports.get = async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 10;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let data = await UserModel.find({}, { name: 1, role: 1 })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    let userInfo = await UserModel.findOne(
      { _id: req.tokenData._id },
      { password: 0 }
    );
    res.json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
};

exports.getUserList = async (req, res) => {
  try {
    let data = await UserModel.find({}, { password: 0 });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
};

exports.addUser = async (req, res) => {
  let valdiateBody = validateUser(req.body);
  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    user.password = "******";
    res.status(201).json(user);
  } catch (err) {
    if (err.code == 11000) {
      return res
        .status(400)
        .json({ msg: "Email already in system try login", code: 11000 });
    }
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
};

exports.login = async (req, res) => {
  let valdiateBody = loginValid(req.body);
  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details);
  }
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(401)
        .json({ msg: "Email or password is worng, code:1" });
    }
    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ msg: "Email or password is worng, code:2" });
    }
    let token = createToken(user._id, user.role);
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
};

exports.sendEmail = async (req, res) => {
  let { to } = req.body;
  let password = generatePassword();
  to = to.toLowerCase();
  let user = await UserModel.findOne({ email: to });
  const mailOptions = {
    from: "boutiquecakes10@gmail.com",
    to,
    subject: "[Boutique Cakes] reset your password",
    // text: `Your new password is: ${password}`,
    html: `
      <html>
        <body style="direction: rtl;">
          <h1 style="color:rgb(224, 216, 201);">אתחול סיסמת Boutique Cakes</h1>
          <p>הי ${user.name}</p>
          <p>ע"מ לשחזר את סיסמתך עליך להזין באתר את הקוד הבא: ${password}</p>
          <img src='../../public/logo.jpeg' alt="Boutique Cakes Logo" style="max-width: 100%; height: auto;">
        </body>
      </html>
    `
  };
  const index = mailPassword.findIndex((item) => item.to === to);
  if (index !== -1) {
    mailPassword[index] = { to, password };
  } else {
    mailPassword.push({ to, password });
  }
//   console.log(mailPassword);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Email sent:", info.response);
      res
        .status(200)
        .send({ status: "Email sent successfully", code: password });
    }
  });
};

exports.resetPassword = async (req, res) => {
  let { tempPassword, newPassword, email } = req.body;
  console.log(req.body);
  email = email.toLowerCase();
  let user = await UserModel.findOne({ email: email });
  if (!user) {
    return res.status(401).json({ msg: "user not exist" });
  }

  let obj = mailPassword.find((item) => item.to == email);
  if (obj.password == tempPassword) {
    let passwordB = await bcrypt.hash(newPassword, 10);
    let data = await UserModel.updateOne(
      { email: email },
      { password: passwordB }
    );
    const filteredArr = mailPassword.filter((item) => item.to !== email);
    updateArray(filteredArr);
    console.log("mailPassword reset", mailPassword);
    res.json(data);
  } else {
    res.json({ msg: "the password not match" });
  }
};

exports.editUserById = async (req, res) => {
  let validBody = validateEditUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let editId = req.params.editId;
    let data;
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    console.log(req.body);
    if (req.tokenData.role == "admin") {
      data = await UserModel.updateOne({ _id: editId }, req.body);
    } else if (editId == req.tokenData._id) {
      data = await UserModel.updateOne({ _id: editId }, req.body);
    } else {
      data = [{ status: "failed", msg: "You are not allowed to edit" }];
    }
    res.json(data);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "There error to edit user, try again later", err });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    let delId = req.params.delId;
    let data;
    if (req.tokenData.role == "admin" && delId != "65896cd2740ee8ebfced2e93") {
      let user = await UserModel.findById(delId);
      if (user.role == "baker") {
        await BakerModel.deleteOne({ user_id: delId });
      }
      data = await UserModel.deleteOne({ _id: delId });
    } else {
      data = [{ status: "failed", msg: "You are not admin" }];
    }
    res.json(data);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "There error to delete, try again later", err });
  }
};

exports.changeToBaker = async (req, res) => {
  const { userId } = req.params;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { role: "baker" },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let jsonBaker = {
      name: updatedUser.name,
      email: updatedUser.email,
      user_id: updatedUser._id,
    };
    let baker = new BakerModel(jsonBaker);
    await baker.save();

    updatedUser.password = "******";
    return res.json({
      message: "User role updated to baker",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.isExistEmail = async (req, res) => {
  let email = req.params.email;
  let user = await UserModel.findOne({ email: email });
  if (!user) {
    return res.status(201).json({ msg: "false" });
  } else {
    return res.status(200).json({ msg: "true" });
  }
};
