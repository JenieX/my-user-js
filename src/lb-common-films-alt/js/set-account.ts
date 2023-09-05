import { alert, prompt, fish } from '@jeniex/utils/browser';

async function checkAccount(username: string): Promise<boolean> {
  try {
    await fish.text(`https://letterboxd.com/${username}/`);
  } catch {
    return false;
  }

  return true;
}

async function setAccount(): Promise<void> {
  const username = prompt('Provide your account username, and make sure it is correct.');

  if (username === null || username === '') {
    alert('Invalid input');

    return;
  }

  const isValidAccount = await checkAccount(username);
  if (isValidAccount === false) {
    alert('Invalid account username');

    return;
  }

  await GM.setValue('accountUsername', username);

  alert('Account username was set successfully!\n\nThe script will be active on supported pages now.');
}

export default setAccount;
