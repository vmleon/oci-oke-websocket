#!/usr/bin/env zx

import { createSelfSignedCert } from "./scripts/tls.mjs";

const shell = process.env.SHELL | "/bin/zsh";
$.shell = shell;
$.verbose = false;

await $`mkdir -p deploy/base/ingress/.certs`;
await createSelfSignedCert("deploy/base/ingress/.certs");
