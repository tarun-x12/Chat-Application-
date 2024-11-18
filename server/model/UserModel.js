import mongoose from "mongoose";
import bcrypt from "bcrypt";

// User schema definition
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  profileSetup: {
    type: Boolean,
    default: false,
  },
  color: {
    type: Number,
    required: false,
  },
});

// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Static method to handle user login
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

// Custom method to create a user
userSchema.statics.createUser = async function (userData) {
  const user = new this(userData); // Creates a new user instance
  await user.save(); // Save the user to the database
  return user; // Return the created user
};

const User = mongoose.model("Users", userSchema);
export default User;
