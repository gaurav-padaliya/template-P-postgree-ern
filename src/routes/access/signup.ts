import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { RoleRequest } from 'app-request';
import crypto from 'crypto';
import UserRepo from '../../database/repository/UserRepo';
import { BadRequestError } from '../../core/ApiError';
import { User } from '../../database/model/User';
import { createTokens } from '../../auth/authUtils';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import { RoleCode } from '../../database/model/Role';
import { getUserData } from './utils';
import { Database } from '../../database';
const router = express.Router();
const db = new Database();
router.post(
  '/basic',
  // validator(schema.signup),
  asyncHandler(async (req: RoleRequest, res) => {
    const userRepo = new UserRepo(db);
    console.log(req.body, 'garav api');

    // const keystoreRepo = new KeystoreRepo(db);
    const user = await userRepo.findByEmail(req.body.email);
    if (user) throw new BadRequestError('User already registered');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    console.log('second');
    const { user: createdUser, keystore } = await userRepo.create(
      {
        name: req.body.name,
        email: req.body.email,
        profilePicUrl: req.body.profilePicUrl,
        password: passwordHash,
      } as User,
      accessTokenKey,
      refreshTokenKey,
      RoleCode.ADMIN,
    );

    let tokens;
    if (keystore?.primaryKey && keystore?.secondaryKey)
      tokens = await createTokens(
        createdUser,
        keystore.primaryKey,
        keystore.secondaryKey,
      );
    const userData = await getUserData(createdUser);

    new SuccessResponse('Signup Successful', {
      user: userData,
      tokens: tokens,
    }).send(res);
  }),
);

export default router;
