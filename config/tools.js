/*eslint-disable no-var, vars-on-top, no-console */
const exec = require('child_process').exec;
const chalk = require('chalk');

const args = process.argv.slice(2);

if (!args[0]) {
  console.log(`Valid arguments:
  • docs (rebuild documentation)
  • update (if package.json has changed run \`npm update\`)
  • commits (has new remote commits)`
  );
}

if (args[0] === 'update') {
  exec('git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD', (err, stdout) => {
    if (err) {
      throw new Error(err);
    }

    if (stdout.match('package.json')) {
      exec('npm update').stdout.pipe(process.stdout);
    }
  });
}

if (args[0] === 'commits') {
  exec('git remote -v update', errRemote => {
    if (errRemote) {
      throw new Error(errRemote);
    }

    const local = new Promise((resolve, reject) => {
      exec('git rev-parse @', (err, stdout) => {
        if (err) {
          return reject(err);
        }

        return resolve(stdout);
      });
    });

    const remote = new Promise((resolve, reject) => {
      exec('git rev-parse @{u}', (err, stdout) => {
        if (err) {
          return reject(err);
        }

        return resolve(stdout);
      });
    });

    const base = new Promise((resolve, reject) => {
      exec('git merge-base @ @{u}', (err, stdout) => {
        if (err) {
          return reject(err);
        }
        return resolve(stdout);
      });
    });

    Promise.all([local, remote, base])
      .then(values => {
        const [$local, $remote, $base] = values;

        if ($local === $remote) {
          console.log(chalk.green('✔ Repo is up-to-date!'));
        } else if ($local === $base) {
          console.error(chalk.red('⊘ Error: You need to pull, there are new commits.'));
          process.exit(1);
        }
      })
      .catch(err => {
        console.log(chalk.red('⊘ Error: Commits failed'), err);
      });
  });
}
