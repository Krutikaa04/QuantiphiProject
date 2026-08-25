/**
 * Server entry point. Boots the Express app and starts listening.
 */

import { createApp } from './app.js';
import { PORT } from './config/constants.js';

const app = createApp();

app.listen(PORT, () => {
  console.log(`Subscription Tracker API listening on http://localhost:${PORT}`);
});
