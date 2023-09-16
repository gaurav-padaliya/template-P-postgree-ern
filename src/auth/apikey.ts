import express from 'express';
import ApiKeyRepo from '../database/repository/ApiKeyRepo';
import { ForbiddenError } from '../core/ApiError';
import Logger from '../core/Logger';
import { PublicRequest } from 'app-request';
import schema from './schema';
import validator, { ValidationSource } from '../helpers/validator';
import asyncHandler from '../helpers/asyncHandler';
import { Header } from '../core/utils';
import { Database } from '../database';

const router = express.Router();
const db = new Database();

export default router.use(
  validator(schema.apiKey, ValidationSource.HEADER),
  asyncHandler(async (req: PublicRequest, res, next) => {
    const apiKeyRepo = new ApiKeyRepo(db);
    const key = req.headers[Header.API_KEY]?.toString();
    if (!key) throw new ForbiddenError();

    const apiKey = await apiKeyRepo.findByKey(key);
    if (!apiKey) throw new ForbiddenError();
    Logger.info(apiKey);

    req.apiKey = apiKey;
    return next();
  }),
);
