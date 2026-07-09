# Message Type Definition

## 1. Basic Rules

All messages use a unified type identifier.

Format:

```
REQUEST / RESPONSE / EVENT
```

## 2. Authentication

|Type|Description|
|-|-|
|LOGIN_REQUEST|Client login request|
|LOGIN_RESPONSE|Login response|
|LOGOUT_REQUEST|Logout request|

## 3. Connection

|Type|Description|
|-|-|
|HEARTBEAT_REQUEST|Heartbeat request|
|HEARTBEAT_RESPONSE|Heartbeat response|
|RECONNECT_REQUEST|Reconnect request|

## 4. Chat

|Type|Description|
|-|-|
|CHAT_MESSAGE|Private message|
|GROUP_MESSAGE|Group message|
|MESSAGE_ACK|Message acknowledgement|

## 5. Pet

|Type|Description|
|-|-|
|PET_SYNC|Pet state synchronization|
|PET_ACTION|Pet action event|

## 6. User Status

|Type|Description|
|-|-|
|USER_ONLINE|Online event|
|USER_OFFLINE|Offline event|
