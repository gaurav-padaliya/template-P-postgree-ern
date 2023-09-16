import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import crypto from 'crypto';
import UserRepo from '../../database/repository/UserRepo';
import { BadRequestError, AuthFailureError } from '../../core/ApiError';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import { createTokens } from '../../auth/authUtils';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import { getUserData } from './utils';
import { PublicRequest } from '../../types/app-request';
import { Database } from '../../database';

const router = express.Router();
const db = new Database();
router.post(
  '/basic',
  validator(schema.credential),
  asyncHandler(async (req: PublicRequest, res) => {
    const userRepo = new UserRepo(db);
    const keystoreRepo = new KeystoreRepo(db);
    const user = await userRepo.findByEmail(req.body.email);
    if (!user) throw new BadRequestError('User not registered');
    if (!user.password) throw new BadRequestError('Credential not set');

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new AuthFailureError('Authentication failure');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    await keystoreRepo.create(user.id, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);
    console.log(tokens, 'hiii');

    const userData = await getUserData(user);

    new SuccessResponse('Login Success', {
      user: userData,
      tokens: tokens,
    }).send(res);
  }),
);

export default router;
