import chalk from 'chalk';

const pink = chalk.rgb(211, 0, 155).underline.bold;
const pale = chalk.rgb(51, 51, 51).underline.bold;
const blue = chalk.rgb(0, 187, 211).bold;
const purple = chalk.rgb(119, 0, 199);
const green = chalk.rgb(84, 237, 145);

export function userScriptLogger(userScript: string, autoTriggered?: true): void {
  const style = autoTriggered === true ? pale : pink;
  console.log(style(userScript));
}

export function startLogger(taskName: string): void {
  let statement = '';

  statement += 'Starting ';
  statement += blue(taskName);
  statement += '...';

  console.log(statement);
}

export function finishLogger(taskName: string, timeDifference: number): void {
  const parts: string[] = [];

  parts.push(
    'Finished',
    blue(taskName),
    'after',
    purple(`${timeDifference} ms`),
  );

  console.log(...parts);
}

export function watcherLogger(userScripts: string[]): void {
  const parts: string[] = [];

  parts.push(
    'Starting ',
    blue('watchTask'),
    ' for:',
    '\n',
  );

  for (const userScript of userScripts) {
    parts.push(
      '\n  • ',
      green(userScript),
    );
  }

  parts.push('\n');

  console.log(parts.join(''));
}
