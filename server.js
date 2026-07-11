import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { exec } from 'child_process';
import { readFile } from 'fs/promises';
import { connectDatabase, Paper } from './database.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

const frontendDistPath = join(__dirname,'./frontend/dist');

app.use(cors({ origin: '*' }));
app.use(express.json());

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\u{1F680} Server running at ${url}`);
});

// Serve the built frontend (dist) on every start
app.use(express.static(frontendDistPath));

//connection database
await connectDatabase();


app.get('/api/papers', async (req, res) => {
  try {
    const papers = await Paper.find().sort({ dateAdded: -1 });
    res.json(papers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/papers/:id', async (req, res) => {
  try {
    const paper = await Paper.findOne({ id: req.params.id });
    if (!paper) return res.status(404).json({ error: 'Paper not found' });
    res.json(paper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/papers', async (req, res) => {
  try {
    const { title, firstAuthor, domain, readingStage, citationCount = 0, impactScore, dateAdded } = req.body;

    if (!title || !firstAuthor || !domain || !readingStage || !impactScore || !dateAdded) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const validDomains = ['Computer Science', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Social Sciences'];
    const validStages = ['Abstract Read', 'Introduction Done', 'Methodology Done', 'Results Analyzed', 'Fully Read', 'Notes Completed'];
    const validScores = ['High Impact', 'Medium Impact', 'Low Impact', 'Unknown'];

    if (!validDomains.includes(domain)) return res.status(400).json({ error: 'Invalid domain' });
    if (!validStages.includes(readingStage)) return res.status(400).json({ error: 'Invalid reading stage' });
    if (!validScores.includes(impactScore)) return res.status(400).json({ error: 'Invalid impact score' });

    const newPaper = new Paper({ title, firstAuthor, domain, readingStage, citationCount, impactScore, dateAdded });
    const savedPaper = await newPaper.save();
    res.status(201).json(savedPaper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/papers/:id', async (req, res) => {
  try {
    const { title, firstAuthor, domain, readingStage, citationCount, impactScore, dateAdded } = req.body;
    const existingPaper = await Paper.findOne({ id: req.params.id });
    if (!existingPaper) return res.status(404).json({ error: 'Paper not found' });

    const updatedPaper = await Paper.findOneAndUpdate(
      { id: req.params.id },
      { title, firstAuthor, domain, readingStage, citationCount, impactScore, dateAdded },
      { new: true }
    );

    res.json(updatedPaper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/papers/:id', async (req, res) => {
  try {
    const existingPaper = await Paper.findOne({ id: req.params.id });
    if (!existingPaper) return res.status(404).json({ error: 'Paper not found' });

    await Paper.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Paper deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/summary', async (req, res) => {
  try {
    const totalCount = await Paper.countDocuments({});
    const stageBreakdown = await Paper.aggregate([
      { $group: { _id: '$readingStage', count: { $sum: 1 } } },
      { $project: { readingStage: '$_id', count: 1, _id: 0 } }
    ]);
    const avgCitationsByDomain = await Paper.aggregate([
      { $group: { _id: '$domain', avgCitations: { $avg: '$citationCount' }, paperCount: { $sum: 1 } } },
      { $project: { domain: '$_id', avgCitations: { $round: ['$avgCitations', 2] }, paperCount: 1, _id: 0 } }
    ]);
    const fullyReadCount = await Paper.countDocuments({ readingStage: 'Fully Read' });
    const completionRate = totalCount > 0 ? parseFloat(((fullyReadCount / totalCount) * 100).toFixed(1)) : 0;

    res.json({ totalCount, stageBreakdown, avgCitationsByDomain, completionRate, fullyReadCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/funnel', async (req, res) => {
  try {
    const stages = ['Abstract Read', 'Introduction Done', 'Methodology Done', 'Results Analyzed', 'Fully Read', 'Notes Completed'];
    const funnelData = await Promise.all(stages.map(async (stage) => {
      const count = await Paper.countDocuments({ readingStage: stage });
      return { stage, count };
    }));
    res.json(funnelData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/scatter', async (req, res) => {
  try {
    const data = await Paper.find({}, 'id title citationCount impactScore domain').sort({ citationCount: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/stacked-bar', async (req, res) => {
  try {
    const domains = ['Computer Science', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Social Sciences'];
    const stages = ['Abstract Read', 'Introduction Done', 'Methodology Done', 'Results Analyzed', 'Fully Read', 'Notes Completed'];
    const data = await Promise.all(domains.map(async (domain) => {
      const row = { domain };
      for (const stage of stages) {
        const count = await Paper.countDocuments({ domain, readingStage: stage });
        row[stage] = count;
      }
      return row;
    }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve the SPA entry point for all non-API routes
app.get('*', async (req, res) => {
  try {
    console.log(frontendDistPath);
    const html = await readFile(join(frontendDistPath, 'index.html'), 'utf-8');
    res.type('html').send(html);
  } catch (error) {
    res.status(404).send('Frontend not built. Run the frontend build first.');
  }
});

