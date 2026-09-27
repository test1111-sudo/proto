import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the Agento properties prototype", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Agento — Responsive Product Prototype<\/title>/i);
  assert.match(html, /ობიექტები/);
  assert.match(html, /326 გაერთიანებული ჩანაწერი/);
  assert.match(html, /მისამართი \/ მდებარეობა/);
  assert.match(html, /ფასის სხვაობა/);
  assert.match(html, /ერთი ობიექტი ნაჩვენებია ერთხელ/);
  assert.doesNotMatch(html, /Lead Detector|ანალიტიკა/);
});

test("ships the three responsive property layouts", async () => {
  const css = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../app/globals.css", import.meta.url), "utf8"));
  assert.match(css, /property-table-head/);
  assert.match(css, /@media\(max-width:1199px\)/);
  assert.match(css, /@media\(max-width:767px\)/);
  assert.match(css, /grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css, /property-table\{grid-template-columns:1fr\}/);
});
