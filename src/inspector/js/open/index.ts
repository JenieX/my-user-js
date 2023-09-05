import getIdentifier from './get-identifier';

async function OpenDevTools(port: number, targetURL?: string): Promise<void> {
  try {
    const devtoolsFrontendURL = await getIdentifier(port, targetURL);
    window.open(`http://localhost:${port}${devtoolsFrontendURL}`);
  } catch (exception) {
    alert((exception as Error).message);
  }
}

export default OpenDevTools;
