import express from 'express';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import { ProtectedRequest } from 'app-request';
import { SuccessMsgResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import authentication from '../../auth/authentication';
import { Database } from '../../database';
const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication);
/*-------------------------------------------------------------------------*/
const db = new Database();
router.delete(
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const keystoreRepo = new KeystoreRepo(db);
    await keystoreRepo.remove(req.keystore.id);
    new SuccessMsgResponse('Logout success').send(res);
  }),
);

export default router;
