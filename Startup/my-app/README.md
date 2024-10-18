## Using the Dockerfile
```
podman build -t planning-poker .
```

```
podman run --name planning-poker-container --network host planning-poker
```
the --network flag is so the docker container can have access to the host's IP in order to display it for the host to copy and paste for others to join.  

This creates a planning-poker-container from the planning-poker image that can be run.