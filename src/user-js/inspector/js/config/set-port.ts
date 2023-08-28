async function setPort(): Promise<number> {
  const port = Number(prompt('Provide your browser debugging port:'));

  console.warn({ port });

  if (Number.isNaN(port) || port < 1000 || port > 9999) {
    console.error('Invalid port!');
    throw new Error('Invalid port!');
  } else {
    console.log('LOL');
  }

  await GM.setValue('port', port);

  return port;
}

export default setPort;
