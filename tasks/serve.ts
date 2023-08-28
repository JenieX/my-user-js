import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';

const httpServer = createServer(async (request: IncomingMessage, response: ServerResponse) => {
  response.setHeader('Access-Control-Allow-Origin', '*');

  const sendErrorResponse = (message: string, statusCode: number): void => {
    response.writeHead(statusCode, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify({ error: true, message }));
    response.end();
  };

  const requestInfo = request.url!.split('?').shift()!.split('/').filter(Boolean);

  /** The name of the user script */
  const userScript = requestInfo[0]!;

  const isMapRequest = requestInfo[1] === 'map';
  const isInvalidRequest = requestInfo[2] !== undefined;

  if (isInvalidRequest || (!isMapRequest && requestInfo[1] !== undefined)) {
    sendErrorResponse('Request is not valid', 400);

    return;
  }

  if (!/^[a-z-]+$/.test(userScript)) {
    sendErrorResponse('Provided user script name would not match any', 404);

    return;
  }

  let fileRelativePath;
  if (isMapRequest) {
    fileRelativePath = `dist/${userScript}/${userScript}.raw.js.map`;
  } else {
    fileRelativePath = `dist/${userScript}/${userScript}.raw.js`;
  }

  const fileAbsolutePath = path.resolve(fileRelativePath);

  if (!fs.existsSync(fileAbsolutePath)) {
    sendErrorResponse('Provided file is not found', 404);

    return;
  }

  const fileContent = await fsp.readFile(fileAbsolutePath, 'utf-8');

  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(fileContent);
  response.end();
});

httpServer.listen(1011);
