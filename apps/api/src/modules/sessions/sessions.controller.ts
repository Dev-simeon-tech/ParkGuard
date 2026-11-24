import type { RecognizeSessionBody } from '@parkguard/schemas';
import type { Request, Response } from 'express';
import { SessionsService } from './sessions.service';

export class SessionsController {
  private readonly service = new SessionsService();

  recognize = async (req: Request, res: Response) => {
    const { branchId, imageBase64, mimeType } = req.body as RecognizeSessionBody;
    const result = await this.service.recognize(
      req.organizationUser!,
      branchId,
      imageBase64,
      mimeType,
    );
    res.json(result);
  };

  recogniseByPlate = async (req: Request, res: Response) => {
    const { plateNumber, branchId } = req.body as { plateNumber: string; branchId: string };
    const result = await this.service.recogniseByPlate(
      plateNumber,
      branchId,
      req.organizationUser!,
    );
    res.json(result);
  };

  createSession = async (req: Request, res: Response) => {
    const session = await this.service.createSession(
      req.organizationUser!,
      req.user!.userId,
      req.body,
    );
    res.status(201).json({ session });
  };

  closeSession = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const session = await this.service.closeSession(
      req.organizationUser!,
      req.user!.userId,
      id,
      req.body,
    );
    res.json({ session });
  };

  listSessions = async (req: Request, res: Response) => {
    const result = await this.service.listSessions(
      req.organizationUser!.organization.id,
      req.query,
    );
    res.json(result);
  };

  getAnalytics = async (req: Request, res: Response) => {
    const { date } = req.query as { date: string };
    const analytics = await this.service.getAnalytics(req.organizationUser!.organization.id, date);
    res.json({ analytics });
  };

  getRevenueAnalytics = async (req: Request, res: Response) => {
    const { date } = req.query as { date: string };
    const analytics = await this.service.getRevenueAnalytics(
      req.organizationUser!.organization.id,
      date,
    );
    res.json({ analytics });
  };

  getAttendantAnalytics = async (req: Request, res: Response) => {
    const { date, userId } = req.query as { date: string; userId: string };
    const analytics = await this.service.getAttendantAnalytics(
      req.organizationUser!.organization.id,
      userId,
      date,
    );
    res.json({ analytics });
  };

  getSession = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const session = await this.service.getSession(req.organizationUser!.organization.id, id);
    res.json({ session });
  };

  getSessionPhoto = async (req: Request, res: Response) => {
    const { id, type } = req.params as { id: string; type: 'entry' | 'exit' };
    const { buffer, mimeType } = await this.service.getPhoto(
      req.organizationUser!.organization.id,
      id,
      type,
    );
    res.setHeader('Content-Type', mimeType);
    res.send(buffer);
  };

  listVehicles = async (req: Request, res: Response) => {
    const { search } = req.query as { search?: string };
    const vehicles = await this.service.listVehicles(req.organizationUser!.organization.id, search);
    res.json({ vehicles });
  };

  getVehicle = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const vehicle = await this.service.getVehicle(req.organizationUser!.organization.id, id);
    res.json({ vehicle });
  };
}
