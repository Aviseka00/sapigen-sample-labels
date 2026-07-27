import { Router } from 'express';
import Template from '../models/Template.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

function buildCells(rows, columns, existing = []) {
  const cells = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < columns; c += 1) {
      const idx = r * columns + c;
      const prev = existing[idx] || {};
      cells.push({
        writeup: prev.writeup || '',
        isInput: prev.isInput !== undefined ? Boolean(prev.isInput) : c === columns - 1 || columns === 1,
        key: prev.key || `r${r}c${c}`,
      });
    }
  }
  return cells;
}

router.get('/', async (req, res) => {
  try {
    const templates = await Template.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findOne({ _id: req.params.id, user: req.user.id });
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      rows,
      columns,
      widthMm,
      heightMm,
      headerTitle,
      showLogo,
      cells,
      paperSize,
      labelsPerPage,
    } = req.body;

    if (!name?.trim()) return res.status(400).json({ message: 'Template name is required' });

    const r = Math.min(20, Math.max(1, Number(rows) || 4));
    const c = Math.min(8, Math.max(1, Number(columns) || 2));

    const template = await Template.create({
      user: req.user.id,
      username: req.user.username,
      name: name.trim(),
      description: description || '',
      rows: r,
      columns: c,
      widthMm: Number(widthMm) || 90,
      heightMm: Number(heightMm) || 60,
      headerTitle: headerTitle || '',
      showLogo: Boolean(showLogo),
      cells: buildCells(r, c, cells),
      paperSize: paperSize || 'A4',
      labelsPerPage: Number(labelsPerPage) || 4,
    });

    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const template = await Template.findOne({ _id: req.params.id, user: req.user.id });
    if (!template) return res.status(404).json({ message: 'Template not found' });

    const r = Math.min(20, Math.max(1, Number(req.body.rows ?? template.rows)));
    const c = Math.min(8, Math.max(1, Number(req.body.columns ?? template.columns)));

    template.name = req.body.name?.trim() || template.name;
    template.description = req.body.description ?? template.description;
    template.rows = r;
    template.columns = c;
    template.widthMm = Number(req.body.widthMm ?? template.widthMm);
    template.heightMm = Number(req.body.heightMm ?? template.heightMm);
    template.headerTitle = req.body.headerTitle ?? template.headerTitle;
    template.showLogo = req.body.showLogo !== undefined ? Boolean(req.body.showLogo) : template.showLogo;
    template.paperSize = req.body.paperSize || template.paperSize;
    template.labelsPerPage = Number(req.body.labelsPerPage ?? template.labelsPerPage);
    template.cells = buildCells(r, c, req.body.cells || template.cells);

    await template.save();
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const template = await Template.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
