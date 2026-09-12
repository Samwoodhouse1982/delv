/**
 * Shared Chromium launcher for the two scripts that need one.
 *
 * Normally Playwright's own download is used (`npx playwright install
 * chromium`). Set PLAYWRIGHT_CHROMIUM_EXECUTABLE to point at an existing
 * Chromium instead — useful in a container that already ships one.
 */
import { chromium } from 'playwright';

export async function launchChromium() {
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
  try {
    return await chromium.launch(executablePath ? { executablePath } : {});
  } catch (error) {
    if (/Executable doesn't exist|playwright install/.test(String(error))) {
      console.error(
        [
          '',
          'No Chromium available.',
          '',
          '  npx playwright install chromium',
          '',
          'Or point PLAYWRIGHT_CHROMIUM_EXECUTABLE at one you already have.',
          '',
        ].join('\n'),
      );
      process.exit(1);
    }
    throw error;
  }
}
