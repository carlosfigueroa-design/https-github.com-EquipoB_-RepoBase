import { Router } from 'express';
import {
  listAllApis,
  createApi,
  createApiFromSpec,
  changeStatus,
  getAuditLog,
} from '../../controllers/lifecycle.controller';

const router = Router();

router.get('/', listAllApis);
router.post('/', createApi);
router.post('/from-spec', createApiFromSpec);
router.patch('/:id/status', changeStatus);
router.get('/:id/audit', getAuditLog);

export default router;
