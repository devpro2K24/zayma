import User from "../../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

describe("User Controller Test", () => {
  it("should to create a new user", async () => {
    const user = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "a@a.com",
      password: "123456",
      role: "buyer",
      gender: "male",
      country: "United States",
    });
  });
});

const mockedCreateUser = {
  _id: "mockedUserId",
  ...mockerUserData,
};

// mock the request and response object
const req = {
  body: mockerUserData,
};
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

// mock the creteUser function of the userModel
user.create = jest.fn().mockedReturnValue(mockedCreateUser);

// call the createUser controller
userController.createUser(req, res);
