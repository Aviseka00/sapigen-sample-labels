import mongoose from 'mongoose';

const labelSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    username: { type: String, required: true, index: true },
    folderDate: { type: String, required: true, index: true }, // YYYY-MM-DD
    labelType: { type: String, enum: ['standard', 'custom'], default: 'standard' },
    template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', default: null },
    templateName: { type: String, default: '' },
    templateSnapshot: { type: mongoose.Schema.Types.Mixed, default: null },
    customValues: { type: mongoose.Schema.Types.Mixed, default: {} },
    productName: { type: String, default: '' },
    batchNumber: { type: String, default: '' },
    sampleStage: { type: String, default: '' },
    sampleDate: { type: String, default: '' },
    sampleQty: { type: String, default: '' },
    testName: { type: String, default: '' },
    sampleBy: { type: String, default: '' },
    checkedBy: { type: String, default: '' },
    paperSize: { type: String, default: 'A4' },
    labelsPerPage: { type: Number, default: 4 },
    quantity: { type: Number, default: 1 },
    printedAt: { type: Date },
    status: { type: String, enum: ['draft', 'saved', 'printed'], default: 'draft' },
  },
  { timestamps: true }
);

labelSchema.index({ username: 1, folderDate: 1, createdAt: -1 });

export default mongoose.model('Label', labelSchema);
