import { $, waitForImageLoad } from '../../helpers';

async function transformImage(img: HTMLImageElement): Promise<void> {
  await waitForImageLoad(img);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const dataUrl = canvas.toDataURL('image/png');

  img.setAttribute('src', dataUrl);

  await waitForImageLoad(img);
}

async function main(): Promise<void> {
  if (!window.location.href.includes('?defence=2')) {
    return;
  }

  const img = $<HTMLImageElement>('img[src^="/threat_captcha.php"]');

  await transformImage(img);

  const result = await window.Tesseract.recognize(img);
  const captchaSolution = result.data.text.trim();

  const inputElement = $<HTMLInputElement>('#solve_string');
  inputElement.setAttribute('value', captchaSolution);

  $('#button_submit').click();
}

main().catch((exception) => console.error(exception));
