import { isAdmin } from "../../middleware/authMiddleware";

describe("Middleware: isAdmin", () => {
  "";
  const next = jest.fn();
  let req, res;

  beforeEach(() => {
    req = { user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 401 if no user is present", () => {
    req.user = null;
    isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication required",
    });
  });

  it("should return 403 if user is not an admin", () => {
    req.user = { isAdmin: false };
    isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Access forbidden: Admins only",
    });
  });

  it("should call next if user is an admin", () => {
    req.user = { isAdmin: true };
    isAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
