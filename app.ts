import { serve } from "https://deno.land/std/http/server.ts";
import { acceptWebSocket, acceptable } from "https://deno.land/std/ws/mod.ts";
import { chatConnection } from './ws/chatroom.ts';

// setting up the server
const server = serve({ port: 3000 });
console.log("http://localhost:3000/");

// async forloop
for await (const req of server) {
  // serve index page
  if (req.url === '/') {
    req.respond({
      status: 200,
      body: await Deno.open('./public/index.html')
    });
  }

  // accept websocket connection
  if (req.url === '/ws') { //we specified this path in the client-side
    if (acceptable(req)) {
      acceptWebSocket({
        conn: req.conn,
        bufReader: req.r,
        bufWriter: req.w,
        headers: req.headers
      })
      .then(chatConnection);
    }
  }
}