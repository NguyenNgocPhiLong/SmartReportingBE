import { Request, Response } from 'express'
import Project from '../models/project.model'
import Resource from '../models/resource.model'
import logger from '../utils/loggers.utils'

// Create: Tạo mới một project
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    await global.initDB()

    // Tạo mới Project
    const project = new Project(req.body)
    await project.save()

    // Cập nhật các Resource với Project ID mới
    if (req.body.members && req.body.members.length > 0) {
      await Resource.updateMany(
        { _id: { $in: req.body.members } }, // Điều kiện lọc các members
        { $addToSet: { projects: project._id } } // Thêm Project ID vào mảng projects của Resource
      )
    }

    logger.info('Created new project with ID: %s', project._id)
    res.status(201).send(project)
  } catch (err) {
    logger.error('Error creating project: %s', err.message)
    res.status(400).send('Bad Request')
  }
}

// Read: Lấy danh sách tất cả project
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    await global.initDB()
    const projects = await Project.find()

    logger.info('Fetched all projects')
    res.status(200).send(projects)
  } catch (err) {
    logger.error('Error fetching projects: %s', err.message)
    res.status(500).send('Internal Server Error')
  }
}

// Read: Lấy project theo ID
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    await global.initDB()
    // Lấy dự án theo ID và populate members
    const project = await Project.findById(req.params.id).populate('members')

    // Kiểm tra xem dự án có tồn tại không
    if (!project) {
      logger.warn('Project not found with ID: %s', req.params.id)
      res.status(404).send('Project not found')
      return
    }

    // Trả về dự án đã được populate
    logger.info('Fetched project with ID: %s', req.params.id)
    res.status(200).send(project)
  } catch (err) {
    logger.error('Error fetching project by ID: %s', err.message)
    res.status(500).send('Internal Server Error')
  }
}

// Update: Cập nhật project theo ID
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    await global.initDB()

    // Cập nhật Project theo ID
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    // Kiểm tra xem Project có tồn tại không
    if (!updatedProject) {
      logger.warn('Project not found with ID: %s', req.params.id)
      res.status(404).send('Project not found')
      return
    }

    // Cập nhật Resource với Project ID mới
    if (req.body.members) {
      const existingMembers = updatedProject.members

      // Cập nhật các Resource với Project ID mới
      await Resource.updateMany(
        { _id: { $in: req.body.members } }, // Điều kiện lọc các members
        { $addToSet: { projects: updatedProject._id } } // Thêm Project ID vào mảng projects của Resource
      )

      // Xóa Project ID khỏi các Resource không còn là thành viên
      await Resource.updateMany(
        { _id: { $in: existingMembers, $nin: req.body.members } }, // Điều kiện lọc các members cũ không còn
        { $pull: { projects: updatedProject._id } } // Xóa Project ID khỏi mảng projects của Resource
      )
    }

    // Populate members và trả về Project đã được cập nhật
    const populatedProject = await Project.findById(updatedProject._id).populate('members')
    logger.info('Updated project with ID: %s', req.params.id)
    res.status(200).json(populatedProject)
  } catch (err) {
    logger.error('Error updating project: %s', err.message)
    res.status(400).send('Bad Request')
  }
}

// Delete: Xóa project theo ID
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    await global.initDB()
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) {
      logger.warn('Project not found with ID: %s', req.params.id)
      res.status(404).send('Project not found')
      return
    }
    logger.info('Deleted project with ID: %s', req.params.id)
    res.status(200).send('Project deleted successfully')
  } catch (err) {
    logger.error('Error deleting project: %s', err.message)
    res.status(500).send('Internal Server Error')
  }
}
