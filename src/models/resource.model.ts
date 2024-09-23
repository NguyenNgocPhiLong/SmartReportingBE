import mongoose, { Document, Schema } from 'mongoose'

// Định nghĩa kiểu cho tài liệu Resource
export interface IResource extends Document {
  name: string
  dateOfBirth: Date
  sex: string
  account: string
  status: string
  phoneNumber: string
  identityCard: string
  email: string
  contract: string
  startDate: Date
  endDate: Date
  projects: mongoose.Types.ObjectId[]
}

// Tạo Schema cho Resource
const ResourceSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
  account: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  identityCard: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contract: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    }
  ]
})

// Kiểm tra xem mô hình đã tồn tại chưa, nếu có thì sử dụng nó
const Resource = mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema)

export default Resource
