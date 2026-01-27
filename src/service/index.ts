import * as dotenv from 'dotenv';
dotenv.config();
import app from './app';

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
