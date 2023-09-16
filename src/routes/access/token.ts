import express from 'express';
import { TokenRefreshResponse } from '../../core/ApiResponse';
import { ProtectedRequest } from 'app-request';
import UserRepo from '../../database/repository/UserRepo';
import { AuthFailureError } from '../../core/ApiError';
import JWT from '../../core/JWT';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import crypto from 'crypto';
import {
  validateTokenData,
  createTokens,
  getAccessToken,
} from '../../auth/authUtils';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';

import { Database } from '../../database';

const router = express.Router();
const db = new Database();

router.post(
  '/refresh',
  validator(schema.auth, ValidationSource.HEADER),
  validator(schema.refreshToken),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const userRepo = new UserRepo(db);
    const keystoreRepo = new KeystoreRepo(db);
    req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

    const accessTokenPayload = await JWT.decode(req.accessToken);
    validateTokenData(accessTokenPayload);

    const user = await userRepo.findById(accessTokenPayload.sub);
    if (!user) throw new AuthFailureError('User not registered');
    req.user = user;

    const refreshTokenPayload = await JWT.validate(req.body.refreshToken);
    validateTokenData(refreshTokenPayload);

    if (accessTokenPayload.sub !== refreshTokenPayload.sub)
      throw new AuthFailureError('Invalid access token');

    const keystore = await keystoreRepo.find(
      req.user.id,
      accessTokenPayload.prm,
      refreshTokenPayload.prm,
    );

    if (!keystore) throw new AuthFailureError('Invalid access token');
    await keystoreRepo.remove(keystore.id);

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    await keystoreRepo.create(req.user.id, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(
      req.user,
      accessTokenKey,
      refreshTokenKey,
    );

    new TokenRefreshResponse(
      'Token Issued',
      tokens.accessToken,
      tokens.refreshToken,
    ).send(res);
  }),
);

export default router;
