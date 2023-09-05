import setPort from './set-port';

async function getPort(): Promise<number> {
  const port = await GM.getValue('port');

  if (port === undefined) {
    return setPort();
  }

  return port as number;
}

export default getPort;
