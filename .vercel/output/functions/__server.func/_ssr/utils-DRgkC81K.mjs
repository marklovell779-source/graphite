import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-DRgkC81K.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
function downloadBlob(filename, blob) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function slugify(name) {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "part";
}
function openSketchFile() {
	document.getElementById("graphite-open")?.click();
}
var CRC_TABLE = (() => {
	const t = /* @__PURE__ */ new Uint32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
		t[n] = c >>> 0;
	}
	return t;
})();
function crc32(data) {
	let c = 4294967295;
	for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 255] ^ c >>> 8;
	return (c ^ 4294967295) >>> 0;
}
async function zipBlobs(files) {
	const encoder = new TextEncoder();
	const chunks = [];
	const central = [];
	let offset = 0;
	for (const f of files) {
		const data = new Uint8Array(await f.blob.arrayBuffer());
		const name = encoder.encode(f.name);
		const crc = crc32(data);
		const local = new Uint8Array(30 + name.length);
		const lv = new DataView(local.buffer);
		lv.setUint32(0, 67324752, true);
		lv.setUint16(4, 20, true);
		lv.setUint32(14, crc, true);
		lv.setUint32(18, data.length, true);
		lv.setUint32(22, data.length, true);
		lv.setUint16(26, name.length, true);
		local.set(name, 30);
		chunks.push(local, data);
		const cen = new Uint8Array(46 + name.length);
		const cv = new DataView(cen.buffer);
		cv.setUint32(0, 33639248, true);
		cv.setUint16(4, 20, true);
		cv.setUint16(6, 20, true);
		cv.setUint32(16, crc, true);
		cv.setUint32(20, data.length, true);
		cv.setUint32(24, data.length, true);
		cv.setUint16(28, name.length, true);
		cv.setUint32(42, offset, true);
		cen.set(name, 46);
		central.push(cen);
		offset += local.length + data.length;
	}
	const centralSize = central.reduce((n, c) => n + c.length, 0);
	const end = /* @__PURE__ */ new Uint8Array(22);
	const ev = new DataView(end.buffer);
	ev.setUint32(0, 101010256, true);
	ev.setUint16(8, files.length, true);
	ev.setUint16(10, files.length, true);
	ev.setUint32(12, centralSize, true);
	ev.setUint32(16, offset, true);
	const pieces = [
		...chunks,
		...central,
		end
	];
	let total = 0;
	for (const p of pieces) total += p.length;
	const out = new Uint8Array(total);
	let o = 0;
	for (const p of pieces) {
		out.set(p, o);
		o += p.length;
	}
	return new Blob([out.buffer], { type: "application/zip" });
}
//#endregion
export { uid as a, slugify as i, downloadBlob as n, zipBlobs as o, openSketchFile as r, cn as t };
