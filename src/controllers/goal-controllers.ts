import { RequestHandler } from "express";
import { v4 } from "uuid";

import { GoalMapper } from "@/mappers";
import { GoalServices } from "@/services";
import { GoalValidator } from "@/validator";

export class GoalController {
  static readonly create: RequestHandler = async (req, res, next) => {
    try {
      const { walletId } = req.params as Record<string, string>;
      const accountId = (req as any).account.id;

      await GoalValidator.create(accountId, walletId, req.body);
      const data = await GoalServices.create(accountId, walletId, GoalMapper.create(accountId, { ...req.body }));
      res.json(GoalMapper.toRest(data));
    } catch (error) {
      next(error);
    }
  };
  static readonly update: RequestHandler = async (req, res, next) => {
    try {
      const goal = req.body;
      const accountId = (req as any).account.id;
      const { goalId, walletId } = req.params as Record<string, string>;

      GoalValidator.update(accountId, goal);

      const data = await GoalServices.update(accountId, walletId, { ...goal, id: goalId });
      res.json(GoalMapper.toRest(data));
    } catch (error) {
      next(error);
    }
  };
  static readonly getOne: RequestHandler = async (req, res, next) => {
    try {
      const { goalId } = req.params;
      const accountId = (req as any).account.id;
      const data = await GoalServices.getOneById(accountId, goalId as string);
      res.json(GoalMapper.toRest(data));
    } catch (error) {
      next(error);
    }
  };
  static readonly archiveOne: RequestHandler = async (req, res, next) => {
    try {
      const { goalId } = req.params;
      const accountId = (req as any).account.id;
      const data = await GoalServices.archiveOneById(accountId, goalId as string);
      res.json(GoalMapper.toRest(data));
    } catch (error) {
      next(error);
    }
  };
  static readonly getAll: RequestHandler = async (req, res, next) => {
    try {
      const { page, pageSize } = req as any;
      const accountId = (req as any).account.id;
      GoalValidator.filters(req.query as any);
      const data = await GoalServices.getAll(accountId, { ...req.query, page, pageSize });
      res.json(GoalMapper.toListResponse(data.values, { page, pageSize, elementCount: data.count }));
    } catch (error) {
      next(error);
    }
  };
}
