import { RequestHandler } from "express";
import { v4 } from "uuid";

import { LabelMapper } from "@/mappers";
import { LabelServices } from "@/services";
import { LabelValidator } from "@/validator";

export class LabelController {
  static readonly create: RequestHandler = async (req, res, next) => {
    try {
      const label = req.body;
      const accountId = (req as any).account.id;

      LabelValidator.create(label);

      const data = await LabelServices.create(accountId, { id: v4(), ...label });
      res.json(LabelMapper.toRest(data));
    } catch (error) {
      next(error);
    }
  };
  static readonly update: RequestHandler = async (req, res, next) => {
    try {
      const label = req.body;
      const accountId = (req as any).account.id;
      const { labelId } = req.params;

      LabelValidator.update(accountId, label);

      const data = await LabelServices.update(accountId, { ...label, id: labelId });
      res.json(LabelMapper.toRest(data));
    } catch (error) {
      next(error);
    }
  };
  static readonly getOne: RequestHandler = async (req, res, next) => {
    try {
      const { labelId } = req.params;
      const accountId = (req as any).account.id;
      const data = await LabelServices.getOneById(accountId, labelId as string);
      res.json(LabelMapper.toRest(data));
    } catch (error) {
      next(error);
    }
  };
  static readonly archiveOne: RequestHandler = async (req, res, next) => {
    try {
      const { labelId } = req.params;
      const accountId = (req as any).account.id;
      const data = await LabelServices.archiveOneById(accountId, labelId as string);
      res.json(LabelMapper.toRest(data));
    } catch (error) {
      next(error);
    }
  };
  static readonly getAll: RequestHandler = async (req, res, next) => {
    try {
      const { page, pageSize } = req as any;
      const accountId = (req as any).account.id;

      const data = await LabelServices.getAll(accountId, { ...req.query, page, pageSize });
      res.json(LabelMapper.toListResponse(data.values, { page, pageSize, elementCount: data.count }));
    } catch (error) {
      next(error);
    }
  };
}
