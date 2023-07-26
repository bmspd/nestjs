module.exports = {
  // this will check Typescript files
  '**/*.(ts)': () => 'tsc --noEmit',

  // This will lint and format TypeScript and JavaScript files
  '**/*.(ts|js)': (filenames) => [
    `eslint --max-warnings=0 --fix ${filenames.join(' ')}`,
    `prettier --write ${filenames.join(' ')}`,
  ],

  // this will Format MarkDown and JSON
  '**/*.(md|json)': (filenames) => `prettier --write ${filenames.join(' ')}`,
};
