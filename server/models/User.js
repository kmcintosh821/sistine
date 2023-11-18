const { Schema, model } = require("mongoose");
const { hash, compare } = require("bcrypt");

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      validate: {
        validator(val) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val);
        },
        message() {
          return "Please enter a valid email address.";
        },
      },
    },
    password: {
      type: String,
      minLength: [6, "Your password must be at least 6 characters in length"],
    },
  },
  {
    timestamps: true,
    methods: {
      async validatePass(formPassword) {
        const is_valid = await compare(formPassword, this.password);

        return is_valid;
      },
    },
    toJSON: {
      transform(_, user) {
        delete user.__v;
        delete user.password;
        return user;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.password = await hash(this.password, 10);
  }

  next();
});

const User = model("User", userSchema);

module.exports = User;
