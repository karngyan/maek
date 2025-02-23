## dev notes

### Local development

```bash
make up # starts all the containers that are needed like postgres, y-sweet, ollama
```

### postgres

Migration quick commands:

```bash
goose up
goose redo
goose down
```

Generating queries:

```bash
make sqlc
```

### ysweet

The auth key is supposed to be a 30 byte random base64 string. You can generate one using the following command:

```bash
openssl rand -base64 30 | pbcopy
```
