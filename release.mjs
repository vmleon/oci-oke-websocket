#!/usr/bin/env zx

import { getVersion, getNamespace } from "./scripts/utils.mjs";
import { bump, validateBumpLevel } from "./scripts/npm.mjs";
import { build_image, tagImage, pushImage } from "./scripts/container.mjs";

const shell = process.env.SHELL | "/bin/zsh";
$.shell = shell;
$.verbose = false;

const project = "oci_oke_websocket";
const namespace = await getNamespace();

await release_server();

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
  await tagImage(local_image, remote_image);
  await pushImage(remote_image);
  await cd("..");
}
