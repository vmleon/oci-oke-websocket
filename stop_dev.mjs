#!/usr/bin/env zx

const shell = process.env.SHELL | "/bin/zsh";
$.shell = shell;
$.verbose = false;

await $`podman stop client0 server0`;
