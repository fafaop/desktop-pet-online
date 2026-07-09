# Common

Shared modules between client and server.

## Responsibilities

- Protocol definition
- Message model
- Common constants
- Error codes

## Planned Structure

```
common/
├── protocol/
├── model/
├── error-code/
└── constants/
```

## Protocol

Initial format:

```
JSON over WebSocket
```

Future:

```
Protobuf
```
