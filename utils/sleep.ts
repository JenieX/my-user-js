async function sleep(milliSeconds: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliSeconds);
  });
}

export default sleep;
