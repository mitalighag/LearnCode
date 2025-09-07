const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "instructor"], default: "student" },

    // Instructor fields
    qualification: { type: String, required: function() { return this.role === 'instructor'; } },
    description: { type: String, required: function() { return this.role === 'instructor'; } },
    experience: { type: String, required: function() { return this.role === 'instructor'; } },
    specialization: { type: String, required: false },
    linkedinProfile: { type: String, required: false },

    resetToken: String,
    resetTokenExpiry: Date,

  },
  { timestamps: true }
);


UserSchema.virtual("name").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
