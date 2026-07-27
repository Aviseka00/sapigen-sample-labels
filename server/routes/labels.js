import { Router } from 'express';
import mongoose from 'mongoose';
import Label from '../models/Label.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

function todayFolder() {
  return new Date().toISOString().slice(0, 10);
}

router.get('/', async (req, res) => {
  try {
    const { folderDate, username } = req.query;
    const filter = { user: req.user.id };
    if (folderDate) filter.folderDate = folderDate;
    if (username) filter.username = username;

    const labels = await Label.find(filter).sort({ createdAt: -1 });
    res.json(labels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/folders', async (req, res) => {
  try {
    const folders = await Label.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: '$folderDate',
          count: { $sum: 1 },
          lastUpdated: { $max: '$updatedAt' },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.json(
      folders.map((f) => ({
        date: f._id,
        count: f.count,
        lastUpdated: f.lastUpdated,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const label = await Label.findOne({ _id: req.params.id, user: req.user.id });
    if (!label) return res.status(404).json({ message: 'Label not found' });
    res.json(label);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const label = await Label.create({
      user: req.user.id,
      username: req.user.username,
      folderDate: data.folderDate || todayFolder(),
      labelType: data.labelType === 'custom' ? 'custom' : 'standard',
      template: data.template || null,
      templateName: data.templateName || '',
      templateSnapshot: data.templateSnapshot || null,
      customValues: data.customValues || {},
      productName: data.productName || '',
      batchNumber: data.batchNumber || '',
      sampleStage: data.sampleStage || '',
      sampleDate: data.sampleDate || '',
      sampleQty: data.sampleQty || '',
      testName: data.testName || '',
      sampleBy: data.sampleBy || '',
      checkedBy: data.checkedBy || '',
      paperSize: data.paperSize || 'A4',
      labelsPerPage: Number(data.labelsPerPage) || 4,
      quantity: Number(data.quantity) || 1,
      status: data.status || 'saved',
    });
    res.status(201).json(label);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const allowed = [
      'labelType',
      'template',
      'templateName',
      'templateSnapshot',
      'customValues',
      'productName',
      'batchNumber',
      'sampleStage',
      'sampleDate',
      'sampleQty',
      'testName',
      'sampleBy',
      'checkedBy',
      'paperSize',
      'labelsPerPage',
      'quantity',
      'status',
      'folderDate',
    ];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const label = await Label.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true }
    );
    if (!label) return res.status(404).json({ message: 'Label not found' });
    res.json(label);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/print', async (req, res) => {
  try {
    const label = await Label.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        status: 'printed',
        printedAt: new Date(),
        folderDate: req.body.folderDate || todayFolder(),
      },
      { new: true }
    );
    if (!label) return res.status(404).json({ message: 'Label not found' });
    res.json(label);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const label = await Label.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!label) return res.status(404).json({ message: 'Label not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
