import { Request, Response } from 'express'
import Resource from '../models/resource.model'
import Project from '../models/project.model'
import logger from '../utils/loggers.utils'

// Create: Tạo mới một resource
export const createResource = async (req: Request, res: Response): Promise<void> => {
  try {
    await global.initDB()

    // Tạo mới Resource
    const resource = new Resource(req.body)
    await resource.save()

    // Cập nhật các Project với Resource ID mới
    if (req.body.projects && req.body.projects.length > 0) {
      await Project.updateMany(
        { _id: { $in: req.body.projects } }, // Điều kiện lọc các projects
        { $addToSet: { members: resource._id } } // Thêm Resource ID vào mảng members của Project
      )
    }

    logger.info('Resource created successfully with ID: %s', resource._id)
    res.status(201).json(resource)
  } catch (err) {
    logger.error('Error creating resource: %s', err.message)
    res.status(400).send('Bad Request')
  }
}

// Read: Lấy danh sách tất cả resource
export const getResources = async (req: Request, res: Response): Promise<void> => {
  try {
    await global.initDB()
    const resources = await Resource.find()
    
    console.log("check===>",resources)
    logger.info('Fetched all resources')
    res.status(200).json(resources)
  } catch (err) {
    logger.error('Error fetching resources: %s', err.message)
    res.status(500).send('Internal Server Error')
  }
}

// Read: Lấy resource theo ID
export const getResourceById = async (req: Request, res: Response): Promise<void> => {
  try {
    await global.initDB()
    // Lấy tài nguyên theo ID và populate projects
    const resource = await Resource.findById(req.params.id).populate('projects')

    // Kiểm tra xem tài nguyên có tồn tại không
    if (!resource) {
      logger.warn('Resource not found for ID: %s', req.params.id)
      res.status(404).send('Resource not found')
      return // Kết thúc hàm khi không tìm thấy tài nguyên
    }

    // Trả về tài nguyên đã được populate
    logger.info('Fetched resource by ID: %s', req.params.id)
    res.status(200).json(resource)
  } catch (err) {
    logger.error('Error fetching resource by ID: %s', err.message)
    res.status(500).send('Internal Server Error')
  }
}

// Update: Cập nhật resource theo ID
export const updateResource = async (req: Request, res: Response): Promise<void> => {
  try {
    await global.initDB()

    // Cập nhật Resource theo ID
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    // Kiểm tra xem Resource có tồn tại không
    if (!resource) {
      logger.warn('Resource not found for update with ID: %s', req.params.id)
      res.status(404).send('Resource not found')
      return // Kết thúc hàm khi không tìm thấy tài nguyên
    }

    // Nếu có projects trong yêu cầu cập nhật, cập nhật Project với Resource ID mới
    if (req.body.projects) {
      const projectIds = req.body.projects

      // Cập nhật các project để thêm resource vào mảng members
      await Project.updateMany({ _id: { $in: projectIds } }, { $addToSet: { members: resource._id } })

      // Xóa resource khỏi các projects không còn liên quan
      await Project.updateMany({ _id: { $nin: projectIds } }, { $pull: { members: resource._id } })
    }

    logger.info('Resource updated successfully with ID: %s', req.params.id)
    res.status(200).json(resource)
  } catch (err) {
    logger.error('Error updating resource: %s', err.message)
    res.status(400).send('Bad Request')
  }
}

// Delete: Xóa resource theo ID
export const deleteResource = async (req: Request, res: Response): Promise<void> => {
  try {
    await global.initDB()
    const resource = await Resource.findByIdAndDelete(req.params.id)

    if (!resource) {
      logger.warn('Resource not found for delete with ID: %s', req.params.id)
      res.status(404).send('Resource not found')
      return // Kết thúc hàm khi không tìm thấy tài nguyên
    }

    logger.info('Resource deleted successfully with ID: %s', req.params.id)
    res.status(200).send('Resource deleted successfully')
  } catch (err) {
    logger.error('Error deleting resource: %s', err.message)
    res.status(500).send('Internal Server Error')
  }
}
