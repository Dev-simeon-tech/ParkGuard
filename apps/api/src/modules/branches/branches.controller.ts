import type { Request, Response } from 'express';
import { BranchMessages } from './branches.messages';
import { BranchesService } from './branches.service';

export class BranchesController {
  private readonly service = new BranchesService();

  createBranch = async (req: Request, res: Response) => {
    const branch = await this.service.createBranch(req.organizationUser!.organization.id, req.body);
    res.status(201).json({ branch });
  };

  listBranches = async (req: Request, res: Response) => {
    const branches = await this.service.listBranches(req.organizationUser!.organization.id);
    res.json({ branches });
  };

  getBranch = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const branch = await this.service.getBranch(req.organizationUser!.organization.id, id);
    res.json({ branch });
  };

  updateBranch = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await this.service.updateBranch(req.organizationUser!.organization.id, id, req.body);
    res.json({ message: BranchMessages.BRANCH_UPDATED });
  };

  disableBranch = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await this.service.disableBranch(req.organizationUser!.organization.id, id);
    res.json({ message: BranchMessages.BRANCH_DISABLED });
  };

  enableBranch = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await this.service.enableBranch(req.organizationUser!.organization.id, id);
    res.json({ message: BranchMessages.BRANCH_ENABLED });
  };
}
