import type { Request, Response } from 'express';
import { OrganizationMessages } from './organizations.messages';
import { OrganizationsService } from './organizations.service';

export class OrganizationsController {
  private readonly service = new OrganizationsService();

  inviteMember = async (req: Request, res: Response) => {
    await this.service.inviteMember({
      organizationId: req.organizationUser!.organization.id,
      ...req.body,
    });
    res.status(201).json({ message: OrganizationMessages.INVITE_SENT });
  };

  verifyInvite = async (req: Request, res: Response) => {
    const { token } = req.query as { token: string };
    const info = await this.service.verifyInviteToken(token);
    res.json(info);
  };

  acceptInvite = async (req: Request, res: Response) => {
    await this.service.acceptInvite(req.body);
    res.json({ message: OrganizationMessages.PASSWORD_SET });
  };

  listRoles = async (_req: Request, res: Response) => {
    const roles = await this.service.listRoles();
    res.json({ roles });
  };

  listEmployees = async (req: Request, res: Response) => {
    const employees = await this.service.listEmployees(req.organizationUser!.organization.id);
    res.json({ employees });
  };

  updateEmployee = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await this.service.updateEmployee(req.organizationUser!.organization.id, id, req.body);
    res.json({ message: OrganizationMessages.EMPLOYEE_UPDATED });
  };

  disableEmployee = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await this.service.disableEmployee(req.organizationUser!.organization.id, id, req.user!.userId);
    res.json({ message: OrganizationMessages.EMPLOYEE_DISABLED });
  };

  enableEmployee = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await this.service.enableEmployee(req.organizationUser!.organization.id, id);
    res.json({ message: OrganizationMessages.EMPLOYEE_ENABLED });
  };

  removeEmployee = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await this.service.removeEmployee(req.organizationUser!.organization.id, id, req.user!.userId);
    res.status(204).send();
  };
}
