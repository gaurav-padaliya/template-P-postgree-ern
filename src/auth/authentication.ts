import express from 'express';
import { ProtectedRequest } from 'app-request';
import UserRepo from '../database/repository/UserRepo';
import {
  AuthFailureError,
  AccessTokenError,
  TokenExpiredError,
} from '../core/ApiError';
import JWT from '../core/JWT';
import KeystoreRepo from '../database/repository/KeystoreRepo';
import { getAccessToken, validateTokenData } from './authUtils';
import validator, { ValidationSource } from '../helpers/validator';
import schema from './schema';
import asyncHandler from '../helpers/asyncHandler';
import { Database } from '../database';

const router = express.Router();
const db = new Database();
export default router.use(
  validator(schema.auth, ValidationSource.HEADER),
  asyncHandler(async (req: ProtectedRequest, res, next) => {
    const userRepo = new UserRepo(db);
    const keystoreRepo = new KeystoreRepo(db);
    req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

    try {
      const payload = await JWT.validate(req.accessToken);
      validateTokenData(payload);
      const user = await userRepo.findById(payload.sub);
      if (!user) throw new AuthFailureError('User not registered');
      req.user = user;
      const keystore = await keystoreRepo.findForKey(req.user.id, payload.prm);
      if (!keystore) throw new AuthFailureError('Invalid access token');
      req.keystore = keystore;
      console.log(user, keystore, 'both');
      return next();
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
      throw e;
    }
  }),
);
