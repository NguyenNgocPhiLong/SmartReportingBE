import mongoose, { Document, Schema } from 'mongoose'

// Định nghĩa kiểu cho tài liệu Project
export interface IProject extends Document {
  projectName: string
  status: 'ongoing' | 'completed' | 'on hold'
  leader: string
  members: mongoose.Types.ObjectId[]
  cost: number
  progress: number
  startDate: Date
  endDate: Date
}

// Tạo Schema cho Project
const ProjectSchema: Schema = new Schema({
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'on hold'],
    required: true
  },
  leader: {
    type: String,
    required: true
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource'
    }
  ],
  cost: {
    type: Number,
    required: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
})

// Kiểm tra xem mô hình đã tồn tại chưa, nếu có thì sử dụng nó
const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)

export default Project
