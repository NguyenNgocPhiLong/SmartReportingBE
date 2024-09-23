import express, { Request, Response, NextFunction } from 'express'
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/project.controller'

const router = express.Router()

// Create
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createProject(req, res)
  } catch (error) {
    next(error)
  }
})

// Read all
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getProjects(req, res)
  } catch (error) {
    next(error)
  }
})

// Read by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getProjectById(req, res)
  } catch (error) {
    next(error)
  }
})

// Update
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateProject(req, res)
  } catch (error) {
    next(error)
  }
})

// Delete
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteProject(req, res)
  } catch (error) {
    next(error)
  }
})

export default router
