import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ message: 'URL is required' }, { status: 400 });
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const resources = new Set<string>();

  page.on('request', (request) => {
    const requestUrl = new URL(request.url());
    resources.add(`${requestUrl.protocol}//${requestUrl.hostname}${requestUrl.port ? `:${requestUrl.port}` : ''}`);
  });

  await page.goto(url, { waitUntil: 'networkidle0' });

  const { hostname } = new URL(url);
  const outputDir = path.join(process.cwd(), 'public', 'results');

  if (!await fs.access(outputDir).then(() => true).catch(() => false)) {
    await fs.mkdir(outputDir, { recursive: true });
  }

  let filename = `${hostname}.txt`;
  let fileIndex = 1;

  while (await fs.access(path.join(outputDir, filename)).then(() => true).catch(() => false)) {
    filename = `${hostname}_${fileIndex}.txt`;
    fileIndex++;
  }

  const filePath = path.join(outputDir, filename);
  await fs.writeFile(filePath, Array.from(resources).join('\n'), 'utf-8');

  await browser.close();

  return NextResponse.json({ message: 'Resources captured', file: `/results/${filename}` });
}
