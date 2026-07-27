import mongoose from 'mongoose';

const cellSchema = new mongoose.Schema(
  {
    writeup: { type: String, default: '' },
    isInput: { type: Boolean, default: true },
    key: { type: String, default: '' },
  },
  { _id: false }
);

const templateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    username: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    rows: { type: Number, required: true, min: 1, max: 20 },
    columns: { type: Number, required: true, min: 1, max: 8 },
    widthMm: { type: Number, default: 90 },
    heightMm: { type: Number, default: 60 },
    headerTitle: { type: String, default: '' },
    showLogo: { type: Boolean, default: false },
    cells: { type: [cellSchema], default: [] },
    paperSize: { type: String, default: 'A4' },
    labelsPerPage: { type: Number, default: 4 },
  },
  { timestamps: true }
);

templateSchema.index({ user: 1, name: 1 });

export default mongoose.model('Template', templateSchema);
