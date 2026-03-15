import { RequestHandler } from "express";

import { BadRequestError } from "@/errors";
import { TransactionMapper } from "@/mappers";
import { TransactionServices } from "@/services";
import { TransactionValidator } from "@/validator";

export class TransactionController {
  static readonly create: RequestHandler = async (req, res, next) => {
    try {
      const { walletId, accountId } = req.params as Record<string, string>;

      TransactionValidator.create(req.body);
      const mappedCreateTransaction = TransactionMapper.create(accountId, walletId, req.body);
      const labels = req.body.labels || [];

      const data = await TransactionServices.create(accountId, walletId, mappedCreateTransaction, labels);
      res.json(TransactionMapper.toRest(data));
    } catch (error) {
      next(error);
    }
  };
  static readonly update: RequestHandler = async (req, res, next) => {
    try {
      const label = req.body;
      const accountId = (req as any).account.id;
      const { walletId, transactionId } = req.params as Record<string, string>;

      TransactionValidator.update(accountId, label);
      const mappedUpdateTransaction = TransactionMapper.update(accountId, walletId as string, req.body);
      const labels = req.body.labels || [];

      const data = await TransactionServices.update(accountId, walletId, transactionId, mappedUpdateTransaction, labels);
      res.json(TransactionMapper.toRest(data));
    } catch (error) {
      next(error);
    }
  };
  static readonly getOne: RequestHandler = async (req, res, next) => {
    try {
      const { walletId, accountId, transactionId } = req.params as Record<string, string>;
      const data = await TransactionServices.getOneById(accountId, walletId, transactionId);
      res.json(TransactionMapper.toRest(data));
    } catch (error) {
      next(error);
    }
  };
  static readonly deleteOne: RequestHandler = async (req, res, next) => {
    try {
      const { walletId, accountId, transactionId } = req.params as Record<string, string>;
      const data = await TransactionServices.deleteOneById(accountId, walletId, transactionId);
      res.json(TransactionMapper.toRest(data));
    } catch (error) {
      next(error);
    }
  };
  static readonly getAll: RequestHandler = async (req, res, next) => {
    try {
      const { page, pageSize } = req as any;
      const { accountId } = req.params as Record<string, string>;
      TransactionValidator.filters(req.query as any);
      const data = await TransactionServices.getAll(accountId, { page, pageSize, ...req.query });
      res.json(data.map(TransactionMapper.toRest));
    } catch (error) {
      next(error);
    }
  };
}
