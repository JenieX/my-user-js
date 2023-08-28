import { DebugEntry } from '../types';
import { fishX } from '../../../../helpers';

async function getIdentifier(port: number, targetURL?: string): Promise<string> {
  const debugEntries = await fishX.json(`http://localhost:${port}/json`) as DebugEntry[];

  const matchedEntries = debugEntries.filter(({ url }) => {
    return url === (targetURL ?? window.location.href);
  });

  if (matchedEntries.length === 1) {
    return matchedEntries[0]!.devtoolsFrontendUrl;
  }

  throw new Error('There are multiple/no pages by the provided URL!');
}

export default getIdentifier;
