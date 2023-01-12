#!/usr/bin/env zx

import { getVersion, getNamespace } from "./scripts/utils.mjs";
import { bump, validateBumpLevel } from "./scripts/npm.mjs";
import { build_image, tag_image, push_image } from "./scripts/container.mjs";

const shell = process.env.SHELL | "/bin/zsh";
$.shell = shell;
$.verbose = false;

const project = "oci_oke_websocket";
const namespace = await getNamespace();

const component = await question("What component to release?[client,server]: ");

if (!["client", "server"].includes(component)) {
  console.error(chalk.red("Invalid component, type 'client' or 'server'."));
  process.exit(1);
}

switch (component) {
  case "client":
    await release_client();
    break;
  case "server":
    await release_server();
    break;
  default:
    console.log("Nothing to do");
    process.exit(0);
    break;
}

async function release_client() {
  await cd("client");
  const currentVersion = await getVersion();
  let levelAnswer = await question(
    "Release level [major,minor,patch] (patch default): "
  );
  const level = await validateBumpLevel(levelAnswer || "patch");
  const newVersion = await bump(level);
  console.log(`Client bumped from ${currentVersion} to ${newVersion}`);
  const image_name = `${project}/client`;
  await build_image(`localhost/${image_name}`, newVersion);
  const local_image = `localhost/${image_name}:${newVersion}`;
  const remote_image = `fra.ocir.io/${namespace}/${image_name}:${newVersion}`;
  await tag_image(local_image, remote_image);
  await push_image(remote_image);
  await cd("..");
}

async function release_server() {
  await cd("server");
  const currentVersion = await getVersion();
  let levelAnswer = await question(
    "Release level [major,minor,patch] (patch default): "
  );
  const level = await validateBumpLevel(levelAnswer || "patch");
  const newVersion = await bump(level);
  console.log(`Server bumped from ${currentVersion} to ${newVersion}`);
  const image_name = `${project}/server`;
  await build_image(`localhost/${image_name}`, newVersion);
  const local_image = `localhost/${image_name}:${newVersion}`;
  const remote_image = `fra.ocir.io/${namespace}/${image_name}:${newVersion}`;
  await tag_image(local_image, remote_image);
  await push_image(remote_image);
  await cd("..");
}
