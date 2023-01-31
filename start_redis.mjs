#!/usr/bin/env zx

const shell = process.env.SHELL | "/bin/zsh";
$.shell = shell;
$.verbose = false;

const REDIS_PASSWORD = "fk3ampeHq";

try {
  const { stdout, stderr, exitCode } = await $`podman \
    run --name redis \
    -d \
    --rm \
    -p 6379:6379 \
    -e REDIS_PASSWORD="${REDIS_PASSWORD}" \
    redis \
    /bin/sh -c 'redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}'`;
  if (exitCode == 0) {
    console.log(chalk.green(stdout.trim()));
  } else {
    console.error(chalk.red(stderr.trim()));
  }
} catch (error) {
  console.error(chalk.red(error.toString().trim()));
  process.exit(1);
}
