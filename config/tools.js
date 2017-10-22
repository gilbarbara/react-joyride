/*eslint-disable no-var, vars-on-top, no-console */
const path = require('path');
const { exec } = require('child_process');
const chalk = require('chalk');
const ghPages = require('gh-pages');

const args = process.argv.slice(2);

if (!args[0]) {
  console.log(`Valid arguments:
  • publish (push to github)
  • deploy (build & publish)
  • update (if package.json has changed run \`npm update\`)
  • commits (has new remote commits)
  `);
}

function getCommit() {
  console.log(chalk.blue('Getting the last commit...'));
  return new Promise((resolve, reject) => {
    exec('git log -1 --pretty=%s && git log -1 --pretty=%b', (err, stdout) => {
      if (err) {
        return reject(err);
      }

      const parts = stdout.replace('\n\n', '').split('\n');

      return resolve(`${(parts[0] ? parts[0] : 'Auto-generated commit')} ${new Date().toISOString()}`);
    });
  });
}

function publish() {
  console.log(chalk.blue('Publishing...'));
  getCommit()
    .then(commit => {
      exec('cp README.md dist/', errCopy => {
        if (errCopy) {
          console.log(errCopy);
          return;
        }
        ghPages.publish(path.join(__dirname, '../dist'), {
          message: commit,
        }, error => {
          if (error) {
            console.log(chalk.red('Something went wrong...', error));
            return;
          }

          console.log(chalk.green('Published'));
        });
      });
    });
}

if (args[0] === 'publish') {
  publish();
}

if (args[0] === 'deploy') {
  const start = Date.now();
  console.log(chalk.green('Bundling...'));
  exec('npm run build:pages', errBuild => {
    if (errBuild) {
      console.log(chalk.red(errBuild));
      process.exit(1);
    }

    console.log(`Bundled in ${(Date.now() - start) / 1000} s`);

    publish();
  });
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
