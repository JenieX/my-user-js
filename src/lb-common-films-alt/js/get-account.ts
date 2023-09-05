async function getAccount(): Promise<string> {
  const accountUsername = await GM.getValue('accountUsername');
  if (typeof accountUsername !== 'string') {
    throw new TypeError('Set your account username to activate the script');
  }

  return accountUsername;
}

export default getAccount;
