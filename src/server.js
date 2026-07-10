import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Alexa Computindo Express API server berjalan di: http://localhost:${PORT}/api`);
  console.log(`🎨 Admin Panel UI (Dreamsrent) dapat diakses di:   http://localhost:${PORT}/admin`);
});
