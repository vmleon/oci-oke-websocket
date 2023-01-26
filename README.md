# OCI OKE WebSocket Example

## Deploy

### Requirements

- OCI Kubernetes Engine
- `kubectl` configured

xxx

## Build and release

### Requirements

- [Podman](https://podman.io/) or [Docker](https://www.docker.com/get-started/)
- [zx](https://github.com/google/zx)
- [OCI CLI](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm) installed and configured
- OCI [Auth Token](https://docs.oracle.com/en-us/iaas/Content/Registry/Tasks/registrygettingauthtoken.htm) for Oracle Cloud Container Registry

Run the check script to make sure you fulfil all the requirements.

```bash
zx check.mjs
```

Generate key and cert for Load Balancer TLS termination.

```bash
zx gen_certs.mjs
```