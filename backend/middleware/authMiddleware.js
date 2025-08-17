import { UnAuthenticatedErr, UnauthorizedErr } from "../errors/customErors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = async (req, res, next) => {
  const { token } = req.cookies;
  console.log({ tokenis: token });
  if (!token) throw new UnAuthenticatedErr("Authentication invalid");
  try {
    const { userId, role } = verifyJWT(token);
    req.user = { userId, role };
    console.log({ userId, role,user: req.user, token });
    next();
  } catch {
    throw new UnAuthenticatedErr("Authentication invalid");
  }
};


export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedErr("Unauthorized to access this route");
    }
    next();
  };
};
