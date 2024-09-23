import express, { Request, Response, NextFunction } from 'express'
import {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource
} from '../controllers/resource.controller'

const router = express.Router()

// Create
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createResource(req, res)
  } catch (error) {
    next(error)
  }
})

// Read all
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getResources(req, res)
  } catch (error) {
    next(error)
  }
})

// Read by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getResourceById(req, res)
  } catch (error) {
    next(error)
  }
})

// Update
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateResource(req, res)
  } catch (error) {
    next(error)
  }
})

// Delete
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteResource(req, res)
  } catch (error) {
    next(error)
  }
})

export default router
