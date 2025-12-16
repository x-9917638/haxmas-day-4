# haxmas-day-4

API for sharing Christmas messages, written in TypeScript using Hono and SQL :3

**New message**
- Route: `/api/messages/new`
- Method: POST
- Accepts: `application/json`
  - Fields: 
    - message: string
    - author: string (optional)
    - recipient: string
- Returns: id (number)
e.g.
```sh
curl -X POST http://localhost:3000/api/messages/new \
  -H "content-type: application/json" \
  -d '{"message":"Merry Christmas and a Happy New Year!", "author":"Some1","recipient":"Bob"}'
```

**Read message**
- Route: `api/messages/<id>/<recipient name>`
- Method: GET
- Returns: `application/json`
  - Fields:
    - message: string
    - from: string (optional)
e.g. 
```sh
curl http://localhost:3000/api/messages/1/Bob
```

**Update message**
- Route: `/api/messages/update/<id>/<recipient name>`
- Method: POST
- Accepts: `application/json`
  - Fields: 
    - message: string
    - recipient: string
- Returns: `application/json`
  - Fields:
    - changes: number
e.g.
```sh
curl -X POST http://localhost:3000/api/messages/update/1 \
  -H "content-type: application/json" \
  -d '{"message":"Oops, Christmas passed, but Happy New Year!", "recipient":"Bob"}'
```
