import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { RoleRequest } from 'app-request';
import UserRepo from '../../database/repository/UserRepo';
import { BadRequestError } from '../../core/ApiError';
import { User } from '../../database/model/User';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { RoleCode } from '../../database/model/Role';
import role from '../../helpers/role';
import authorization from '../../auth/authorization';
import authentication from '../../auth/authentication';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import { Database } from '../../database';

const router = express.Router();
const db = new Database();
//----------------------------------------------------------------
router.use(authentication, role(RoleCode.ADMIN), authorization);
//----------------------------------------------------------------
router.post(
  '/user/assign',
  validator(schema.credential),
  asyncHandler(async (req: RoleRequest, res) => {
    const userRepo = new UserRepo(db);
    const keystoreRepo = new KeystoreRepo(db);
    const user = await userRepo.findByEmail(req.body.email);
    if (!user) throw new BadRequestError('User do not exists');

    const passwordHash = await bcrypt.hash(req.body.password, 10);

    await userRepo.updateInfo({
      id: user.id,
      password: passwordHash,
    } as User);

    await keystoreRepo.removeAllForClient(user.id);

    new SuccessResponse(
      'User password updated',
      _.pick(user, ['id', 'name', 'email']),
    ).send(res);
  }),
);

export default router;
