#!/usr/bin/env zx

import { getVersion, getNamespace } from "./scripts/utils.mjs";

const shell = process.env.SHELL | "/bin/zsh";
$.shell = shell;
$.verbose = false;

const project = "oci_oke_websocket";
const namespace = await getNamespace();

const serverImageName = `${project}/server`;
await cd("server");
const serverVersion = await getVersion();
await cd("..");
const serverRemoteImage = `fra.ocir.io/${namespace}/${serverImageName}:${serverVersion}`;
await $`podman run -d --rm --name server0 -p3000:3000 ${serverRemoteImage}`;

const clientImageName = `${project}/client`;
await cd("client");
const clientVersion = await getVersion();
await cd("..");
const clientRemoteImage = `fra.ocir.io/${namespace}/${clientImageName}:${clientVersion}`;
await $`podman run -d --rm --name client0 ${clientRemoteImage}`;
