import jwt from 'jsonwebtoken';

const createToken = (res, userId) => {
  const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: '10d',
  });
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 12 * 24 * 60 * 60 * 1000,
  });
};

export default createToken;
