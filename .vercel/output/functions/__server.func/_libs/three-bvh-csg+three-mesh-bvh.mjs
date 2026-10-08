import { n as __exportAll } from "../_runtime.mjs";
import { D as Vector4, E as Vector3, S as Sphere, T as Vector2, _ as Mesh, b as Ray, c as BufferAttribute, g as Matrix4, h as Matrix3, m as Line3, o as Box3, w as Triangle, y as Plane } from "./@react-three/drei+[...].mjs";
//#region node_modules/three-mesh-bvh/src/core/Constants.js
var TRIANGLE_INTERSECT_COST = 1.25;
var IS_LEAFNODE_FLAG = 65535;
var FLOAT32_EPSILON = Math.pow(2, -24);
var SKIP_GENERATION = Symbol("SKIP_GENERATION");
//#endregion
//#region node_modules/three-mesh-bvh/src/core/build/geometryUtils.js
function getVertexCount$1(geo) {
	return geo.index ? geo.index.count : geo.attributes.position.count;
}
function getTriCount$1(geo) {
	return getVertexCount$1(geo) / 3;
}
function getIndexArray$1(vertexCount, BufferConstructor = ArrayBuffer) {
	if (vertexCount > 65535) return new Uint32Array(new BufferConstructor(4 * vertexCount));
	else return new Uint16Array(new BufferConstructor(2 * vertexCount));
}
function ensureIndex$1(geo, options) {
	if (!geo.index) {
		const vertexCount = geo.attributes.position.count;
		const index = getIndexArray$1(vertexCount, options.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer);
		geo.setIndex(new BufferAttribute(index, 1));
		for (let i = 0; i < vertexCount; i++) index[i] = i;
	}
}
function getFullGeometryRange(geo, range) {
	const triCount = getTriCount$1(geo);
	const drawRange = range ? range : geo.drawRange;
	const start = drawRange.start / 3;
	const end = (drawRange.start + drawRange.count) / 3;
	const offset = Math.max(0, start);
	const count = Math.min(triCount, end) - offset;
	return [{
		offset: Math.floor(offset),
		count: Math.floor(count)
	}];
}
function getRootIndexRanges(geo, range) {
	if (!geo.groups || !geo.groups.length) return getFullGeometryRange(geo, range);
	const ranges = [];
	const rangeBoundaries = /* @__PURE__ */ new Set();
	const drawRange = range ? range : geo.drawRange;
	const drawRangeStart = drawRange.start / 3;
	const drawRangeEnd = (drawRange.start + drawRange.count) / 3;
	for (const group of geo.groups) {
		const groupStart = group.start / 3;
		const groupEnd = (group.start + group.count) / 3;
		rangeBoundaries.add(Math.max(drawRangeStart, groupStart));
		rangeBoundaries.add(Math.min(drawRangeEnd, groupEnd));
	}
	const sortedBoundaries = Array.from(rangeBoundaries.values()).sort((a, b) => a - b);
	for (let i = 0; i < sortedBoundaries.length - 1; i++) {
		const start = sortedBoundaries[i];
		const end = sortedBoundaries[i + 1];
		ranges.push({
			offset: Math.floor(start),
			count: Math.floor(end - start)
		});
	}
	return ranges;
}
function hasGroupGaps(geometry, range) {
	const vertexCount = getTriCount$1(geometry);
	const groups = getRootIndexRanges(geometry, range).sort((a, b) => a.offset - b.offset);
	const finalGroup = groups[groups.length - 1];
	finalGroup.count = Math.min(vertexCount - finalGroup.offset, finalGroup.count);
	let total = 0;
	groups.forEach(({ count }) => total += count);
	return vertexCount !== total;
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/build/computeBoundsUtils.js
function getBounds(triangleBounds, offset, count, target, centroidTarget) {
	let minx = Infinity;
	let miny = Infinity;
	let minz = Infinity;
	let maxx = -Infinity;
	let maxy = -Infinity;
	let maxz = -Infinity;
	let cminx = Infinity;
	let cminy = Infinity;
	let cminz = Infinity;
	let cmaxx = -Infinity;
	let cmaxy = -Infinity;
	let cmaxz = -Infinity;
	for (let i = offset * 6, end = (offset + count) * 6; i < end; i += 6) {
		const cx = triangleBounds[i + 0];
		const hx = triangleBounds[i + 1];
		const lx = cx - hx;
		const rx = cx + hx;
		if (lx < minx) minx = lx;
		if (rx > maxx) maxx = rx;
		if (cx < cminx) cminx = cx;
		if (cx > cmaxx) cmaxx = cx;
		const cy = triangleBounds[i + 2];
		const hy = triangleBounds[i + 3];
		const ly = cy - hy;
		const ry = cy + hy;
		if (ly < miny) miny = ly;
		if (ry > maxy) maxy = ry;
		if (cy < cminy) cminy = cy;
		if (cy > cmaxy) cmaxy = cy;
		const cz = triangleBounds[i + 4];
		const hz = triangleBounds[i + 5];
		const lz = cz - hz;
		const rz = cz + hz;
		if (lz < minz) minz = lz;
		if (rz > maxz) maxz = rz;
		if (cz < cminz) cminz = cz;
		if (cz > cmaxz) cmaxz = cz;
	}
	target[0] = minx;
	target[1] = miny;
	target[2] = minz;
	target[3] = maxx;
	target[4] = maxy;
	target[5] = maxz;
	centroidTarget[0] = cminx;
	centroidTarget[1] = cminy;
	centroidTarget[2] = cminz;
	centroidTarget[3] = cmaxx;
	centroidTarget[4] = cmaxy;
	centroidTarget[5] = cmaxz;
}
function computeTriangleBounds(geo, target = null, offset = null, count = null) {
	const posAttr = geo.attributes.position;
	const index = geo.index ? geo.index.array : null;
	const triCount = getTriCount$1(geo);
	const normalized = posAttr.normalized;
	let triangleBounds;
	if (target === null) {
		triangleBounds = new Float32Array(triCount * 6);
		offset = 0;
		count = triCount;
	} else {
		triangleBounds = target;
		offset = offset || 0;
		count = count || triCount;
	}
	const posArr = posAttr.array;
	const bufferOffset = posAttr.offset || 0;
	let stride = 3;
	if (posAttr.isInterleavedBufferAttribute) stride = posAttr.data.stride;
	const getters = [
		"getX",
		"getY",
		"getZ"
	];
	for (let tri = offset; tri < offset + count; tri++) {
		const tri3 = tri * 3;
		const tri6 = tri * 6;
		let ai = tri3 + 0;
		let bi = tri3 + 1;
		let ci = tri3 + 2;
		if (index) {
			ai = index[ai];
			bi = index[bi];
			ci = index[ci];
		}
		if (!normalized) {
			ai = ai * stride + bufferOffset;
			bi = bi * stride + bufferOffset;
			ci = ci * stride + bufferOffset;
		}
		for (let el = 0; el < 3; el++) {
			let a, b, c;
			if (normalized) {
				a = posAttr[getters[el]](ai);
				b = posAttr[getters[el]](bi);
				c = posAttr[getters[el]](ci);
			} else {
				a = posArr[ai + el];
				b = posArr[bi + el];
				c = posArr[ci + el];
			}
			let min = a;
			if (b < min) min = b;
			if (c < min) min = c;
			let max = a;
			if (b > max) max = b;
			if (c > max) max = c;
			const halfExtents = (max - min) / 2;
			const el2 = el * 2;
			triangleBounds[tri6 + el2 + 0] = min + halfExtents;
			triangleBounds[tri6 + el2 + 1] = halfExtents + (Math.abs(min) + halfExtents) * FLOAT32_EPSILON;
		}
	}
	return triangleBounds;
}
//#endregion
//#region node_modules/three-mesh-bvh/src/utils/ArrayBoxUtilities.js
function arrayToBox(nodeIndex32, array, target) {
	target.min.x = array[nodeIndex32];
	target.min.y = array[nodeIndex32 + 1];
	target.min.z = array[nodeIndex32 + 2];
	target.max.x = array[nodeIndex32 + 3];
	target.max.y = array[nodeIndex32 + 4];
	target.max.z = array[nodeIndex32 + 5];
	return target;
}
function getLongestEdgeIndex(bounds) {
	let splitDimIdx = -1;
	let splitDist = -Infinity;
	for (let i = 0; i < 3; i++) {
		const dist = bounds[i + 3] - bounds[i];
		if (dist > splitDist) {
			splitDist = dist;
			splitDimIdx = i;
		}
	}
	return splitDimIdx;
}
function copyBounds(source, target) {
	target.set(source);
}
function unionBounds(a, b, target) {
	let aVal, bVal;
	for (let d = 0; d < 3; d++) {
		const d3 = d + 3;
		aVal = a[d];
		bVal = b[d];
		target[d] = aVal < bVal ? aVal : bVal;
		aVal = a[d3];
		bVal = b[d3];
		target[d3] = aVal > bVal ? aVal : bVal;
	}
}
function expandByTriangleBounds(startIndex, triangleBounds, bounds) {
	for (let d = 0; d < 3; d++) {
		const tCenter = triangleBounds[startIndex + 2 * d];
		const tHalf = triangleBounds[startIndex + 2 * d + 1];
		const tMin = tCenter - tHalf;
		const tMax = tCenter + tHalf;
		if (tMin < bounds[d]) bounds[d] = tMin;
		if (tMax > bounds[d + 3]) bounds[d + 3] = tMax;
	}
}
function computeSurfaceArea(bounds) {
	const d0 = bounds[3] - bounds[0];
	const d1 = bounds[4] - bounds[1];
	const d2 = bounds[5] - bounds[2];
	return 2 * (d0 * d1 + d1 * d2 + d2 * d0);
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/build/splitUtils.js
var BIN_COUNT = 32;
var binsSort = (a, b) => a.candidate - b.candidate;
var sahBins = new Array(BIN_COUNT).fill().map(() => {
	return {
		count: 0,
		bounds: /* @__PURE__ */ new Float32Array(6),
		rightCacheBounds: /* @__PURE__ */ new Float32Array(6),
		leftCacheBounds: /* @__PURE__ */ new Float32Array(6),
		candidate: 0
	};
});
var leftBounds = /* @__PURE__ */ new Float32Array(6);
function getOptimalSplit(nodeBoundingData, centroidBoundingData, triangleBounds, offset, count, strategy) {
	let axis = -1;
	let pos = 0;
	if (strategy === 0) {
		axis = getLongestEdgeIndex(centroidBoundingData);
		if (axis !== -1) pos = (centroidBoundingData[axis] + centroidBoundingData[axis + 3]) / 2;
	} else if (strategy === 1) {
		axis = getLongestEdgeIndex(nodeBoundingData);
		if (axis !== -1) pos = getAverage(triangleBounds, offset, count, axis);
	} else if (strategy === 2) {
		const rootSurfaceArea = computeSurfaceArea(nodeBoundingData);
		let bestCost = TRIANGLE_INTERSECT_COST * count;
		const cStart = offset * 6;
		const cEnd = (offset + count) * 6;
		for (let a = 0; a < 3; a++) {
			const axisLeft = centroidBoundingData[a];
			const binWidth = (centroidBoundingData[a + 3] - axisLeft) / BIN_COUNT;
			if (count < BIN_COUNT / 4) {
				const truncatedBins = [...sahBins];
				truncatedBins.length = count;
				let b = 0;
				for (let c = cStart; c < cEnd; c += 6, b++) {
					const bin = truncatedBins[b];
					bin.candidate = triangleBounds[c + 2 * a];
					bin.count = 0;
					const { bounds, leftCacheBounds, rightCacheBounds } = bin;
					for (let d = 0; d < 3; d++) {
						rightCacheBounds[d] = Infinity;
						rightCacheBounds[d + 3] = -Infinity;
						leftCacheBounds[d] = Infinity;
						leftCacheBounds[d + 3] = -Infinity;
						bounds[d] = Infinity;
						bounds[d + 3] = -Infinity;
					}
					expandByTriangleBounds(c, triangleBounds, bounds);
				}
				truncatedBins.sort(binsSort);
				let splitCount = count;
				for (let bi = 0; bi < splitCount; bi++) {
					const bin = truncatedBins[bi];
					while (bi + 1 < splitCount && truncatedBins[bi + 1].candidate === bin.candidate) {
						truncatedBins.splice(bi + 1, 1);
						splitCount--;
					}
				}
				for (let c = cStart; c < cEnd; c += 6) {
					const center = triangleBounds[c + 2 * a];
					for (let bi = 0; bi < splitCount; bi++) {
						const bin = truncatedBins[bi];
						if (center >= bin.candidate) expandByTriangleBounds(c, triangleBounds, bin.rightCacheBounds);
						else {
							expandByTriangleBounds(c, triangleBounds, bin.leftCacheBounds);
							bin.count++;
						}
					}
				}
				for (let bi = 0; bi < splitCount; bi++) {
					const bin = truncatedBins[bi];
					const leftCount = bin.count;
					const rightCount = count - bin.count;
					const leftBounds = bin.leftCacheBounds;
					const rightBounds = bin.rightCacheBounds;
					let leftProb = 0;
					if (leftCount !== 0) leftProb = computeSurfaceArea(leftBounds) / rootSurfaceArea;
					let rightProb = 0;
					if (rightCount !== 0) rightProb = computeSurfaceArea(rightBounds) / rootSurfaceArea;
					const cost = 1 + TRIANGLE_INTERSECT_COST * (leftProb * leftCount + rightProb * rightCount);
					if (cost < bestCost) {
						axis = a;
						bestCost = cost;
						pos = bin.candidate;
					}
				}
			} else {
				for (let i = 0; i < BIN_COUNT; i++) {
					const bin = sahBins[i];
					bin.count = 0;
					bin.candidate = axisLeft + binWidth + i * binWidth;
					const bounds = bin.bounds;
					for (let d = 0; d < 3; d++) {
						bounds[d] = Infinity;
						bounds[d + 3] = -Infinity;
					}
				}
				for (let c = cStart; c < cEnd; c += 6) {
					let binIndex = ~~((triangleBounds[c + 2 * a] - axisLeft) / binWidth);
					if (binIndex >= BIN_COUNT) binIndex = 31;
					const bin = sahBins[binIndex];
					bin.count++;
					expandByTriangleBounds(c, triangleBounds, bin.bounds);
				}
				const lastBin = sahBins[31];
				copyBounds(lastBin.bounds, lastBin.rightCacheBounds);
				for (let i = 30; i >= 0; i--) {
					const bin = sahBins[i];
					const nextBin = sahBins[i + 1];
					unionBounds(bin.bounds, nextBin.rightCacheBounds, bin.rightCacheBounds);
				}
				let leftCount = 0;
				for (let i = 0; i < 31; i++) {
					const bin = sahBins[i];
					const binCount = bin.count;
					const bounds = bin.bounds;
					const rightBounds = sahBins[i + 1].rightCacheBounds;
					if (binCount !== 0) {
						if (leftCount === 0) copyBounds(bounds, leftBounds);
						else unionBounds(bounds, leftBounds, leftBounds);
					}
					leftCount += binCount;
					let leftProb = 0;
					let rightProb = 0;
					if (leftCount !== 0) leftProb = computeSurfaceArea(leftBounds) / rootSurfaceArea;
					const rightCount = count - leftCount;
					if (rightCount !== 0) rightProb = computeSurfaceArea(rightBounds) / rootSurfaceArea;
					const cost = 1 + TRIANGLE_INTERSECT_COST * (leftProb * leftCount + rightProb * rightCount);
					if (cost < bestCost) {
						axis = a;
						bestCost = cost;
						pos = bin.candidate;
					}
				}
			}
		}
	} else console.warn(`MeshBVH: Invalid build strategy value ${strategy} used.`);
	return {
		axis,
		pos
	};
}
function getAverage(triangleBounds, offset, count, axis) {
	let avg = 0;
	for (let i = offset, end = offset + count; i < end; i++) avg += triangleBounds[i * 6 + axis * 2];
	return avg / count;
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/MeshBVHNode.js
var MeshBVHNode = class {
	constructor() {
		this.boundingData = /* @__PURE__ */ new Float32Array(6);
	}
};
//#endregion
//#region node_modules/three-mesh-bvh/src/core/build/sortUtils.generated.js
function partition(indirectBuffer, index, triangleBounds, offset, count, split) {
	let left = offset;
	let right = offset + count - 1;
	const pos = split.pos;
	const axisOffset = split.axis * 2;
	while (true) {
		while (left <= right && triangleBounds[left * 6 + axisOffset] < pos) left++;
		while (left <= right && triangleBounds[right * 6 + axisOffset] >= pos) right--;
		if (left < right) {
			for (let i = 0; i < 3; i++) {
				let t0 = index[left * 3 + i];
				index[left * 3 + i] = index[right * 3 + i];
				index[right * 3 + i] = t0;
			}
			for (let i = 0; i < 6; i++) {
				let tb = triangleBounds[left * 6 + i];
				triangleBounds[left * 6 + i] = triangleBounds[right * 6 + i];
				triangleBounds[right * 6 + i] = tb;
			}
			left++;
			right--;
		} else return left;
	}
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/build/sortUtils_indirect.generated.js
function partition_indirect(indirectBuffer, index, triangleBounds, offset, count, split) {
	let left = offset;
	let right = offset + count - 1;
	const pos = split.pos;
	const axisOffset = split.axis * 2;
	while (true) {
		while (left <= right && triangleBounds[left * 6 + axisOffset] < pos) left++;
		while (left <= right && triangleBounds[right * 6 + axisOffset] >= pos) right--;
		if (left < right) {
			let t = indirectBuffer[left];
			indirectBuffer[left] = indirectBuffer[right];
			indirectBuffer[right] = t;
			for (let i = 0; i < 6; i++) {
				let tb = triangleBounds[left * 6 + i];
				triangleBounds[left * 6 + i] = triangleBounds[right * 6 + i];
				triangleBounds[right * 6 + i] = tb;
			}
			left++;
			right--;
		} else return left;
	}
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/utils/nodeBufferUtils.js
function IS_LEAF(n16, uint16Array) {
	return uint16Array[n16 + 15] === 65535;
}
function OFFSET(n32, uint32Array) {
	return uint32Array[n32 + 6];
}
function COUNT(n16, uint16Array) {
	return uint16Array[n16 + 14];
}
function LEFT_NODE(n32) {
	return n32 + 8;
}
function RIGHT_NODE(n32, uint32Array) {
	return uint32Array[n32 + 6];
}
function SPLIT_AXIS(n32, uint32Array) {
	return uint32Array[n32 + 7];
}
function BOUNDING_DATA_INDEX(n32) {
	return n32;
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/build/buildUtils.js
var float32Array;
var uint32Array;
var uint16Array;
var uint8Array;
var MAX_POINTER = Math.pow(2, 32);
function countNodes(node) {
	if ("count" in node) return 1;
	else return 1 + countNodes(node.left) + countNodes(node.right);
}
function populateBuffer(byteOffset, node, buffer) {
	float32Array = new Float32Array(buffer);
	uint32Array = new Uint32Array(buffer);
	uint16Array = new Uint16Array(buffer);
	uint8Array = new Uint8Array(buffer);
	return _populateBuffer(byteOffset, node);
}
function _populateBuffer(byteOffset, node) {
	const stride4Offset = byteOffset / 4;
	const stride2Offset = byteOffset / 2;
	const isLeaf = "count" in node;
	const boundingData = node.boundingData;
	for (let i = 0; i < 6; i++) float32Array[stride4Offset + i] = boundingData[i];
	if (isLeaf) {
		if (node.buffer) {
			const buffer = node.buffer;
			uint8Array.set(new Uint8Array(buffer), byteOffset);
			for (let offset = byteOffset, l = byteOffset + buffer.byteLength; offset < l; offset += 32) if (!IS_LEAF(offset / 2, uint16Array)) uint32Array[offset / 4 + 6] += stride4Offset;
			return byteOffset + buffer.byteLength;
		} else {
			const offset = node.offset;
			const count = node.count;
			uint32Array[stride4Offset + 6] = offset;
			uint16Array[stride2Offset + 14] = count;
			uint16Array[stride2Offset + 15] = IS_LEAFNODE_FLAG;
			return byteOffset + 32;
		}
	} else {
		const left = node.left;
		const right = node.right;
		const splitAxis = node.splitAxis;
		let nextUnusedPointer;
		nextUnusedPointer = _populateBuffer(byteOffset + 32, left);
		if (nextUnusedPointer / 4 > MAX_POINTER) throw new Error("MeshBVH: Cannot store child pointer greater than 32 bits.");
		uint32Array[stride4Offset + 6] = nextUnusedPointer / 4;
		nextUnusedPointer = _populateBuffer(nextUnusedPointer, right);
		uint32Array[stride4Offset + 7] = splitAxis;
		return nextUnusedPointer;
	}
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/build/buildTree.js
function generateIndirectBuffer(geometry, useSharedArrayBuffer) {
	const triCount = (geometry.index ? geometry.index.count : geometry.attributes.position.count) / 3;
	const useUint32 = triCount > 2 ** 16;
	const byteCount = useUint32 ? 4 : 2;
	const buffer = useSharedArrayBuffer ? new SharedArrayBuffer(triCount * byteCount) : new ArrayBuffer(triCount * byteCount);
	const indirectBuffer = useUint32 ? new Uint32Array(buffer) : new Uint16Array(buffer);
	for (let i = 0, l = indirectBuffer.length; i < l; i++) indirectBuffer[i] = i;
	return indirectBuffer;
}
function buildTree(bvh, triangleBounds, offset, count, options) {
	const { maxDepth, verbose, maxLeafTris, strategy, onProgress, indirect } = options;
	const indirectBuffer = bvh._indirectBuffer;
	const geometry = bvh.geometry;
	const indexArray = geometry.index ? geometry.index.array : null;
	const partionFunc = indirect ? partition_indirect : partition;
	const totalTriangles = getTriCount$1(geometry);
	const cacheCentroidBoundingData = /* @__PURE__ */ new Float32Array(6);
	let reachedMaxDepth = false;
	const root = new MeshBVHNode();
	getBounds(triangleBounds, offset, count, root.boundingData, cacheCentroidBoundingData);
	splitNode(root, offset, count, cacheCentroidBoundingData);
	return root;
	function triggerProgress(trianglesProcessed) {
		if (onProgress) onProgress(trianglesProcessed / totalTriangles);
	}
	function splitNode(node, offset, count, centroidBoundingData = null, depth = 0) {
		if (!reachedMaxDepth && depth >= maxDepth) {
			reachedMaxDepth = true;
			if (verbose) {
				console.warn(`MeshBVH: Max depth of ${maxDepth} reached when generating BVH. Consider increasing maxDepth.`);
				console.warn(geometry);
			}
		}
		if (count <= maxLeafTris || depth >= maxDepth) {
			triggerProgress(offset + count);
			node.offset = offset;
			node.count = count;
			return node;
		}
		const split = getOptimalSplit(node.boundingData, centroidBoundingData, triangleBounds, offset, count, strategy);
		if (split.axis === -1) {
			triggerProgress(offset + count);
			node.offset = offset;
			node.count = count;
			return node;
		}
		const splitOffset = partionFunc(indirectBuffer, indexArray, triangleBounds, offset, count, split);
		if (splitOffset === offset || splitOffset === offset + count) {
			triggerProgress(offset + count);
			node.offset = offset;
			node.count = count;
		} else {
			node.splitAxis = split.axis;
			const left = new MeshBVHNode();
			const lstart = offset;
			const lcount = splitOffset - offset;
			node.left = left;
			getBounds(triangleBounds, lstart, lcount, left.boundingData, cacheCentroidBoundingData);
			splitNode(left, lstart, lcount, cacheCentroidBoundingData, depth + 1);
			const right = new MeshBVHNode();
			const rstart = splitOffset;
			const rcount = count - lcount;
			node.right = right;
			getBounds(triangleBounds, rstart, rcount, right.boundingData, cacheCentroidBoundingData);
			splitNode(right, rstart, rcount, cacheCentroidBoundingData, depth + 1);
		}
		return node;
	}
}
function buildPackedTree(bvh, options) {
	const geometry = bvh.geometry;
	if (options.indirect) {
		bvh._indirectBuffer = generateIndirectBuffer(geometry, options.useSharedArrayBuffer);
		if (hasGroupGaps(geometry, options.range) && !options.verbose) console.warn("MeshBVH: Provided geometry contains groups or a range that do not fully span the vertex contents while using the \"indirect\" option. BVH may incorrectly report intersections on unrendered portions of the geometry.");
	}
	if (!bvh._indirectBuffer) ensureIndex$1(geometry, options);
	const BufferConstructor = options.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer;
	const triangleBounds = computeTriangleBounds(geometry);
	bvh._roots = (options.indirect ? getFullGeometryRange(geometry, options.range) : getRootIndexRanges(geometry, options.range)).map((range) => {
		const root = buildTree(bvh, triangleBounds, range.offset, range.count, options);
		const nodeCount = countNodes(root);
		const buffer = new BufferConstructor(32 * nodeCount);
		populateBuffer(0, root, buffer);
		return buffer;
	});
}
//#endregion
//#region node_modules/three-mesh-bvh/src/math/SeparatingAxisBounds.js
var SeparatingAxisBounds = class {
	constructor() {
		this.min = Infinity;
		this.max = -Infinity;
	}
	setFromPointsField(points, field) {
		let min = Infinity;
		let max = -Infinity;
		for (let i = 0, l = points.length; i < l; i++) {
			const val = points[i][field];
			min = val < min ? val : min;
			max = val > max ? val : max;
		}
		this.min = min;
		this.max = max;
	}
	setFromPoints(axis, points) {
		let min = Infinity;
		let max = -Infinity;
		for (let i = 0, l = points.length; i < l; i++) {
			const p = points[i];
			const val = axis.dot(p);
			min = val < min ? val : min;
			max = val > max ? val : max;
		}
		this.min = min;
		this.max = max;
	}
	isSeparated(other) {
		return this.min > other.max || other.min > this.max;
	}
};
SeparatingAxisBounds.prototype.setFromBox = (function() {
	const p = new Vector3();
	return function setFromBox(axis, box) {
		const boxMin = box.min;
		const boxMax = box.max;
		let min = Infinity;
		let max = -Infinity;
		for (let x = 0; x <= 1; x++) for (let y = 0; y <= 1; y++) for (let z = 0; z <= 1; z++) {
			p.x = boxMin.x * x + boxMax.x * (1 - x);
			p.y = boxMin.y * y + boxMax.y * (1 - y);
			p.z = boxMin.z * z + boxMax.z * (1 - z);
			const val = axis.dot(p);
			min = Math.min(val, min);
			max = Math.max(val, max);
		}
		this.min = min;
		this.max = max;
	};
})();
(function() {
	const cacheSatBounds = new SeparatingAxisBounds();
	return function areIntersecting(shape1, shape2) {
		const points1 = shape1.points;
		const satAxes1 = shape1.satAxes;
		const satBounds1 = shape1.satBounds;
		const points2 = shape2.points;
		const satAxes2 = shape2.satAxes;
		const satBounds2 = shape2.satBounds;
		for (let i = 0; i < 3; i++) {
			const sb = satBounds1[i];
			const sa = satAxes1[i];
			cacheSatBounds.setFromPoints(sa, points2);
			if (sb.isSeparated(cacheSatBounds)) return false;
		}
		for (let i = 0; i < 3; i++) {
			const sb = satBounds2[i];
			const sa = satAxes2[i];
			cacheSatBounds.setFromPoints(sa, points1);
			if (sb.isSeparated(cacheSatBounds)) return false;
		}
	};
})();
//#endregion
//#region node_modules/three-mesh-bvh/src/math/MathUtilities.js
var closestPointLineToLine = (function() {
	const dir1 = new Vector3();
	const dir2 = new Vector3();
	const v02 = new Vector3();
	return function closestPointLineToLine(l1, l2, result) {
		const v0 = l1.start;
		const v10 = dir1;
		const v2 = l2.start;
		const v32 = dir2;
		v02.subVectors(v0, v2);
		dir1.subVectors(l1.end, l1.start);
		dir2.subVectors(l2.end, l2.start);
		const d0232 = v02.dot(v32);
		const d3210 = v32.dot(v10);
		const d3232 = v32.dot(v32);
		const d0210 = v02.dot(v10);
		const denom = v10.dot(v10) * d3232 - d3210 * d3210;
		let d, d2;
		if (denom !== 0) d = (d0232 * d3210 - d0210 * d3232) / denom;
		else d = 0;
		d2 = (d0232 + d * d3210) / d3232;
		result.x = d;
		result.y = d2;
	};
})();
var closestPointsSegmentToSegment = (function() {
	const paramResult = new Vector2();
	const temp1 = new Vector3();
	const temp2 = new Vector3();
	return function closestPointsSegmentToSegment(l1, l2, target1, target2) {
		closestPointLineToLine(l1, l2, paramResult);
		let d = paramResult.x;
		let d2 = paramResult.y;
		if (d >= 0 && d <= 1 && d2 >= 0 && d2 <= 1) {
			l1.at(d, target1);
			l2.at(d2, target2);
			return;
		} else if (d >= 0 && d <= 1) {
			if (d2 < 0) l2.at(0, target2);
			else l2.at(1, target2);
			l1.closestPointToPoint(target2, true, target1);
			return;
		} else if (d2 >= 0 && d2 <= 1) {
			if (d < 0) l1.at(0, target1);
			else l1.at(1, target1);
			l2.closestPointToPoint(target1, true, target2);
			return;
		} else {
			let p;
			if (d < 0) p = l1.start;
			else p = l1.end;
			let p2;
			if (d2 < 0) p2 = l2.start;
			else p2 = l2.end;
			const closestPoint = temp1;
			const closestPoint2 = temp2;
			l1.closestPointToPoint(p2, true, temp1);
			l2.closestPointToPoint(p, true, temp2);
			if (closestPoint.distanceToSquared(p2) <= closestPoint2.distanceToSquared(p)) {
				target1.copy(closestPoint);
				target2.copy(p2);
				return;
			} else {
				target1.copy(p);
				target2.copy(closestPoint2);
				return;
			}
		}
	};
})();
var sphereIntersectTriangle = (function() {
	const closestPointTemp = new Vector3();
	const projectedPointTemp = new Vector3();
	const planeTemp = new Plane();
	const lineTemp = new Line3();
	return function sphereIntersectTriangle(sphere, triangle) {
		const { radius, center } = sphere;
		const { a, b, c } = triangle;
		lineTemp.start = a;
		lineTemp.end = b;
		if (lineTemp.closestPointToPoint(center, true, closestPointTemp).distanceTo(center) <= radius) return true;
		lineTemp.start = a;
		lineTemp.end = c;
		if (lineTemp.closestPointToPoint(center, true, closestPointTemp).distanceTo(center) <= radius) return true;
		lineTemp.start = b;
		lineTemp.end = c;
		if (lineTemp.closestPointToPoint(center, true, closestPointTemp).distanceTo(center) <= radius) return true;
		const plane = triangle.getPlane(planeTemp);
		if (Math.abs(plane.distanceToPoint(center)) <= radius) {
			const pp = plane.projectPoint(center, projectedPointTemp);
			if (triangle.containsPoint(pp)) return true;
		}
		return false;
	};
})();
//#endregion
//#region node_modules/three-mesh-bvh/src/math/ExtendedTriangle.js
var ZERO_EPSILON = 1e-15;
function isNearZero(value) {
	return Math.abs(value) < ZERO_EPSILON;
}
var ExtendedTriangle = class extends Triangle {
	constructor(...args) {
		super(...args);
		this.isExtendedTriangle = true;
		this.satAxes = new Array(4).fill().map(() => new Vector3());
		this.satBounds = new Array(4).fill().map(() => new SeparatingAxisBounds());
		this.points = [
			this.a,
			this.b,
			this.c
		];
		this.sphere = new Sphere();
		this.plane = new Plane();
		this.needsUpdate = true;
	}
	intersectsSphere(sphere) {
		return sphereIntersectTriangle(sphere, this);
	}
	update() {
		const a = this.a;
		const b = this.b;
		const c = this.c;
		const points = this.points;
		const satAxes = this.satAxes;
		const satBounds = this.satBounds;
		const axis0 = satAxes[0];
		const sab0 = satBounds[0];
		this.getNormal(axis0);
		sab0.setFromPoints(axis0, points);
		const axis1 = satAxes[1];
		const sab1 = satBounds[1];
		axis1.subVectors(a, b);
		sab1.setFromPoints(axis1, points);
		const axis2 = satAxes[2];
		const sab2 = satBounds[2];
		axis2.subVectors(b, c);
		sab2.setFromPoints(axis2, points);
		const axis3 = satAxes[3];
		const sab3 = satBounds[3];
		axis3.subVectors(c, a);
		sab3.setFromPoints(axis3, points);
		this.sphere.setFromPoints(this.points);
		this.plane.setFromNormalAndCoplanarPoint(axis0, a);
		this.needsUpdate = false;
	}
};
ExtendedTriangle.prototype.closestPointToSegment = (function() {
	const point1 = new Vector3();
	const point2 = new Vector3();
	const edge = new Line3();
	return function distanceToSegment(segment, target1 = null, target2 = null) {
		const { start, end } = segment;
		const points = this.points;
		let distSq;
		let closestDistanceSq = Infinity;
		for (let i = 0; i < 3; i++) {
			const nexti = (i + 1) % 3;
			edge.start.copy(points[i]);
			edge.end.copy(points[nexti]);
			closestPointsSegmentToSegment(edge, segment, point1, point2);
			distSq = point1.distanceToSquared(point2);
			if (distSq < closestDistanceSq) {
				closestDistanceSq = distSq;
				if (target1) target1.copy(point1);
				if (target2) target2.copy(point2);
			}
		}
		this.closestPointToPoint(start, point1);
		distSq = start.distanceToSquared(point1);
		if (distSq < closestDistanceSq) {
			closestDistanceSq = distSq;
			if (target1) target1.copy(point1);
			if (target2) target2.copy(start);
		}
		this.closestPointToPoint(end, point1);
		distSq = end.distanceToSquared(point1);
		if (distSq < closestDistanceSq) {
			closestDistanceSq = distSq;
			if (target1) target1.copy(point1);
			if (target2) target2.copy(end);
		}
		return Math.sqrt(closestDistanceSq);
	};
})();
ExtendedTriangle.prototype.intersectsTriangle = (function() {
	const saTri2 = new ExtendedTriangle();
	const arr1 = new Array(3);
	const arr2 = new Array(3);
	const cachedSatBounds = new SeparatingAxisBounds();
	const cachedSatBounds2 = new SeparatingAxisBounds();
	const cachedAxis = new Vector3();
	const dir = new Vector3();
	const dir1 = new Vector3();
	const dir2 = new Vector3();
	const tempDir = new Vector3();
	const edge = new Line3();
	const edge1 = new Line3();
	const edge2 = new Line3();
	const tempPoint = new Vector3();
	function triIntersectPlane(tri, plane, targetEdge) {
		const points = tri.points;
		let count = 0;
		let startPointIntersection = -1;
		for (let i = 0; i < 3; i++) {
			const { start, end } = edge;
			start.copy(points[i]);
			end.copy(points[(i + 1) % 3]);
			edge.delta(dir);
			const startIntersects = isNearZero(plane.distanceToPoint(start));
			if (isNearZero(plane.normal.dot(dir)) && startIntersects) {
				targetEdge.copy(edge);
				count = 2;
				break;
			}
			const doesIntersect = plane.intersectLine(edge, tempPoint);
			if (!doesIntersect && startIntersects) tempPoint.copy(start);
			if ((doesIntersect || startIntersects) && !isNearZero(tempPoint.distanceTo(end))) {
				if (count <= 1) {
					(count === 1 ? targetEdge.start : targetEdge.end).copy(tempPoint);
					if (startIntersects) startPointIntersection = count;
				} else if (count >= 2) {
					(startPointIntersection === 1 ? targetEdge.start : targetEdge.end).copy(tempPoint);
					count = 2;
					break;
				}
				count++;
				if (count === 2 && startPointIntersection === -1) break;
			}
		}
		return count;
	}
	return function intersectsTriangle(other, target = null, suppressLog = false) {
		if (this.needsUpdate) this.update();
		if (!other.isExtendedTriangle) {
			saTri2.copy(other);
			saTri2.update();
			other = saTri2;
		} else if (other.needsUpdate) other.update();
		const plane1 = this.plane;
		const plane2 = other.plane;
		if (Math.abs(plane1.normal.dot(plane2.normal)) > 1 - 1e-10) {
			const satBounds1 = this.satBounds;
			const satAxes1 = this.satAxes;
			arr2[0] = other.a;
			arr2[1] = other.b;
			arr2[2] = other.c;
			for (let i = 0; i < 4; i++) {
				const sb = satBounds1[i];
				const sa = satAxes1[i];
				cachedSatBounds.setFromPoints(sa, arr2);
				if (sb.isSeparated(cachedSatBounds)) return false;
			}
			const satBounds2 = other.satBounds;
			const satAxes2 = other.satAxes;
			arr1[0] = this.a;
			arr1[1] = this.b;
			arr1[2] = this.c;
			for (let i = 0; i < 4; i++) {
				const sb = satBounds2[i];
				const sa = satAxes2[i];
				cachedSatBounds.setFromPoints(sa, arr1);
				if (sb.isSeparated(cachedSatBounds)) return false;
			}
			for (let i = 0; i < 4; i++) {
				const sa1 = satAxes1[i];
				for (let i2 = 0; i2 < 4; i2++) {
					const sa2 = satAxes2[i2];
					cachedAxis.crossVectors(sa1, sa2);
					cachedSatBounds.setFromPoints(cachedAxis, arr1);
					cachedSatBounds2.setFromPoints(cachedAxis, arr2);
					if (cachedSatBounds.isSeparated(cachedSatBounds2)) return false;
				}
			}
			if (target) {
				if (!suppressLog) console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0.");
				target.start.set(0, 0, 0);
				target.end.set(0, 0, 0);
			}
			return true;
		} else {
			const count1 = triIntersectPlane(this, plane2, edge1);
			if (count1 === 1 && other.containsPoint(edge1.end)) {
				if (target) {
					target.start.copy(edge1.end);
					target.end.copy(edge1.end);
				}
				return true;
			} else if (count1 !== 2) return false;
			const count2 = triIntersectPlane(other, plane1, edge2);
			if (count2 === 1 && this.containsPoint(edge2.end)) {
				if (target) {
					target.start.copy(edge2.end);
					target.end.copy(edge2.end);
				}
				return true;
			} else if (count2 !== 2) return false;
			edge1.delta(dir1);
			edge2.delta(dir2);
			if (dir1.dot(dir2) < 0) {
				let tmp = edge2.start;
				edge2.start = edge2.end;
				edge2.end = tmp;
			}
			const s1 = edge1.start.dot(dir1);
			const e1 = edge1.end.dot(dir1);
			const s2 = edge2.start.dot(dir1);
			const e2 = edge2.end.dot(dir1);
			if (s1 !== e2 && s2 !== e1 && e1 < s2 === s1 < e2) return false;
			if (target) {
				tempDir.subVectors(edge1.start, edge2.start);
				if (tempDir.dot(dir1) > 0) target.start.copy(edge1.start);
				else target.start.copy(edge2.start);
				tempDir.subVectors(edge1.end, edge2.end);
				if (tempDir.dot(dir1) < 0) target.end.copy(edge1.end);
				else target.end.copy(edge2.end);
			}
			return true;
		}
	};
})();
ExtendedTriangle.prototype.distanceToPoint = (function() {
	const target = new Vector3();
	return function distanceToPoint(point) {
		this.closestPointToPoint(point, target);
		return point.distanceTo(target);
	};
})();
ExtendedTriangle.prototype.distanceToTriangle = (function() {
	const point = new Vector3();
	const point2 = new Vector3();
	const cornerFields = [
		"a",
		"b",
		"c"
	];
	const line1 = new Line3();
	const line2 = new Line3();
	return function distanceToTriangle(other, target1 = null, target2 = null) {
		const lineTarget = target1 || target2 ? line1 : null;
		if (this.intersectsTriangle(other, lineTarget)) {
			if (target1 || target2) {
				if (target1) lineTarget.getCenter(target1);
				if (target2) lineTarget.getCenter(target2);
			}
			return 0;
		}
		let closestDistanceSq = Infinity;
		for (let i = 0; i < 3; i++) {
			let dist;
			const field = cornerFields[i];
			const otherVec = other[field];
			this.closestPointToPoint(otherVec, point);
			dist = otherVec.distanceToSquared(point);
			if (dist < closestDistanceSq) {
				closestDistanceSq = dist;
				if (target1) target1.copy(point);
				if (target2) target2.copy(otherVec);
			}
			const thisVec = this[field];
			other.closestPointToPoint(thisVec, point);
			dist = thisVec.distanceToSquared(point);
			if (dist < closestDistanceSq) {
				closestDistanceSq = dist;
				if (target1) target1.copy(thisVec);
				if (target2) target2.copy(point);
			}
		}
		for (let i = 0; i < 3; i++) {
			const f11 = cornerFields[i];
			const f12 = cornerFields[(i + 1) % 3];
			line1.set(this[f11], this[f12]);
			for (let i2 = 0; i2 < 3; i2++) {
				const f21 = cornerFields[i2];
				const f22 = cornerFields[(i2 + 1) % 3];
				line2.set(other[f21], other[f22]);
				closestPointsSegmentToSegment(line1, line2, point, point2);
				const dist = point.distanceToSquared(point2);
				if (dist < closestDistanceSq) {
					closestDistanceSq = dist;
					if (target1) target1.copy(point);
					if (target2) target2.copy(point2);
				}
			}
		}
		return Math.sqrt(closestDistanceSq);
	};
})();
//#endregion
//#region node_modules/three-mesh-bvh/src/math/OrientedBox.js
var OrientedBox = class {
	constructor(min, max, matrix) {
		this.isOrientedBox = true;
		this.min = new Vector3();
		this.max = new Vector3();
		this.matrix = new Matrix4();
		this.invMatrix = new Matrix4();
		this.points = new Array(8).fill().map(() => new Vector3());
		this.satAxes = new Array(3).fill().map(() => new Vector3());
		this.satBounds = new Array(3).fill().map(() => new SeparatingAxisBounds());
		this.alignedSatBounds = new Array(3).fill().map(() => new SeparatingAxisBounds());
		this.needsUpdate = false;
		if (min) this.min.copy(min);
		if (max) this.max.copy(max);
		if (matrix) this.matrix.copy(matrix);
	}
	set(min, max, matrix) {
		this.min.copy(min);
		this.max.copy(max);
		this.matrix.copy(matrix);
		this.needsUpdate = true;
	}
	copy(other) {
		this.min.copy(other.min);
		this.max.copy(other.max);
		this.matrix.copy(other.matrix);
		this.needsUpdate = true;
	}
};
OrientedBox.prototype.update = (function() {
	return function update() {
		const matrix = this.matrix;
		const min = this.min;
		const max = this.max;
		const points = this.points;
		for (let x = 0; x <= 1; x++) for (let y = 0; y <= 1; y++) for (let z = 0; z <= 1; z++) {
			const v = points[1 * x | 2 * y | 4 * z];
			v.x = x ? max.x : min.x;
			v.y = y ? max.y : min.y;
			v.z = z ? max.z : min.z;
			v.applyMatrix4(matrix);
		}
		const satBounds = this.satBounds;
		const satAxes = this.satAxes;
		const minVec = points[0];
		for (let i = 0; i < 3; i++) {
			const axis = satAxes[i];
			const sb = satBounds[i];
			const pi = points[1 << i];
			axis.subVectors(minVec, pi);
			sb.setFromPoints(axis, points);
		}
		const alignedSatBounds = this.alignedSatBounds;
		alignedSatBounds[0].setFromPointsField(points, "x");
		alignedSatBounds[1].setFromPointsField(points, "y");
		alignedSatBounds[2].setFromPointsField(points, "z");
		this.invMatrix.copy(this.matrix).invert();
		this.needsUpdate = false;
	};
})();
OrientedBox.prototype.intersectsBox = (function() {
	const aabbBounds = new SeparatingAxisBounds();
	return function intersectsBox(box) {
		if (this.needsUpdate) this.update();
		const min = box.min;
		const max = box.max;
		const satBounds = this.satBounds;
		const satAxes = this.satAxes;
		const alignedSatBounds = this.alignedSatBounds;
		aabbBounds.min = min.x;
		aabbBounds.max = max.x;
		if (alignedSatBounds[0].isSeparated(aabbBounds)) return false;
		aabbBounds.min = min.y;
		aabbBounds.max = max.y;
		if (alignedSatBounds[1].isSeparated(aabbBounds)) return false;
		aabbBounds.min = min.z;
		aabbBounds.max = max.z;
		if (alignedSatBounds[2].isSeparated(aabbBounds)) return false;
		for (let i = 0; i < 3; i++) {
			const axis = satAxes[i];
			const sb = satBounds[i];
			aabbBounds.setFromBox(axis, box);
			if (sb.isSeparated(aabbBounds)) return false;
		}
		return true;
	};
})();
OrientedBox.prototype.intersectsTriangle = (function() {
	const saTri = new ExtendedTriangle();
	const pointsArr = new Array(3);
	const cachedSatBounds = new SeparatingAxisBounds();
	const cachedSatBounds2 = new SeparatingAxisBounds();
	const cachedAxis = new Vector3();
	return function intersectsTriangle(triangle) {
		if (this.needsUpdate) this.update();
		if (!triangle.isExtendedTriangle) {
			saTri.copy(triangle);
			saTri.update();
			triangle = saTri;
		} else if (triangle.needsUpdate) triangle.update();
		const satBounds = this.satBounds;
		const satAxes = this.satAxes;
		pointsArr[0] = triangle.a;
		pointsArr[1] = triangle.b;
		pointsArr[2] = triangle.c;
		for (let i = 0; i < 3; i++) {
			const sb = satBounds[i];
			const sa = satAxes[i];
			cachedSatBounds.setFromPoints(sa, pointsArr);
			if (sb.isSeparated(cachedSatBounds)) return false;
		}
		const triSatBounds = triangle.satBounds;
		const triSatAxes = triangle.satAxes;
		const points = this.points;
		for (let i = 0; i < 3; i++) {
			const sb = triSatBounds[i];
			const sa = triSatAxes[i];
			cachedSatBounds.setFromPoints(sa, points);
			if (sb.isSeparated(cachedSatBounds)) return false;
		}
		for (let i = 0; i < 3; i++) {
			const sa1 = satAxes[i];
			for (let i2 = 0; i2 < 4; i2++) {
				const sa2 = triSatAxes[i2];
				cachedAxis.crossVectors(sa1, sa2);
				cachedSatBounds.setFromPoints(cachedAxis, pointsArr);
				cachedSatBounds2.setFromPoints(cachedAxis, points);
				if (cachedSatBounds.isSeparated(cachedSatBounds2)) return false;
			}
		}
		return true;
	};
})();
OrientedBox.prototype.closestPointToPoint = (function() {
	return function closestPointToPoint(point, target1) {
		if (this.needsUpdate) this.update();
		target1.copy(point).applyMatrix4(this.invMatrix).clamp(this.min, this.max).applyMatrix4(this.matrix);
		return target1;
	};
})();
OrientedBox.prototype.distanceToPoint = (function() {
	const target = new Vector3();
	return function distanceToPoint(point) {
		this.closestPointToPoint(point, target);
		return point.distanceTo(target);
	};
})();
OrientedBox.prototype.distanceToBox = (function() {
	const xyzFields = [
		"x",
		"y",
		"z"
	];
	const segments1 = new Array(12).fill().map(() => new Line3());
	const segments2 = new Array(12).fill().map(() => new Line3());
	const point1 = new Vector3();
	const point2 = new Vector3();
	return function distanceToBox(box, threshold = 0, target1 = null, target2 = null) {
		if (this.needsUpdate) this.update();
		if (this.intersectsBox(box)) {
			if (target1 || target2) {
				box.getCenter(point2);
				this.closestPointToPoint(point2, point1);
				box.closestPointToPoint(point1, point2);
				if (target1) target1.copy(point1);
				if (target2) target2.copy(point2);
			}
			return 0;
		}
		const threshold2 = threshold * threshold;
		const min = box.min;
		const max = box.max;
		const points = this.points;
		let closestDistanceSq = Infinity;
		for (let i = 0; i < 8; i++) {
			const p = points[i];
			point2.copy(p).clamp(min, max);
			const dist = p.distanceToSquared(point2);
			if (dist < closestDistanceSq) {
				closestDistanceSq = dist;
				if (target1) target1.copy(p);
				if (target2) target2.copy(point2);
				if (dist < threshold2) return Math.sqrt(dist);
			}
		}
		let count = 0;
		for (let i = 0; i < 3; i++) for (let i1 = 0; i1 <= 1; i1++) for (let i2 = 0; i2 <= 1; i2++) {
			const nextIndex = (i + 1) % 3;
			const nextIndex2 = (i + 2) % 3;
			const index = i1 << nextIndex | i2 << nextIndex2;
			const index2 = 1 << i | i1 << nextIndex | i2 << nextIndex2;
			const p1 = points[index];
			const p2 = points[index2];
			segments1[count].set(p1, p2);
			const f1 = xyzFields[i];
			const f2 = xyzFields[nextIndex];
			const f3 = xyzFields[nextIndex2];
			const line2 = segments2[count];
			const start = line2.start;
			const end = line2.end;
			start[f1] = min[f1];
			start[f2] = i1 ? min[f2] : max[f2];
			start[f3] = i2 ? min[f3] : max[f2];
			end[f1] = max[f1];
			end[f2] = i1 ? min[f2] : max[f2];
			end[f3] = i2 ? min[f3] : max[f2];
			count++;
		}
		for (let x = 0; x <= 1; x++) for (let y = 0; y <= 1; y++) for (let z = 0; z <= 1; z++) {
			point2.x = x ? max.x : min.x;
			point2.y = y ? max.y : min.y;
			point2.z = z ? max.z : min.z;
			this.closestPointToPoint(point2, point1);
			const dist = point2.distanceToSquared(point1);
			if (dist < closestDistanceSq) {
				closestDistanceSq = dist;
				if (target1) target1.copy(point1);
				if (target2) target2.copy(point2);
				if (dist < threshold2) return Math.sqrt(dist);
			}
		}
		for (let i = 0; i < 12; i++) {
			const l1 = segments1[i];
			for (let i2 = 0; i2 < 12; i2++) {
				const l2 = segments2[i2];
				closestPointsSegmentToSegment(l1, l2, point1, point2);
				const dist = point1.distanceToSquared(point2);
				if (dist < closestDistanceSq) {
					closestDistanceSq = dist;
					if (target1) target1.copy(point1);
					if (target2) target2.copy(point2);
					if (dist < threshold2) return Math.sqrt(dist);
				}
			}
		}
		return Math.sqrt(closestDistanceSq);
	};
})();
//#endregion
//#region node_modules/three-mesh-bvh/src/utils/PrimitivePool.js
var PrimitivePool = class {
	constructor(getNewPrimitive) {
		this._getNewPrimitive = getNewPrimitive;
		this._primitives = [];
	}
	getPrimitive() {
		const primitives = this._primitives;
		if (primitives.length === 0) return this._getNewPrimitive();
		else return primitives.pop();
	}
	releasePrimitive(primitive) {
		this._primitives.push(primitive);
	}
};
//#endregion
//#region node_modules/three-mesh-bvh/src/utils/ExtendedTrianglePool.js
var ExtendedTrianglePoolBase = class extends PrimitivePool {
	constructor() {
		super(() => new ExtendedTriangle());
	}
};
var ExtendedTrianglePool = /* @__PURE__ */ new ExtendedTrianglePoolBase();
//#endregion
//#region node_modules/three-mesh-bvh/src/core/utils/BufferStack.js
var _BufferStack = class {
	constructor() {
		this.float32Array = null;
		this.uint16Array = null;
		this.uint32Array = null;
		const stack = [];
		let prevBuffer = null;
		this.setBuffer = (buffer) => {
			if (prevBuffer) stack.push(prevBuffer);
			prevBuffer = buffer;
			this.float32Array = new Float32Array(buffer);
			this.uint16Array = new Uint16Array(buffer);
			this.uint32Array = new Uint32Array(buffer);
		};
		this.clearBuffer = () => {
			prevBuffer = null;
			this.float32Array = null;
			this.uint16Array = null;
			this.uint32Array = null;
			if (stack.length !== 0) this.setBuffer(stack.pop());
		};
	}
};
var BufferStack = new _BufferStack();
//#endregion
//#region node_modules/three-mesh-bvh/src/core/cast/shapecast.js
var _box1;
var _box2;
var boxStack = [];
var boxPool = /* @__PURE__ */ new PrimitivePool(() => new Box3());
function shapecast(bvh, root, intersectsBounds, intersectsRange, boundsTraverseOrder, byteOffset) {
	_box1 = boxPool.getPrimitive();
	_box2 = boxPool.getPrimitive();
	boxStack.push(_box1, _box2);
	BufferStack.setBuffer(bvh._roots[root]);
	const result = shapecastTraverse(0, bvh.geometry, intersectsBounds, intersectsRange, boundsTraverseOrder, byteOffset);
	BufferStack.clearBuffer();
	boxPool.releasePrimitive(_box1);
	boxPool.releasePrimitive(_box2);
	boxStack.pop();
	boxStack.pop();
	const length = boxStack.length;
	if (length > 0) {
		_box2 = boxStack[length - 1];
		_box1 = boxStack[length - 2];
	}
	return result;
}
function shapecastTraverse(nodeIndex32, geometry, intersectsBoundsFunc, intersectsRangeFunc, nodeScoreFunc = null, nodeIndexByteOffset = 0, depth = 0) {
	const { float32Array, uint16Array, uint32Array } = BufferStack;
	let nodeIndex16 = nodeIndex32 * 2;
	if (IS_LEAF(nodeIndex16, uint16Array)) {
		const offset = OFFSET(nodeIndex32, uint32Array);
		const count = COUNT(nodeIndex16, uint16Array);
		arrayToBox(BOUNDING_DATA_INDEX(nodeIndex32), float32Array, _box1);
		return intersectsRangeFunc(offset, count, false, depth, nodeIndexByteOffset + nodeIndex32, _box1);
	} else {
		const left = LEFT_NODE(nodeIndex32);
		const right = RIGHT_NODE(nodeIndex32, uint32Array);
		let c1 = left;
		let c2 = right;
		let score1, score2;
		let box1, box2;
		if (nodeScoreFunc) {
			box1 = _box1;
			box2 = _box2;
			arrayToBox(BOUNDING_DATA_INDEX(c1), float32Array, box1);
			arrayToBox(BOUNDING_DATA_INDEX(c2), float32Array, box2);
			score1 = nodeScoreFunc(box1);
			score2 = nodeScoreFunc(box2);
			if (score2 < score1) {
				c1 = right;
				c2 = left;
				const temp = score1;
				score1 = score2;
				score2 = temp;
				box1 = box2;
			}
		}
		if (!box1) {
			box1 = _box1;
			arrayToBox(BOUNDING_DATA_INDEX(c1), float32Array, box1);
		}
		const isC1Leaf = IS_LEAF(c1 * 2, uint16Array);
		const c1Intersection = intersectsBoundsFunc(box1, isC1Leaf, score1, depth + 1, nodeIndexByteOffset + c1);
		let c1StopTraversal;
		if (c1Intersection === 2) {
			const offset = getLeftOffset(c1);
			c1StopTraversal = intersectsRangeFunc(offset, getRightEndOffset(c1) - offset, true, depth + 1, nodeIndexByteOffset + c1, box1);
		} else c1StopTraversal = c1Intersection && shapecastTraverse(c1, geometry, intersectsBoundsFunc, intersectsRangeFunc, nodeScoreFunc, nodeIndexByteOffset, depth + 1);
		if (c1StopTraversal) return true;
		box2 = _box2;
		arrayToBox(BOUNDING_DATA_INDEX(c2), float32Array, box2);
		const isC2Leaf = IS_LEAF(c2 * 2, uint16Array);
		const c2Intersection = intersectsBoundsFunc(box2, isC2Leaf, score2, depth + 1, nodeIndexByteOffset + c2);
		let c2StopTraversal;
		if (c2Intersection === 2) {
			const offset = getLeftOffset(c2);
			c2StopTraversal = intersectsRangeFunc(offset, getRightEndOffset(c2) - offset, true, depth + 1, nodeIndexByteOffset + c2, box2);
		} else c2StopTraversal = c2Intersection && shapecastTraverse(c2, geometry, intersectsBoundsFunc, intersectsRangeFunc, nodeScoreFunc, nodeIndexByteOffset, depth + 1);
		if (c2StopTraversal) return true;
		return false;
		function getLeftOffset(nodeIndex32) {
			const { uint16Array, uint32Array } = BufferStack;
			let nodeIndex16 = nodeIndex32 * 2;
			while (!IS_LEAF(nodeIndex16, uint16Array)) {
				nodeIndex32 = LEFT_NODE(nodeIndex32);
				nodeIndex16 = nodeIndex32 * 2;
			}
			return OFFSET(nodeIndex32, uint32Array);
		}
		function getRightEndOffset(nodeIndex32) {
			const { uint16Array, uint32Array } = BufferStack;
			let nodeIndex16 = nodeIndex32 * 2;
			while (!IS_LEAF(nodeIndex16, uint16Array)) {
				nodeIndex32 = RIGHT_NODE(nodeIndex32, uint32Array);
				nodeIndex16 = nodeIndex32 * 2;
			}
			return OFFSET(nodeIndex32, uint32Array) + COUNT(nodeIndex16, uint16Array);
		}
	}
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/cast/closestPointToPoint.js
var temp = /* @__PURE__ */ new Vector3();
var temp1$2 = /* @__PURE__ */ new Vector3();
function closestPointToPoint(bvh, point, target = {}, minThreshold = 0, maxThreshold = Infinity) {
	const minThresholdSq = minThreshold * minThreshold;
	const maxThresholdSq = maxThreshold * maxThreshold;
	let closestDistanceSq = Infinity;
	let closestDistanceTriIndex = null;
	bvh.shapecast({
		boundsTraverseOrder: (box) => {
			temp.copy(point).clamp(box.min, box.max);
			return temp.distanceToSquared(point);
		},
		intersectsBounds: (box, isLeaf, score) => {
			return score < closestDistanceSq && score < maxThresholdSq;
		},
		intersectsTriangle: (tri, triIndex) => {
			tri.closestPointToPoint(point, temp);
			const distSq = point.distanceToSquared(temp);
			if (distSq < closestDistanceSq) {
				temp1$2.copy(temp);
				closestDistanceSq = distSq;
				closestDistanceTriIndex = triIndex;
			}
			if (distSq < minThresholdSq) return true;
			else return false;
		}
	});
	if (closestDistanceSq === Infinity) return null;
	const closestDistance = Math.sqrt(closestDistanceSq);
	if (!target.point) target.point = temp1$2.clone();
	else target.point.copy(temp1$2);
	target.distance = closestDistance, target.faceIndex = closestDistanceTriIndex;
	return target;
}
//#endregion
//#region node_modules/three-mesh-bvh/src/utils/ThreeRayIntersectUtilities.js
var IS_GT_REVISION_169 = parseInt("186") >= 169;
var _vA = /* @__PURE__ */ new Vector3();
var _vB = /* @__PURE__ */ new Vector3();
var _vC = /* @__PURE__ */ new Vector3();
var _uvA = /* @__PURE__ */ new Vector2();
var _uvB = /* @__PURE__ */ new Vector2();
var _uvC = /* @__PURE__ */ new Vector2();
var _normalA = /* @__PURE__ */ new Vector3();
var _normalB = /* @__PURE__ */ new Vector3();
var _normalC = /* @__PURE__ */ new Vector3();
var _intersectionPoint = /* @__PURE__ */ new Vector3();
function checkIntersection(ray, pA, pB, pC, point, side, near, far) {
	let intersect;
	if (side === 1) intersect = ray.intersectTriangle(pC, pB, pA, true, point);
	else intersect = ray.intersectTriangle(pA, pB, pC, side !== 2, point);
	if (intersect === null) return null;
	const distance = ray.origin.distanceTo(point);
	if (distance < near || distance > far) return null;
	return {
		distance,
		point: point.clone()
	};
}
function checkBufferGeometryIntersection(ray, position, normal, uv, uv1, a, b, c, side, near, far) {
	_vA.fromBufferAttribute(position, a);
	_vB.fromBufferAttribute(position, b);
	_vC.fromBufferAttribute(position, c);
	const intersection = checkIntersection(ray, _vA, _vB, _vC, _intersectionPoint, side, near, far);
	if (intersection) {
		const barycoord = new Vector3();
		Triangle.getBarycoord(_intersectionPoint, _vA, _vB, _vC, barycoord);
		if (uv) {
			_uvA.fromBufferAttribute(uv, a);
			_uvB.fromBufferAttribute(uv, b);
			_uvC.fromBufferAttribute(uv, c);
			intersection.uv = Triangle.getInterpolation(_intersectionPoint, _vA, _vB, _vC, _uvA, _uvB, _uvC, new Vector2());
		}
		if (uv1) {
			_uvA.fromBufferAttribute(uv1, a);
			_uvB.fromBufferAttribute(uv1, b);
			_uvC.fromBufferAttribute(uv1, c);
			intersection.uv1 = Triangle.getInterpolation(_intersectionPoint, _vA, _vB, _vC, _uvA, _uvB, _uvC, new Vector2());
		}
		if (normal) {
			_normalA.fromBufferAttribute(normal, a);
			_normalB.fromBufferAttribute(normal, b);
			_normalC.fromBufferAttribute(normal, c);
			intersection.normal = Triangle.getInterpolation(_intersectionPoint, _vA, _vB, _vC, _normalA, _normalB, _normalC, new Vector3());
			if (intersection.normal.dot(ray.direction) > 0) intersection.normal.multiplyScalar(-1);
		}
		const face = {
			a,
			b,
			c,
			normal: new Vector3(),
			materialIndex: 0
		};
		Triangle.getNormal(_vA, _vB, _vC, face.normal);
		intersection.face = face;
		intersection.faceIndex = a;
		if (IS_GT_REVISION_169) intersection.barycoord = barycoord;
	}
	return intersection;
}
function intersectTri(geo, side, ray, tri, intersections, near, far) {
	const triOffset = tri * 3;
	let a = triOffset + 0;
	let b = triOffset + 1;
	let c = triOffset + 2;
	const index = geo.index;
	if (geo.index) {
		a = index.getX(a);
		b = index.getX(b);
		c = index.getX(c);
	}
	const { position, normal, uv, uv1 } = geo.attributes;
	const intersection = checkBufferGeometryIntersection(ray, position, normal, uv, uv1, a, b, c, side, near, far);
	if (intersection) {
		intersection.faceIndex = tri;
		if (intersections) intersections.push(intersection);
		return intersection;
	}
	return null;
}
//#endregion
//#region node_modules/three-mesh-bvh/src/utils/TriangleUtilities.js
function setTriangle(tri, i, index, pos) {
	const ta = tri.a;
	const tb = tri.b;
	const tc = tri.c;
	let i0 = i;
	let i1 = i + 1;
	let i2 = i + 2;
	if (index) {
		i0 = index.getX(i0);
		i1 = index.getX(i1);
		i2 = index.getX(i2);
	}
	ta.x = pos.getX(i0);
	ta.y = pos.getY(i0);
	ta.z = pos.getZ(i0);
	tb.x = pos.getX(i1);
	tb.y = pos.getY(i1);
	tb.z = pos.getZ(i1);
	tc.x = pos.getX(i2);
	tc.y = pos.getY(i2);
	tc.z = pos.getZ(i2);
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/utils/iterationUtils.generated.js
function intersectTris(bvh, side, ray, offset, count, intersections, near, far) {
	const { geometry, _indirectBuffer } = bvh;
	for (let i = offset, end = offset + count; i < end; i++) intersectTri(geometry, side, ray, i, intersections, near, far);
}
function intersectClosestTri(bvh, side, ray, offset, count, near, far) {
	const { geometry, _indirectBuffer } = bvh;
	let dist = Infinity;
	let res = null;
	for (let i = offset, end = offset + count; i < end; i++) {
		let intersection;
		intersection = intersectTri(geometry, side, ray, i, null, near, far);
		if (intersection && intersection.distance < dist) {
			res = intersection;
			dist = intersection.distance;
		}
	}
	return res;
}
function iterateOverTriangles(offset, count, bvh, intersectsTriangleFunc, contained, depth, triangle) {
	const { geometry } = bvh;
	const { index } = geometry;
	const pos = geometry.attributes.position;
	for (let i = offset, l = count + offset; i < l; i++) {
		let tri;
		tri = i;
		setTriangle(triangle, tri * 3, index, pos);
		triangle.needsUpdate = true;
		if (intersectsTriangleFunc(triangle, tri, contained, depth)) return true;
	}
	return false;
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/cast/refit.generated.js
function refit(bvh, nodeIndices = null) {
	if (nodeIndices && Array.isArray(nodeIndices)) nodeIndices = new Set(nodeIndices);
	const geometry = bvh.geometry;
	const indexArr = geometry.index ? geometry.index.array : null;
	const posAttr = geometry.attributes.position;
	let buffer, uint32Array, uint16Array, float32Array;
	let byteOffset = 0;
	const roots = bvh._roots;
	for (let i = 0, l = roots.length; i < l; i++) {
		buffer = roots[i];
		uint32Array = new Uint32Array(buffer);
		uint16Array = new Uint16Array(buffer);
		float32Array = new Float32Array(buffer);
		_traverse(0, byteOffset);
		byteOffset += buffer.byteLength;
	}
	function _traverse(node32Index, byteOffset, force = false) {
		const node16Index = node32Index * 2;
		if (uint16Array[node16Index + 15] === 65535) {
			const offset = uint32Array[node32Index + 6];
			const count = uint16Array[node16Index + 14];
			let minx = Infinity;
			let miny = Infinity;
			let minz = Infinity;
			let maxx = -Infinity;
			let maxy = -Infinity;
			let maxz = -Infinity;
			for (let i = 3 * offset, l = 3 * (offset + count); i < l; i++) {
				let index = indexArr[i];
				const x = posAttr.getX(index);
				const y = posAttr.getY(index);
				const z = posAttr.getZ(index);
				if (x < minx) minx = x;
				if (x > maxx) maxx = x;
				if (y < miny) miny = y;
				if (y > maxy) maxy = y;
				if (z < minz) minz = z;
				if (z > maxz) maxz = z;
			}
			if (float32Array[node32Index + 0] !== minx || float32Array[node32Index + 1] !== miny || float32Array[node32Index + 2] !== minz || float32Array[node32Index + 3] !== maxx || float32Array[node32Index + 4] !== maxy || float32Array[node32Index + 5] !== maxz) {
				float32Array[node32Index + 0] = minx;
				float32Array[node32Index + 1] = miny;
				float32Array[node32Index + 2] = minz;
				float32Array[node32Index + 3] = maxx;
				float32Array[node32Index + 4] = maxy;
				float32Array[node32Index + 5] = maxz;
				return true;
			} else return false;
		} else {
			const left = node32Index + 8;
			const right = uint32Array[node32Index + 6];
			const offsetLeft = left + byteOffset;
			const offsetRight = right + byteOffset;
			let forceChildren = force;
			let includesLeft = false;
			let includesRight = false;
			if (nodeIndices) {
				if (!forceChildren) {
					includesLeft = nodeIndices.has(offsetLeft);
					includesRight = nodeIndices.has(offsetRight);
					forceChildren = !includesLeft && !includesRight;
				}
			} else {
				includesLeft = true;
				includesRight = true;
			}
			const traverseLeft = forceChildren || includesLeft;
			const traverseRight = forceChildren || includesRight;
			let leftChange = false;
			if (traverseLeft) leftChange = _traverse(left, byteOffset, forceChildren);
			let rightChange = false;
			if (traverseRight) rightChange = _traverse(right, byteOffset, forceChildren);
			const didChange = leftChange || rightChange;
			if (didChange) for (let i = 0; i < 3; i++) {
				const lefti = left + i;
				const righti = right + i;
				const minLeftValue = float32Array[lefti];
				const maxLeftValue = float32Array[lefti + 3];
				const minRightValue = float32Array[righti];
				const maxRightValue = float32Array[righti + 3];
				float32Array[node32Index + i] = minLeftValue < minRightValue ? minLeftValue : minRightValue;
				float32Array[node32Index + i + 3] = maxLeftValue > maxRightValue ? maxLeftValue : maxRightValue;
			}
			return didChange;
		}
	}
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/utils/intersectUtils.js
/**
* This function performs intersection tests similar to Ray.intersectBox in three.js,
* with the difference that the box values are read from an array to improve performance.
*/
function intersectRay(nodeIndex32, array, ray, near, far) {
	let tmin, tmax, tymin, tymax, tzmin, tzmax;
	const invdirx = 1 / ray.direction.x, invdiry = 1 / ray.direction.y, invdirz = 1 / ray.direction.z;
	const ox = ray.origin.x;
	const oy = ray.origin.y;
	const oz = ray.origin.z;
	let minx = array[nodeIndex32];
	let maxx = array[nodeIndex32 + 3];
	let miny = array[nodeIndex32 + 1];
	let maxy = array[nodeIndex32 + 3 + 1];
	let minz = array[nodeIndex32 + 2];
	let maxz = array[nodeIndex32 + 3 + 2];
	if (invdirx >= 0) {
		tmin = (minx - ox) * invdirx;
		tmax = (maxx - ox) * invdirx;
	} else {
		tmin = (maxx - ox) * invdirx;
		tmax = (minx - ox) * invdirx;
	}
	if (invdiry >= 0) {
		tymin = (miny - oy) * invdiry;
		tymax = (maxy - oy) * invdiry;
	} else {
		tymin = (maxy - oy) * invdiry;
		tymax = (miny - oy) * invdiry;
	}
	if (tmin > tymax || tymin > tmax) return false;
	if (tymin > tmin || isNaN(tmin)) tmin = tymin;
	if (tymax < tmax || isNaN(tmax)) tmax = tymax;
	if (invdirz >= 0) {
		tzmin = (minz - oz) * invdirz;
		tzmax = (maxz - oz) * invdirz;
	} else {
		tzmin = (maxz - oz) * invdirz;
		tzmax = (minz - oz) * invdirz;
	}
	if (tmin > tzmax || tzmin > tmax) return false;
	if (tzmin > tmin || tmin !== tmin) tmin = tzmin;
	if (tzmax < tmax || tmax !== tmax) tmax = tzmax;
	return tmin <= far && tmax >= near;
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/utils/iterationUtils_indirect.generated.js
function intersectTris_indirect(bvh, side, ray, offset, count, intersections, near, far) {
	const { geometry, _indirectBuffer } = bvh;
	for (let i = offset, end = offset + count; i < end; i++) intersectTri(geometry, side, ray, _indirectBuffer ? _indirectBuffer[i] : i, intersections, near, far);
}
function intersectClosestTri_indirect(bvh, side, ray, offset, count, near, far) {
	const { geometry, _indirectBuffer } = bvh;
	let dist = Infinity;
	let res = null;
	for (let i = offset, end = offset + count; i < end; i++) {
		let intersection;
		intersection = intersectTri(geometry, side, ray, _indirectBuffer ? _indirectBuffer[i] : i, null, near, far);
		if (intersection && intersection.distance < dist) {
			res = intersection;
			dist = intersection.distance;
		}
	}
	return res;
}
function iterateOverTriangles_indirect(offset, count, bvh, intersectsTriangleFunc, contained, depth, triangle) {
	const { geometry } = bvh;
	const { index } = geometry;
	const pos = geometry.attributes.position;
	for (let i = offset, l = count + offset; i < l; i++) {
		let tri;
		tri = bvh.resolveTriangleIndex(i);
		setTriangle(triangle, tri * 3, index, pos);
		triangle.needsUpdate = true;
		if (intersectsTriangleFunc(triangle, tri, contained, depth)) return true;
	}
	return false;
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/cast/raycast.generated.js
function raycast(bvh, root, side, ray, intersects, near, far) {
	BufferStack.setBuffer(bvh._roots[root]);
	_raycast$1(0, bvh, side, ray, intersects, near, far);
	BufferStack.clearBuffer();
}
function _raycast$1(nodeIndex32, bvh, side, ray, intersects, near, far) {
	const { float32Array, uint16Array, uint32Array } = BufferStack;
	const nodeIndex16 = nodeIndex32 * 2;
	if (IS_LEAF(nodeIndex16, uint16Array)) intersectTris(bvh, side, ray, OFFSET(nodeIndex32, uint32Array), COUNT(nodeIndex16, uint16Array), intersects, near, far);
	else {
		const leftIndex = LEFT_NODE(nodeIndex32);
		if (intersectRay(leftIndex, float32Array, ray, near, far)) _raycast$1(leftIndex, bvh, side, ray, intersects, near, far);
		const rightIndex = RIGHT_NODE(nodeIndex32, uint32Array);
		if (intersectRay(rightIndex, float32Array, ray, near, far)) _raycast$1(rightIndex, bvh, side, ray, intersects, near, far);
	}
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/cast/raycastFirst.generated.js
var _xyzFields$1 = [
	"x",
	"y",
	"z"
];
function raycastFirst(bvh, root, side, ray, near, far) {
	BufferStack.setBuffer(bvh._roots[root]);
	const result = _raycastFirst$1(0, bvh, side, ray, near, far);
	BufferStack.clearBuffer();
	return result;
}
function _raycastFirst$1(nodeIndex32, bvh, side, ray, near, far) {
	const { float32Array, uint16Array, uint32Array } = BufferStack;
	let nodeIndex16 = nodeIndex32 * 2;
	if (IS_LEAF(nodeIndex16, uint16Array)) return intersectClosestTri(bvh, side, ray, OFFSET(nodeIndex32, uint32Array), COUNT(nodeIndex16, uint16Array), near, far);
	else {
		const splitAxis = SPLIT_AXIS(nodeIndex32, uint32Array);
		const xyzAxis = _xyzFields$1[splitAxis];
		const leftToRight = ray.direction[xyzAxis] >= 0;
		let c1, c2;
		if (leftToRight) {
			c1 = LEFT_NODE(nodeIndex32);
			c2 = RIGHT_NODE(nodeIndex32, uint32Array);
		} else {
			c1 = RIGHT_NODE(nodeIndex32, uint32Array);
			c2 = LEFT_NODE(nodeIndex32);
		}
		const c1Result = intersectRay(c1, float32Array, ray, near, far) ? _raycastFirst$1(c1, bvh, side, ray, near, far) : null;
		if (c1Result) {
			const point = c1Result.point[xyzAxis];
			if (leftToRight ? point <= float32Array[c2 + splitAxis] : point >= float32Array[c2 + splitAxis + 3]) return c1Result;
		}
		const c2Result = intersectRay(c2, float32Array, ray, near, far) ? _raycastFirst$1(c2, bvh, side, ray, near, far) : null;
		if (c1Result && c2Result) return c1Result.distance <= c2Result.distance ? c1Result : c2Result;
		else return c1Result || c2Result || null;
	}
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/cast/intersectsGeometry.generated.js
var boundingBox$1 = /* @__PURE__ */ new Box3();
var triangle$1 = /* @__PURE__ */ new ExtendedTriangle();
var triangle2$1 = /* @__PURE__ */ new ExtendedTriangle();
var invertedMat$1 = /* @__PURE__ */ new Matrix4();
var obb$4 = /* @__PURE__ */ new OrientedBox();
var obb2$3 = /* @__PURE__ */ new OrientedBox();
function intersectsGeometry(bvh, root, otherGeometry, geometryToBvh) {
	BufferStack.setBuffer(bvh._roots[root]);
	const result = _intersectsGeometry$1(0, bvh, otherGeometry, geometryToBvh);
	BufferStack.clearBuffer();
	return result;
}
function _intersectsGeometry$1(nodeIndex32, bvh, otherGeometry, geometryToBvh, cachedObb = null) {
	const { float32Array, uint16Array, uint32Array } = BufferStack;
	let nodeIndex16 = nodeIndex32 * 2;
	if (cachedObb === null) {
		if (!otherGeometry.boundingBox) otherGeometry.computeBoundingBox();
		obb$4.set(otherGeometry.boundingBox.min, otherGeometry.boundingBox.max, geometryToBvh);
		cachedObb = obb$4;
	}
	if (IS_LEAF(nodeIndex16, uint16Array)) {
		const thisGeometry = bvh.geometry;
		const thisIndex = thisGeometry.index;
		const thisPos = thisGeometry.attributes.position;
		const index = otherGeometry.index;
		const pos = otherGeometry.attributes.position;
		const offset = OFFSET(nodeIndex32, uint32Array);
		const count = COUNT(nodeIndex16, uint16Array);
		invertedMat$1.copy(geometryToBvh).invert();
		if (otherGeometry.boundsTree) {
			arrayToBox(BOUNDING_DATA_INDEX(nodeIndex32), float32Array, obb2$3);
			obb2$3.matrix.copy(invertedMat$1);
			obb2$3.needsUpdate = true;
			return otherGeometry.boundsTree.shapecast({
				intersectsBounds: (box) => obb2$3.intersectsBox(box),
				intersectsTriangle: (tri) => {
					tri.a.applyMatrix4(geometryToBvh);
					tri.b.applyMatrix4(geometryToBvh);
					tri.c.applyMatrix4(geometryToBvh);
					tri.needsUpdate = true;
					for (let i = offset * 3, l = (count + offset) * 3; i < l; i += 3) {
						setTriangle(triangle2$1, i, thisIndex, thisPos);
						triangle2$1.needsUpdate = true;
						if (tri.intersectsTriangle(triangle2$1)) return true;
					}
					return false;
				}
			});
		} else for (let i = offset * 3, l = (count + offset) * 3; i < l; i += 3) {
			setTriangle(triangle$1, i, thisIndex, thisPos);
			triangle$1.a.applyMatrix4(invertedMat$1);
			triangle$1.b.applyMatrix4(invertedMat$1);
			triangle$1.c.applyMatrix4(invertedMat$1);
			triangle$1.needsUpdate = true;
			for (let i2 = 0, l2 = index.count; i2 < l2; i2 += 3) {
				setTriangle(triangle2$1, i2, index, pos);
				triangle2$1.needsUpdate = true;
				if (triangle$1.intersectsTriangle(triangle2$1)) return true;
			}
		}
	} else {
		const left = nodeIndex32 + 8;
		const right = uint32Array[nodeIndex32 + 6];
		arrayToBox(BOUNDING_DATA_INDEX(left), float32Array, boundingBox$1);
		if (cachedObb.intersectsBox(boundingBox$1) && _intersectsGeometry$1(left, bvh, otherGeometry, geometryToBvh, cachedObb)) return true;
		arrayToBox(BOUNDING_DATA_INDEX(right), float32Array, boundingBox$1);
		if (cachedObb.intersectsBox(boundingBox$1) && _intersectsGeometry$1(right, bvh, otherGeometry, geometryToBvh, cachedObb)) return true;
		return false;
	}
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/cast/closestPointToGeometry.generated.js
var tempMatrix$1 = /* @__PURE__ */ new Matrix4();
var obb$3 = /* @__PURE__ */ new OrientedBox();
var obb2$2 = /* @__PURE__ */ new OrientedBox();
var temp1$1 = /* @__PURE__ */ new Vector3();
var temp2$1 = /* @__PURE__ */ new Vector3();
var temp3$1 = /* @__PURE__ */ new Vector3();
var temp4$1 = /* @__PURE__ */ new Vector3();
function closestPointToGeometry(bvh, otherGeometry, geometryToBvh, target1 = {}, target2 = {}, minThreshold = 0, maxThreshold = Infinity) {
	if (!otherGeometry.boundingBox) otherGeometry.computeBoundingBox();
	obb$3.set(otherGeometry.boundingBox.min, otherGeometry.boundingBox.max, geometryToBvh);
	obb$3.needsUpdate = true;
	const geometry = bvh.geometry;
	const pos = geometry.attributes.position;
	const index = geometry.index;
	const otherPos = otherGeometry.attributes.position;
	const otherIndex = otherGeometry.index;
	const triangle = ExtendedTrianglePool.getPrimitive();
	const triangle2 = ExtendedTrianglePool.getPrimitive();
	let tempTarget1 = temp1$1;
	let tempTargetDest1 = temp2$1;
	let tempTarget2 = null;
	let tempTargetDest2 = null;
	if (target2) {
		tempTarget2 = temp3$1;
		tempTargetDest2 = temp4$1;
	}
	let closestDistance = Infinity;
	let closestDistanceTriIndex = null;
	let closestDistanceOtherTriIndex = null;
	tempMatrix$1.copy(geometryToBvh).invert();
	obb2$2.matrix.copy(tempMatrix$1);
	bvh.shapecast({
		boundsTraverseOrder: (box) => {
			return obb$3.distanceToBox(box);
		},
		intersectsBounds: (box, isLeaf, score) => {
			if (score < closestDistance && score < maxThreshold) {
				if (isLeaf) {
					obb2$2.min.copy(box.min);
					obb2$2.max.copy(box.max);
					obb2$2.needsUpdate = true;
				}
				return true;
			}
			return false;
		},
		intersectsRange: (offset, count) => {
			if (otherGeometry.boundsTree) return otherGeometry.boundsTree.shapecast({
				boundsTraverseOrder: (box) => {
					return obb2$2.distanceToBox(box);
				},
				intersectsBounds: (box, isLeaf, score) => {
					return score < closestDistance && score < maxThreshold;
				},
				intersectsRange: (otherOffset, otherCount) => {
					for (let i2 = otherOffset, l2 = otherOffset + otherCount; i2 < l2; i2++) {
						setTriangle(triangle2, 3 * i2, otherIndex, otherPos);
						triangle2.a.applyMatrix4(geometryToBvh);
						triangle2.b.applyMatrix4(geometryToBvh);
						triangle2.c.applyMatrix4(geometryToBvh);
						triangle2.needsUpdate = true;
						for (let i = offset, l = offset + count; i < l; i++) {
							setTriangle(triangle, 3 * i, index, pos);
							triangle.needsUpdate = true;
							const dist = triangle.distanceToTriangle(triangle2, tempTarget1, tempTarget2);
							if (dist < closestDistance) {
								tempTargetDest1.copy(tempTarget1);
								if (tempTargetDest2) tempTargetDest2.copy(tempTarget2);
								closestDistance = dist;
								closestDistanceTriIndex = i;
								closestDistanceOtherTriIndex = i2;
							}
							if (dist < minThreshold) return true;
						}
					}
				}
			});
			else {
				const triCount = getTriCount$1(otherGeometry);
				for (let i2 = 0, l2 = triCount; i2 < l2; i2++) {
					setTriangle(triangle2, 3 * i2, otherIndex, otherPos);
					triangle2.a.applyMatrix4(geometryToBvh);
					triangle2.b.applyMatrix4(geometryToBvh);
					triangle2.c.applyMatrix4(geometryToBvh);
					triangle2.needsUpdate = true;
					for (let i = offset, l = offset + count; i < l; i++) {
						setTriangle(triangle, 3 * i, index, pos);
						triangle.needsUpdate = true;
						const dist = triangle.distanceToTriangle(triangle2, tempTarget1, tempTarget2);
						if (dist < closestDistance) {
							tempTargetDest1.copy(tempTarget1);
							if (tempTargetDest2) tempTargetDest2.copy(tempTarget2);
							closestDistance = dist;
							closestDistanceTriIndex = i;
							closestDistanceOtherTriIndex = i2;
						}
						if (dist < minThreshold) return true;
					}
				}
			}
		}
	});
	ExtendedTrianglePool.releasePrimitive(triangle);
	ExtendedTrianglePool.releasePrimitive(triangle2);
	if (closestDistance === Infinity) return null;
	if (!target1.point) target1.point = tempTargetDest1.clone();
	else target1.point.copy(tempTargetDest1);
	target1.distance = closestDistance, target1.faceIndex = closestDistanceTriIndex;
	if (target2) {
		if (!target2.point) target2.point = tempTargetDest2.clone();
		else target2.point.copy(tempTargetDest2);
		target2.point.applyMatrix4(tempMatrix$1);
		tempTargetDest1.applyMatrix4(tempMatrix$1);
		target2.distance = tempTargetDest1.sub(target2.point).length();
		target2.faceIndex = closestDistanceOtherTriIndex;
	}
	return target1;
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/cast/refit_indirect.generated.js
function refit_indirect(bvh, nodeIndices = null) {
	if (nodeIndices && Array.isArray(nodeIndices)) nodeIndices = new Set(nodeIndices);
	const geometry = bvh.geometry;
	const indexArr = geometry.index ? geometry.index.array : null;
	const posAttr = geometry.attributes.position;
	let buffer, uint32Array, uint16Array, float32Array;
	let byteOffset = 0;
	const roots = bvh._roots;
	for (let i = 0, l = roots.length; i < l; i++) {
		buffer = roots[i];
		uint32Array = new Uint32Array(buffer);
		uint16Array = new Uint16Array(buffer);
		float32Array = new Float32Array(buffer);
		_traverse(0, byteOffset);
		byteOffset += buffer.byteLength;
	}
	function _traverse(node32Index, byteOffset, force = false) {
		const node16Index = node32Index * 2;
		if (uint16Array[node16Index + 15] === 65535) {
			const offset = uint32Array[node32Index + 6];
			const count = uint16Array[node16Index + 14];
			let minx = Infinity;
			let miny = Infinity;
			let minz = Infinity;
			let maxx = -Infinity;
			let maxy = -Infinity;
			let maxz = -Infinity;
			for (let i = offset, l = offset + count; i < l; i++) {
				const t = 3 * bvh.resolveTriangleIndex(i);
				for (let j = 0; j < 3; j++) {
					let index = t + j;
					index = indexArr ? indexArr[index] : index;
					const x = posAttr.getX(index);
					const y = posAttr.getY(index);
					const z = posAttr.getZ(index);
					if (x < minx) minx = x;
					if (x > maxx) maxx = x;
					if (y < miny) miny = y;
					if (y > maxy) maxy = y;
					if (z < minz) minz = z;
					if (z > maxz) maxz = z;
				}
			}
			if (float32Array[node32Index + 0] !== minx || float32Array[node32Index + 1] !== miny || float32Array[node32Index + 2] !== minz || float32Array[node32Index + 3] !== maxx || float32Array[node32Index + 4] !== maxy || float32Array[node32Index + 5] !== maxz) {
				float32Array[node32Index + 0] = minx;
				float32Array[node32Index + 1] = miny;
				float32Array[node32Index + 2] = minz;
				float32Array[node32Index + 3] = maxx;
				float32Array[node32Index + 4] = maxy;
				float32Array[node32Index + 5] = maxz;
				return true;
			} else return false;
		} else {
			const left = node32Index + 8;
			const right = uint32Array[node32Index + 6];
			const offsetLeft = left + byteOffset;
			const offsetRight = right + byteOffset;
			let forceChildren = force;
			let includesLeft = false;
			let includesRight = false;
			if (nodeIndices) {
				if (!forceChildren) {
					includesLeft = nodeIndices.has(offsetLeft);
					includesRight = nodeIndices.has(offsetRight);
					forceChildren = !includesLeft && !includesRight;
				}
			} else {
				includesLeft = true;
				includesRight = true;
			}
			const traverseLeft = forceChildren || includesLeft;
			const traverseRight = forceChildren || includesRight;
			let leftChange = false;
			if (traverseLeft) leftChange = _traverse(left, byteOffset, forceChildren);
			let rightChange = false;
			if (traverseRight) rightChange = _traverse(right, byteOffset, forceChildren);
			const didChange = leftChange || rightChange;
			if (didChange) for (let i = 0; i < 3; i++) {
				const lefti = left + i;
				const righti = right + i;
				const minLeftValue = float32Array[lefti];
				const maxLeftValue = float32Array[lefti + 3];
				const minRightValue = float32Array[righti];
				const maxRightValue = float32Array[righti + 3];
				float32Array[node32Index + i] = minLeftValue < minRightValue ? minLeftValue : minRightValue;
				float32Array[node32Index + i + 3] = maxLeftValue > maxRightValue ? maxLeftValue : maxRightValue;
			}
			return didChange;
		}
	}
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/cast/raycast_indirect.generated.js
function raycast_indirect(bvh, root, side, ray, intersects, near, far) {
	BufferStack.setBuffer(bvh._roots[root]);
	_raycast(0, bvh, side, ray, intersects, near, far);
	BufferStack.clearBuffer();
}
function _raycast(nodeIndex32, bvh, side, ray, intersects, near, far) {
	const { float32Array, uint16Array, uint32Array } = BufferStack;
	const nodeIndex16 = nodeIndex32 * 2;
	if (IS_LEAF(nodeIndex16, uint16Array)) intersectTris_indirect(bvh, side, ray, OFFSET(nodeIndex32, uint32Array), COUNT(nodeIndex16, uint16Array), intersects, near, far);
	else {
		const leftIndex = LEFT_NODE(nodeIndex32);
		if (intersectRay(leftIndex, float32Array, ray, near, far)) _raycast(leftIndex, bvh, side, ray, intersects, near, far);
		const rightIndex = RIGHT_NODE(nodeIndex32, uint32Array);
		if (intersectRay(rightIndex, float32Array, ray, near, far)) _raycast(rightIndex, bvh, side, ray, intersects, near, far);
	}
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/cast/raycastFirst_indirect.generated.js
var _xyzFields = [
	"x",
	"y",
	"z"
];
function raycastFirst_indirect(bvh, root, side, ray, near, far) {
	BufferStack.setBuffer(bvh._roots[root]);
	const result = _raycastFirst(0, bvh, side, ray, near, far);
	BufferStack.clearBuffer();
	return result;
}
function _raycastFirst(nodeIndex32, bvh, side, ray, near, far) {
	const { float32Array, uint16Array, uint32Array } = BufferStack;
	let nodeIndex16 = nodeIndex32 * 2;
	if (IS_LEAF(nodeIndex16, uint16Array)) return intersectClosestTri_indirect(bvh, side, ray, OFFSET(nodeIndex32, uint32Array), COUNT(nodeIndex16, uint16Array), near, far);
	else {
		const splitAxis = SPLIT_AXIS(nodeIndex32, uint32Array);
		const xyzAxis = _xyzFields[splitAxis];
		const leftToRight = ray.direction[xyzAxis] >= 0;
		let c1, c2;
		if (leftToRight) {
			c1 = LEFT_NODE(nodeIndex32);
			c2 = RIGHT_NODE(nodeIndex32, uint32Array);
		} else {
			c1 = RIGHT_NODE(nodeIndex32, uint32Array);
			c2 = LEFT_NODE(nodeIndex32);
		}
		const c1Result = intersectRay(c1, float32Array, ray, near, far) ? _raycastFirst(c1, bvh, side, ray, near, far) : null;
		if (c1Result) {
			const point = c1Result.point[xyzAxis];
			if (leftToRight ? point <= float32Array[c2 + splitAxis] : point >= float32Array[c2 + splitAxis + 3]) return c1Result;
		}
		const c2Result = intersectRay(c2, float32Array, ray, near, far) ? _raycastFirst(c2, bvh, side, ray, near, far) : null;
		if (c1Result && c2Result) return c1Result.distance <= c2Result.distance ? c1Result : c2Result;
		else return c1Result || c2Result || null;
	}
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/cast/intersectsGeometry_indirect.generated.js
var boundingBox = /* @__PURE__ */ new Box3();
var triangle = /* @__PURE__ */ new ExtendedTriangle();
var triangle2 = /* @__PURE__ */ new ExtendedTriangle();
var invertedMat = /* @__PURE__ */ new Matrix4();
var obb$2 = /* @__PURE__ */ new OrientedBox();
var obb2$1 = /* @__PURE__ */ new OrientedBox();
function intersectsGeometry_indirect(bvh, root, otherGeometry, geometryToBvh) {
	BufferStack.setBuffer(bvh._roots[root]);
	const result = _intersectsGeometry(0, bvh, otherGeometry, geometryToBvh);
	BufferStack.clearBuffer();
	return result;
}
function _intersectsGeometry(nodeIndex32, bvh, otherGeometry, geometryToBvh, cachedObb = null) {
	const { float32Array, uint16Array, uint32Array } = BufferStack;
	let nodeIndex16 = nodeIndex32 * 2;
	if (cachedObb === null) {
		if (!otherGeometry.boundingBox) otherGeometry.computeBoundingBox();
		obb$2.set(otherGeometry.boundingBox.min, otherGeometry.boundingBox.max, geometryToBvh);
		cachedObb = obb$2;
	}
	if (IS_LEAF(nodeIndex16, uint16Array)) {
		const thisGeometry = bvh.geometry;
		const thisIndex = thisGeometry.index;
		const thisPos = thisGeometry.attributes.position;
		const index = otherGeometry.index;
		const pos = otherGeometry.attributes.position;
		const offset = OFFSET(nodeIndex32, uint32Array);
		const count = COUNT(nodeIndex16, uint16Array);
		invertedMat.copy(geometryToBvh).invert();
		if (otherGeometry.boundsTree) {
			arrayToBox(BOUNDING_DATA_INDEX(nodeIndex32), float32Array, obb2$1);
			obb2$1.matrix.copy(invertedMat);
			obb2$1.needsUpdate = true;
			return otherGeometry.boundsTree.shapecast({
				intersectsBounds: (box) => obb2$1.intersectsBox(box),
				intersectsTriangle: (tri) => {
					tri.a.applyMatrix4(geometryToBvh);
					tri.b.applyMatrix4(geometryToBvh);
					tri.c.applyMatrix4(geometryToBvh);
					tri.needsUpdate = true;
					for (let i = offset, l = count + offset; i < l; i++) {
						setTriangle(triangle2, 3 * bvh.resolveTriangleIndex(i), thisIndex, thisPos);
						triangle2.needsUpdate = true;
						if (tri.intersectsTriangle(triangle2)) return true;
					}
					return false;
				}
			});
		} else for (let i = offset, l = count + offset; i < l; i++) {
			setTriangle(triangle, 3 * bvh.resolveTriangleIndex(i), thisIndex, thisPos);
			triangle.a.applyMatrix4(invertedMat);
			triangle.b.applyMatrix4(invertedMat);
			triangle.c.applyMatrix4(invertedMat);
			triangle.needsUpdate = true;
			for (let i2 = 0, l2 = index.count; i2 < l2; i2 += 3) {
				setTriangle(triangle2, i2, index, pos);
				triangle2.needsUpdate = true;
				if (triangle.intersectsTriangle(triangle2)) return true;
			}
		}
	} else {
		const left = nodeIndex32 + 8;
		const right = uint32Array[nodeIndex32 + 6];
		arrayToBox(BOUNDING_DATA_INDEX(left), float32Array, boundingBox);
		if (cachedObb.intersectsBox(boundingBox) && _intersectsGeometry(left, bvh, otherGeometry, geometryToBvh, cachedObb)) return true;
		arrayToBox(BOUNDING_DATA_INDEX(right), float32Array, boundingBox);
		if (cachedObb.intersectsBox(boundingBox) && _intersectsGeometry(right, bvh, otherGeometry, geometryToBvh, cachedObb)) return true;
		return false;
	}
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/cast/closestPointToGeometry_indirect.generated.js
var tempMatrix = /* @__PURE__ */ new Matrix4();
var obb$1 = /* @__PURE__ */ new OrientedBox();
var obb2 = /* @__PURE__ */ new OrientedBox();
var temp1 = /* @__PURE__ */ new Vector3();
var temp2 = /* @__PURE__ */ new Vector3();
var temp3 = /* @__PURE__ */ new Vector3();
var temp4 = /* @__PURE__ */ new Vector3();
function closestPointToGeometry_indirect(bvh, otherGeometry, geometryToBvh, target1 = {}, target2 = {}, minThreshold = 0, maxThreshold = Infinity) {
	if (!otherGeometry.boundingBox) otherGeometry.computeBoundingBox();
	obb$1.set(otherGeometry.boundingBox.min, otherGeometry.boundingBox.max, geometryToBvh);
	obb$1.needsUpdate = true;
	const geometry = bvh.geometry;
	const pos = geometry.attributes.position;
	const index = geometry.index;
	const otherPos = otherGeometry.attributes.position;
	const otherIndex = otherGeometry.index;
	const triangle = ExtendedTrianglePool.getPrimitive();
	const triangle2 = ExtendedTrianglePool.getPrimitive();
	let tempTarget1 = temp1;
	let tempTargetDest1 = temp2;
	let tempTarget2 = null;
	let tempTargetDest2 = null;
	if (target2) {
		tempTarget2 = temp3;
		tempTargetDest2 = temp4;
	}
	let closestDistance = Infinity;
	let closestDistanceTriIndex = null;
	let closestDistanceOtherTriIndex = null;
	tempMatrix.copy(geometryToBvh).invert();
	obb2.matrix.copy(tempMatrix);
	bvh.shapecast({
		boundsTraverseOrder: (box) => {
			return obb$1.distanceToBox(box);
		},
		intersectsBounds: (box, isLeaf, score) => {
			if (score < closestDistance && score < maxThreshold) {
				if (isLeaf) {
					obb2.min.copy(box.min);
					obb2.max.copy(box.max);
					obb2.needsUpdate = true;
				}
				return true;
			}
			return false;
		},
		intersectsRange: (offset, count) => {
			if (otherGeometry.boundsTree) {
				const otherBvh = otherGeometry.boundsTree;
				return otherBvh.shapecast({
					boundsTraverseOrder: (box) => {
						return obb2.distanceToBox(box);
					},
					intersectsBounds: (box, isLeaf, score) => {
						return score < closestDistance && score < maxThreshold;
					},
					intersectsRange: (otherOffset, otherCount) => {
						for (let i2 = otherOffset, l2 = otherOffset + otherCount; i2 < l2; i2++) {
							const ti2 = otherBvh.resolveTriangleIndex(i2);
							setTriangle(triangle2, 3 * ti2, otherIndex, otherPos);
							triangle2.a.applyMatrix4(geometryToBvh);
							triangle2.b.applyMatrix4(geometryToBvh);
							triangle2.c.applyMatrix4(geometryToBvh);
							triangle2.needsUpdate = true;
							for (let i = offset, l = offset + count; i < l; i++) {
								const ti = bvh.resolveTriangleIndex(i);
								setTriangle(triangle, 3 * ti, index, pos);
								triangle.needsUpdate = true;
								const dist = triangle.distanceToTriangle(triangle2, tempTarget1, tempTarget2);
								if (dist < closestDistance) {
									tempTargetDest1.copy(tempTarget1);
									if (tempTargetDest2) tempTargetDest2.copy(tempTarget2);
									closestDistance = dist;
									closestDistanceTriIndex = i;
									closestDistanceOtherTriIndex = i2;
								}
								if (dist < minThreshold) return true;
							}
						}
					}
				});
			} else {
				const triCount = getTriCount$1(otherGeometry);
				for (let i2 = 0, l2 = triCount; i2 < l2; i2++) {
					setTriangle(triangle2, 3 * i2, otherIndex, otherPos);
					triangle2.a.applyMatrix4(geometryToBvh);
					triangle2.b.applyMatrix4(geometryToBvh);
					triangle2.c.applyMatrix4(geometryToBvh);
					triangle2.needsUpdate = true;
					for (let i = offset, l = offset + count; i < l; i++) {
						const ti = bvh.resolveTriangleIndex(i);
						setTriangle(triangle, 3 * ti, index, pos);
						triangle.needsUpdate = true;
						const dist = triangle.distanceToTriangle(triangle2, tempTarget1, tempTarget2);
						if (dist < closestDistance) {
							tempTargetDest1.copy(tempTarget1);
							if (tempTargetDest2) tempTargetDest2.copy(tempTarget2);
							closestDistance = dist;
							closestDistanceTriIndex = i;
							closestDistanceOtherTriIndex = i2;
						}
						if (dist < minThreshold) return true;
					}
				}
			}
		}
	});
	ExtendedTrianglePool.releasePrimitive(triangle);
	ExtendedTrianglePool.releasePrimitive(triangle2);
	if (closestDistance === Infinity) return null;
	if (!target1.point) target1.point = tempTargetDest1.clone();
	else target1.point.copy(tempTargetDest1);
	target1.distance = closestDistance, target1.faceIndex = closestDistanceTriIndex;
	if (target2) {
		if (!target2.point) target2.point = tempTargetDest2.clone();
		else target2.point.copy(tempTargetDest2);
		target2.point.applyMatrix4(tempMatrix);
		tempTargetDest1.applyMatrix4(tempMatrix);
		target2.distance = tempTargetDest1.sub(target2.point).length();
		target2.faceIndex = closestDistanceOtherTriIndex;
	}
	return target1;
}
//#endregion
//#region node_modules/three-mesh-bvh/src/utils/BufferUtils.js
function isSharedArrayBufferSupported() {
	return typeof SharedArrayBuffer !== "undefined";
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/cast/bvhcast.js
var _bufferStack1 = new BufferStack.constructor();
var _bufferStack2 = new BufferStack.constructor();
var _boxPool = new PrimitivePool(() => new Box3());
var _leftBox1 = new Box3();
var _rightBox1 = new Box3();
var _leftBox2 = new Box3();
var _rightBox2 = new Box3();
var _active = false;
function bvhcast(bvh, otherBvh, matrixToLocal, intersectsRanges) {
	if (_active) throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");
	_active = true;
	const roots = bvh._roots;
	const otherRoots = otherBvh._roots;
	let result;
	let offset1 = 0;
	let offset2 = 0;
	const invMat = new Matrix4().copy(matrixToLocal).invert();
	for (let i = 0, il = roots.length; i < il; i++) {
		_bufferStack1.setBuffer(roots[i]);
		offset2 = 0;
		const localBox = _boxPool.getPrimitive();
		arrayToBox(BOUNDING_DATA_INDEX(0), _bufferStack1.float32Array, localBox);
		localBox.applyMatrix4(invMat);
		for (let j = 0, jl = otherRoots.length; j < jl; j++) {
			_bufferStack2.setBuffer(otherRoots[j]);
			result = _traverse(0, 0, matrixToLocal, invMat, intersectsRanges, offset1, offset2, 0, 0, localBox);
			_bufferStack2.clearBuffer();
			offset2 += otherRoots[j].length;
			if (result) break;
		}
		_boxPool.releasePrimitive(localBox);
		_bufferStack1.clearBuffer();
		offset1 += roots[i].length;
		if (result) break;
	}
	_active = false;
	return result;
}
function _traverse(node1Index32, node2Index32, matrix2to1, matrix1to2, intersectsRangesFunc, node1IndexByteOffset = 0, node2IndexByteOffset = 0, depth1 = 0, depth2 = 0, currBox = null, reversed = false) {
	let bufferStack1, bufferStack2;
	if (reversed) {
		bufferStack1 = _bufferStack2;
		bufferStack2 = _bufferStack1;
	} else {
		bufferStack1 = _bufferStack1;
		bufferStack2 = _bufferStack2;
	}
	const float32Array1 = bufferStack1.float32Array, uint32Array1 = bufferStack1.uint32Array, uint16Array1 = bufferStack1.uint16Array, float32Array2 = bufferStack2.float32Array, uint32Array2 = bufferStack2.uint32Array, uint16Array2 = bufferStack2.uint16Array;
	const node1Index16 = node1Index32 * 2;
	const node2Index16 = node2Index32 * 2;
	const isLeaf1 = IS_LEAF(node1Index16, uint16Array1);
	const isLeaf2 = IS_LEAF(node2Index16, uint16Array2);
	let result = false;
	if (isLeaf2 && isLeaf1) {
		if (reversed) result = intersectsRangesFunc(OFFSET(node2Index32, uint32Array2), COUNT(node2Index32 * 2, uint16Array2), OFFSET(node1Index32, uint32Array1), COUNT(node1Index32 * 2, uint16Array1), depth2, node2IndexByteOffset + node2Index32, depth1, node1IndexByteOffset + node1Index32);
		else result = intersectsRangesFunc(OFFSET(node1Index32, uint32Array1), COUNT(node1Index32 * 2, uint16Array1), OFFSET(node2Index32, uint32Array2), COUNT(node2Index32 * 2, uint16Array2), depth1, node1IndexByteOffset + node1Index32, depth2, node2IndexByteOffset + node2Index32);
	} else if (isLeaf2) {
		const newBox = _boxPool.getPrimitive();
		arrayToBox(BOUNDING_DATA_INDEX(node2Index32), float32Array2, newBox);
		newBox.applyMatrix4(matrix2to1);
		const cl1 = LEFT_NODE(node1Index32);
		const cr1 = RIGHT_NODE(node1Index32, uint32Array1);
		arrayToBox(BOUNDING_DATA_INDEX(cl1), float32Array1, _leftBox1);
		arrayToBox(BOUNDING_DATA_INDEX(cr1), float32Array1, _rightBox1);
		const intersectCl1 = newBox.intersectsBox(_leftBox1);
		const intersectCr1 = newBox.intersectsBox(_rightBox1);
		result = intersectCl1 && _traverse(node2Index32, cl1, matrix1to2, matrix2to1, intersectsRangesFunc, node2IndexByteOffset, node1IndexByteOffset, depth2, depth1 + 1, newBox, !reversed) || intersectCr1 && _traverse(node2Index32, cr1, matrix1to2, matrix2to1, intersectsRangesFunc, node2IndexByteOffset, node1IndexByteOffset, depth2, depth1 + 1, newBox, !reversed);
		_boxPool.releasePrimitive(newBox);
	} else {
		const cl2 = LEFT_NODE(node2Index32);
		const cr2 = RIGHT_NODE(node2Index32, uint32Array2);
		arrayToBox(BOUNDING_DATA_INDEX(cl2), float32Array2, _leftBox2);
		arrayToBox(BOUNDING_DATA_INDEX(cr2), float32Array2, _rightBox2);
		const leftIntersects = currBox.intersectsBox(_leftBox2);
		const rightIntersects = currBox.intersectsBox(_rightBox2);
		if (leftIntersects && rightIntersects) result = _traverse(node1Index32, cl2, matrix2to1, matrix1to2, intersectsRangesFunc, node1IndexByteOffset, node2IndexByteOffset, depth1, depth2 + 1, currBox, reversed) || _traverse(node1Index32, cr2, matrix2to1, matrix1to2, intersectsRangesFunc, node1IndexByteOffset, node2IndexByteOffset, depth1, depth2 + 1, currBox, reversed);
		else if (leftIntersects) {
			if (isLeaf1) result = _traverse(node1Index32, cl2, matrix2to1, matrix1to2, intersectsRangesFunc, node1IndexByteOffset, node2IndexByteOffset, depth1, depth2 + 1, currBox, reversed);
			else {
				const newBox = _boxPool.getPrimitive();
				newBox.copy(_leftBox2).applyMatrix4(matrix2to1);
				const cl1 = LEFT_NODE(node1Index32);
				const cr1 = RIGHT_NODE(node1Index32, uint32Array1);
				arrayToBox(BOUNDING_DATA_INDEX(cl1), float32Array1, _leftBox1);
				arrayToBox(BOUNDING_DATA_INDEX(cr1), float32Array1, _rightBox1);
				const intersectCl1 = newBox.intersectsBox(_leftBox1);
				const intersectCr1 = newBox.intersectsBox(_rightBox1);
				result = intersectCl1 && _traverse(cl2, cl1, matrix1to2, matrix2to1, intersectsRangesFunc, node2IndexByteOffset, node1IndexByteOffset, depth2, depth1 + 1, newBox, !reversed) || intersectCr1 && _traverse(cl2, cr1, matrix1to2, matrix2to1, intersectsRangesFunc, node2IndexByteOffset, node1IndexByteOffset, depth2, depth1 + 1, newBox, !reversed);
				_boxPool.releasePrimitive(newBox);
			}
		} else if (rightIntersects) {
			if (isLeaf1) result = _traverse(node1Index32, cr2, matrix2to1, matrix1to2, intersectsRangesFunc, node1IndexByteOffset, node2IndexByteOffset, depth1, depth2 + 1, currBox, reversed);
			else {
				const newBox = _boxPool.getPrimitive();
				newBox.copy(_rightBox2).applyMatrix4(matrix2to1);
				const cl1 = LEFT_NODE(node1Index32);
				const cr1 = RIGHT_NODE(node1Index32, uint32Array1);
				arrayToBox(BOUNDING_DATA_INDEX(cl1), float32Array1, _leftBox1);
				arrayToBox(BOUNDING_DATA_INDEX(cr1), float32Array1, _rightBox1);
				const intersectCl1 = newBox.intersectsBox(_leftBox1);
				const intersectCr1 = newBox.intersectsBox(_rightBox1);
				result = intersectCl1 && _traverse(cr2, cl1, matrix1to2, matrix2to1, intersectsRangesFunc, node2IndexByteOffset, node1IndexByteOffset, depth2, depth1 + 1, newBox, !reversed) || intersectCr1 && _traverse(cr2, cr1, matrix1to2, matrix2to1, intersectsRangesFunc, node2IndexByteOffset, node1IndexByteOffset, depth2, depth1 + 1, newBox, !reversed);
				_boxPool.releasePrimitive(newBox);
			}
		}
	}
	return result;
}
//#endregion
//#region node_modules/three-mesh-bvh/src/core/MeshBVH.js
var obb = /* @__PURE__ */ new OrientedBox();
var tempBox = /* @__PURE__ */ new Box3();
var DEFAULT_OPTIONS = {
	strategy: 0,
	maxDepth: 40,
	maxLeafTris: 10,
	useSharedArrayBuffer: false,
	setBoundingBox: true,
	onProgress: null,
	indirect: false,
	verbose: true,
	range: null
};
var MeshBVH = class MeshBVH {
	static serialize(bvh, options = {}) {
		options = {
			cloneBuffers: true,
			...options
		};
		const geometry = bvh.geometry;
		const rootData = bvh._roots;
		const indirectBuffer = bvh._indirectBuffer;
		const indexAttribute = geometry.getIndex();
		let result;
		if (options.cloneBuffers) result = {
			roots: rootData.map((root) => root.slice()),
			index: indexAttribute ? indexAttribute.array.slice() : null,
			indirectBuffer: indirectBuffer ? indirectBuffer.slice() : null
		};
		else result = {
			roots: rootData,
			index: indexAttribute ? indexAttribute.array : null,
			indirectBuffer
		};
		return result;
	}
	static deserialize(data, geometry, options = {}) {
		options = {
			setIndex: true,
			indirect: Boolean(data.indirectBuffer),
			...options
		};
		const { index, roots, indirectBuffer } = data;
		const bvh = new MeshBVH(geometry, {
			...options,
			[SKIP_GENERATION]: true
		});
		bvh._roots = roots;
		bvh._indirectBuffer = indirectBuffer || null;
		if (options.setIndex) {
			const indexAttribute = geometry.getIndex();
			if (indexAttribute === null) {
				const newIndex = new BufferAttribute(data.index, 1, false);
				geometry.setIndex(newIndex);
			} else if (indexAttribute.array !== index) {
				indexAttribute.array.set(index);
				indexAttribute.needsUpdate = true;
			}
		}
		return bvh;
	}
	get indirect() {
		return !!this._indirectBuffer;
	}
	constructor(geometry, options = {}) {
		if (!geometry.isBufferGeometry) throw new Error("MeshBVH: Only BufferGeometries are supported.");
		else if (geometry.index && geometry.index.isInterleavedBufferAttribute) throw new Error("MeshBVH: InterleavedBufferAttribute is not supported for the index attribute.");
		options = Object.assign({
			...DEFAULT_OPTIONS,
			[SKIP_GENERATION]: false
		}, options);
		if (options.useSharedArrayBuffer && !isSharedArrayBufferSupported()) throw new Error("MeshBVH: SharedArrayBuffer is not available.");
		this.geometry = geometry;
		this._roots = null;
		this._indirectBuffer = null;
		if (!options[SKIP_GENERATION]) {
			buildPackedTree(this, options);
			if (!geometry.boundingBox && options.setBoundingBox) geometry.boundingBox = this.getBoundingBox(new Box3());
		}
		this.resolveTriangleIndex = options.indirect ? (i) => this._indirectBuffer[i] : (i) => i;
	}
	refit(nodeIndices = null) {
		return (this.indirect ? refit_indirect : refit)(this, nodeIndices);
	}
	traverse(callback, rootIndex = 0) {
		const buffer = this._roots[rootIndex];
		const uint32Array = new Uint32Array(buffer);
		const uint16Array = new Uint16Array(buffer);
		_traverse(0);
		function _traverse(node32Index, depth = 0) {
			const node16Index = node32Index * 2;
			const isLeaf = uint16Array[node16Index + 15] === IS_LEAFNODE_FLAG;
			if (isLeaf) {
				const offset = uint32Array[node32Index + 6];
				const count = uint16Array[node16Index + 14];
				callback(depth, isLeaf, new Float32Array(buffer, node32Index * 4, 6), offset, count);
			} else {
				const left = node32Index + 8;
				const right = uint32Array[node32Index + 6];
				const splitAxis = uint32Array[node32Index + 7];
				if (!callback(depth, isLeaf, new Float32Array(buffer, node32Index * 4, 6), splitAxis)) {
					_traverse(left, depth + 1);
					_traverse(right, depth + 1);
				}
			}
		}
	}
	raycast(ray, materialOrSide = 0, near = 0, far = Infinity) {
		const roots = this._roots;
		const geometry = this.geometry;
		const intersects = [];
		const isMaterial = materialOrSide.isMaterial;
		const isArrayMaterial = Array.isArray(materialOrSide);
		const groups = geometry.groups;
		const side = isMaterial ? materialOrSide.side : materialOrSide;
		const raycastFunc = this.indirect ? raycast_indirect : raycast;
		for (let i = 0, l = roots.length; i < l; i++) {
			const materialSide = isArrayMaterial ? materialOrSide[groups[i].materialIndex].side : side;
			const startCount = intersects.length;
			raycastFunc(this, i, materialSide, ray, intersects, near, far);
			if (isArrayMaterial) {
				const materialIndex = groups[i].materialIndex;
				for (let j = startCount, jl = intersects.length; j < jl; j++) intersects[j].face.materialIndex = materialIndex;
			}
		}
		return intersects;
	}
	raycastFirst(ray, materialOrSide = 0, near = 0, far = Infinity) {
		const roots = this._roots;
		const geometry = this.geometry;
		const isMaterial = materialOrSide.isMaterial;
		const isArrayMaterial = Array.isArray(materialOrSide);
		let closestResult = null;
		const groups = geometry.groups;
		const side = isMaterial ? materialOrSide.side : materialOrSide;
		const raycastFirstFunc = this.indirect ? raycastFirst_indirect : raycastFirst;
		for (let i = 0, l = roots.length; i < l; i++) {
			const materialSide = isArrayMaterial ? materialOrSide[groups[i].materialIndex].side : side;
			const result = raycastFirstFunc(this, i, materialSide, ray, near, far);
			if (result != null && (closestResult == null || result.distance < closestResult.distance)) {
				closestResult = result;
				if (isArrayMaterial) result.face.materialIndex = groups[i].materialIndex;
			}
		}
		return closestResult;
	}
	intersectsGeometry(otherGeometry, geomToMesh) {
		let result = false;
		const roots = this._roots;
		const intersectsGeometryFunc = this.indirect ? intersectsGeometry_indirect : intersectsGeometry;
		for (let i = 0, l = roots.length; i < l; i++) {
			result = intersectsGeometryFunc(this, i, otherGeometry, geomToMesh);
			if (result) break;
		}
		return result;
	}
	shapecast(callbacks) {
		const triangle = ExtendedTrianglePool.getPrimitive();
		const iterateFunc = this.indirect ? iterateOverTriangles_indirect : iterateOverTriangles;
		let { boundsTraverseOrder, intersectsBounds, intersectsRange, intersectsTriangle } = callbacks;
		if (intersectsRange && intersectsTriangle) {
			const originalIntersectsRange = intersectsRange;
			intersectsRange = (offset, count, contained, depth, nodeIndex) => {
				if (!originalIntersectsRange(offset, count, contained, depth, nodeIndex)) return iterateFunc(offset, count, this, intersectsTriangle, contained, depth, triangle);
				return true;
			};
		} else if (!intersectsRange) {
			if (intersectsTriangle) intersectsRange = (offset, count, contained, depth) => {
				return iterateFunc(offset, count, this, intersectsTriangle, contained, depth, triangle);
			};
			else intersectsRange = (offset, count, contained) => {
				return contained;
			};
		}
		let result = false;
		let byteOffset = 0;
		const roots = this._roots;
		for (let i = 0, l = roots.length; i < l; i++) {
			const root = roots[i];
			result = shapecast(this, i, intersectsBounds, intersectsRange, boundsTraverseOrder, byteOffset);
			if (result) break;
			byteOffset += root.byteLength;
		}
		ExtendedTrianglePool.releasePrimitive(triangle);
		return result;
	}
	bvhcast(otherBvh, matrixToLocal, callbacks) {
		let { intersectsRanges, intersectsTriangles } = callbacks;
		const triangle1 = ExtendedTrianglePool.getPrimitive();
		const indexAttr1 = this.geometry.index;
		const positionAttr1 = this.geometry.attributes.position;
		const assignTriangle1 = this.indirect ? (i1) => {
			const ti = this.resolveTriangleIndex(i1);
			setTriangle(triangle1, ti * 3, indexAttr1, positionAttr1);
		} : (i1) => {
			setTriangle(triangle1, i1 * 3, indexAttr1, positionAttr1);
		};
		const triangle2 = ExtendedTrianglePool.getPrimitive();
		const indexAttr2 = otherBvh.geometry.index;
		const positionAttr2 = otherBvh.geometry.attributes.position;
		const assignTriangle2 = otherBvh.indirect ? (i2) => {
			const ti2 = otherBvh.resolveTriangleIndex(i2);
			setTriangle(triangle2, ti2 * 3, indexAttr2, positionAttr2);
		} : (i2) => {
			setTriangle(triangle2, i2 * 3, indexAttr2, positionAttr2);
		};
		if (intersectsTriangles) {
			const iterateOverDoubleTriangles = (offset1, count1, offset2, count2, depth1, index1, depth2, index2) => {
				for (let i2 = offset2, l2 = offset2 + count2; i2 < l2; i2++) {
					assignTriangle2(i2);
					triangle2.a.applyMatrix4(matrixToLocal);
					triangle2.b.applyMatrix4(matrixToLocal);
					triangle2.c.applyMatrix4(matrixToLocal);
					triangle2.needsUpdate = true;
					for (let i1 = offset1, l1 = offset1 + count1; i1 < l1; i1++) {
						assignTriangle1(i1);
						triangle1.needsUpdate = true;
						if (intersectsTriangles(triangle1, triangle2, i1, i2, depth1, index1, depth2, index2)) return true;
					}
				}
				return false;
			};
			if (intersectsRanges) {
				const originalIntersectsRanges = intersectsRanges;
				intersectsRanges = function(offset1, count1, offset2, count2, depth1, index1, depth2, index2) {
					if (!originalIntersectsRanges(offset1, count1, offset2, count2, depth1, index1, depth2, index2)) return iterateOverDoubleTriangles(offset1, count1, offset2, count2, depth1, index1, depth2, index2);
					return true;
				};
			} else intersectsRanges = iterateOverDoubleTriangles;
		}
		return bvhcast(this, otherBvh, matrixToLocal, intersectsRanges);
	}
	intersectsBox(box, boxToMesh) {
		obb.set(box.min, box.max, boxToMesh);
		obb.needsUpdate = true;
		return this.shapecast({
			intersectsBounds: (box) => obb.intersectsBox(box),
			intersectsTriangle: (tri) => obb.intersectsTriangle(tri)
		});
	}
	intersectsSphere(sphere) {
		return this.shapecast({
			intersectsBounds: (box) => sphere.intersectsBox(box),
			intersectsTriangle: (tri) => tri.intersectsSphere(sphere)
		});
	}
	closestPointToGeometry(otherGeometry, geometryToBvh, target1 = {}, target2 = {}, minThreshold = 0, maxThreshold = Infinity) {
		return (this.indirect ? closestPointToGeometry_indirect : closestPointToGeometry)(this, otherGeometry, geometryToBvh, target1, target2, minThreshold, maxThreshold);
	}
	closestPointToPoint(point, target = {}, minThreshold = 0, maxThreshold = Infinity) {
		return closestPointToPoint(this, point, target, minThreshold, maxThreshold);
	}
	getBoundingBox(target) {
		target.makeEmpty();
		this._roots.forEach((buffer) => {
			arrayToBox(0, new Float32Array(buffer), tempBox);
			target.union(tempBox);
		});
		return target;
	}
};
//#endregion
//#region node_modules/three-bvh-csg/src/core/utils/hashUtils.js
var HASH_WIDTH = 1e-6;
var HASH_HALF_WIDTH = HASH_WIDTH * .5;
var HASH_MULTIPLIER = Math.pow(10, -Math.log10(HASH_WIDTH));
var HASH_ADDITION = HASH_HALF_WIDTH * HASH_MULTIPLIER;
function hashNumber(v) {
	return ~~(v * HASH_MULTIPLIER + HASH_ADDITION);
}
function hashVertex2(v) {
	return `${hashNumber(v.x)},${hashNumber(v.y)}`;
}
function hashVertex3(v) {
	return `${hashNumber(v.x)},${hashNumber(v.y)},${hashNumber(v.z)}`;
}
function hashVertex4(v) {
	return `${hashNumber(v.x)},${hashNumber(v.y)},${hashNumber(v.z)},${hashNumber(v.w)}`;
}
function toNormalizedRay(v0, v1, target) {
	target.direction.subVectors(v1, v0).normalize();
	const scalar = v0.dot(target.direction);
	target.origin.copy(v0).addScaledVector(target.direction, -scalar);
	return target;
}
//#endregion
//#region node_modules/three-bvh-csg/src/core/utils/geometryUtils.js
function areSharedArrayBuffersSupported() {
	return typeof SharedArrayBuffer !== "undefined";
}
function convertToSharedArrayBuffer(array) {
	if (array.buffer instanceof SharedArrayBuffer) return array;
	const cons = array.constructor;
	const buffer = array.buffer;
	const sharedBuffer = new SharedArrayBuffer(buffer.byteLength);
	const uintArray = new Uint8Array(buffer);
	new Uint8Array(sharedBuffer).set(uintArray, 0);
	return new cons(sharedBuffer);
}
function getIndexArray(vertexCount, BufferConstructor = ArrayBuffer) {
	if (vertexCount > 65535) return new Uint32Array(new BufferConstructor(4 * vertexCount));
	else return new Uint16Array(new BufferConstructor(2 * vertexCount));
}
function ensureIndex(geo, options) {
	if (!geo.index) {
		const vertexCount = geo.attributes.position.count;
		const index = getIndexArray(vertexCount, options.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer);
		geo.setIndex(new BufferAttribute(index, 1));
		for (let i = 0; i < vertexCount; i++) index[i] = i;
	}
}
function getVertexCount(geo) {
	return geo.index ? geo.index.count : geo.attributes.position.count;
}
function getTriCount(geo) {
	return getVertexCount(geo) / 3;
}
//#endregion
//#region node_modules/three-bvh-csg/src/core/utils/halfEdgeUtils.js
var DEGENERATE_EPSILON = 1e-8;
var _tempVec = new Vector3();
function toTriIndex(v) {
	return ~~(v / 3);
}
function toEdgeIndex(v) {
	return v % 3;
}
function sortEdgeFunc(a, b) {
	return a.start - b.start;
}
function getProjectedDistance(ray, vec) {
	return _tempVec.subVectors(vec, ray.origin).dot(ray.direction);
}
function matchEdges(forward, reverse, disjointConnectivityMap, eps = DEGENERATE_EPSILON) {
	forward.sort(sortEdgeFunc);
	reverse.sort(sortEdgeFunc);
	for (let i = 0; i < forward.length; i++) {
		const e0 = forward[i];
		for (let o = 0; o < reverse.length; o++) {
			const e1 = reverse[o];
			if (e1.start > e0.end) {} else if (e0.end < e1.start || e1.end < e0.start) continue;
			else if (e0.start <= e1.start && e0.end >= e1.end) {
				if (!areDistancesDegenerate(e1.end, e0.end)) forward.splice(i + 1, 0, {
					start: e1.end,
					end: e0.end,
					index: e0.index
				});
				e0.end = e1.start;
				e1.start = 0;
				e1.end = 0;
			} else if (e0.start >= e1.start && e0.end <= e1.end) {
				if (!areDistancesDegenerate(e0.end, e1.end)) reverse.splice(o + 1, 0, {
					start: e0.end,
					end: e1.end,
					index: e1.index
				});
				e1.end = e0.start;
				e0.start = 0;
				e0.end = 0;
			} else if (e0.start <= e1.start && e0.end <= e1.end) {
				const tmp = e0.end;
				e0.end = e1.start;
				e1.start = tmp;
			} else if (e0.start >= e1.start && e0.end >= e1.end) {
				const tmp = e1.end;
				e1.end = e0.start;
				e0.start = tmp;
			} else throw new Error();
			if (!disjointConnectivityMap.has(e0.index)) disjointConnectivityMap.set(e0.index, []);
			if (!disjointConnectivityMap.has(e1.index)) disjointConnectivityMap.set(e1.index, []);
			disjointConnectivityMap.get(e0.index).push(e1.index);
			disjointConnectivityMap.get(e1.index).push(e0.index);
			if (isEdgeDegenerate(e1)) {
				reverse.splice(o, 1);
				o--;
			}
			if (isEdgeDegenerate(e0)) {
				forward.splice(i, 1);
				i--;
				break;
			}
		}
	}
	cleanUpEdgeSet(forward);
	cleanUpEdgeSet(reverse);
	function cleanUpEdgeSet(arr) {
		for (let i = 0; i < arr.length; i++) if (isEdgeDegenerate(arr[i])) {
			arr.splice(i, 1);
			i--;
		}
	}
	function areDistancesDegenerate(start, end) {
		return Math.abs(end - start) < eps;
	}
	function isEdgeDegenerate(e) {
		return Math.abs(e.end - e.start) < eps;
	}
}
//#endregion
//#region node_modules/three-bvh-csg/src/core/utils/RaySet.js
var DIST_EPSILON = 1e-5;
var ANGLE_EPSILON = 1e-4;
var RaySet = class {
	constructor() {
		this._rays = [];
	}
	addRay(ray) {
		this._rays.push(ray);
	}
	findClosestRay(ray) {
		const rays = this._rays;
		const inv = ray.clone();
		inv.direction.multiplyScalar(-1);
		let bestScore = Infinity;
		let bestRay = null;
		for (let i = 0, l = rays.length; i < l; i++) {
			const r = rays[i];
			if (skipRay(r, ray) && skipRay(r, inv)) continue;
			const rayScore = scoreRays(r, ray);
			const invScore = scoreRays(r, inv);
			const score = Math.min(rayScore, invScore);
			if (score < bestScore) {
				bestScore = score;
				bestRay = r;
			}
		}
		return bestRay;
		function skipRay(r0, r1) {
			const distOutOfThreshold = r0.origin.distanceTo(r1.origin) > DIST_EPSILON;
			return r0.direction.angleTo(r1.direction) > ANGLE_EPSILON || distOutOfThreshold;
		}
		function scoreRays(r0, r1) {
			const originDistance = r0.origin.distanceTo(r1.origin);
			const angleDistance = r0.direction.angleTo(r1.direction);
			return originDistance / DIST_EPSILON + angleDistance / ANGLE_EPSILON;
		}
	}
};
//#endregion
//#region node_modules/three-bvh-csg/src/core/utils/computeDisjointEdges.js
var _v0 = new Vector3();
var _v1 = new Vector3();
var _ray$1 = new Ray();
function computeDisjointEdges(geometry, unmatchedSet, eps) {
	const attributes = geometry.attributes;
	const indexAttr = geometry.index;
	const posAttr = attributes.position;
	const disjointConnectivityMap = /* @__PURE__ */ new Map();
	const fragmentMap = /* @__PURE__ */ new Map();
	const edges = Array.from(unmatchedSet);
	const rays = new RaySet();
	for (let i = 0, l = edges.length; i < l; i++) {
		const index = edges[i];
		const triIndex = toTriIndex(index);
		const edgeIndex = toEdgeIndex(index);
		let i0 = 3 * triIndex + edgeIndex;
		let i1 = 3 * triIndex + (edgeIndex + 1) % 3;
		if (indexAttr) {
			i0 = indexAttr.getX(i0);
			i1 = indexAttr.getX(i1);
		}
		_v0.fromBufferAttribute(posAttr, i0);
		_v1.fromBufferAttribute(posAttr, i1);
		toNormalizedRay(_v0, _v1, _ray$1);
		let info;
		let commonRay = rays.findClosestRay(_ray$1);
		if (commonRay === null) {
			commonRay = _ray$1.clone();
			rays.addRay(commonRay);
		}
		if (!fragmentMap.has(commonRay)) fragmentMap.set(commonRay, {
			forward: [],
			reverse: [],
			ray: commonRay
		});
		info = fragmentMap.get(commonRay);
		let start = getProjectedDistance(commonRay, _v0);
		let end = getProjectedDistance(commonRay, _v1);
		if (start > end) [start, end] = [end, start];
		if (_ray$1.direction.dot(commonRay.direction) < 0) info.reverse.push({
			start,
			end,
			index
		});
		else info.forward.push({
			start,
			end,
			index
		});
	}
	fragmentMap.forEach(({ forward, reverse }, ray) => {
		matchEdges(forward, reverse, disjointConnectivityMap, eps);
		if (forward.length === 0 && reverse.length === 0) fragmentMap.delete(ray);
	});
	return {
		disjointConnectivityMap,
		fragmentMap
	};
}
//#endregion
//#region node_modules/three-bvh-csg/src/core/HalfEdgeMap.js
var _vec2 = new Vector2();
var _vec3$1 = new Vector3();
var _vec4 = new Vector4();
var _hashes = [
	"",
	"",
	""
];
var HalfEdgeMap = class {
	constructor(geometry = null) {
		this.data = null;
		this.disjointConnections = null;
		this.unmatchedDisjointEdges = null;
		this.unmatchedEdges = -1;
		this.matchedEdges = -1;
		this.useDrawRange = true;
		this.useAllAttributes = false;
		this.matchDisjointEdges = false;
		this.degenerateEpsilon = 1e-8;
		if (geometry) this.updateFrom(geometry);
	}
	getSiblingTriangleIndex(triIndex, edgeIndex) {
		const otherIndex = this.data[triIndex * 3 + edgeIndex];
		return otherIndex === -1 ? -1 : ~~(otherIndex / 3);
	}
	getSiblingEdgeIndex(triIndex, edgeIndex) {
		const otherIndex = this.data[triIndex * 3 + edgeIndex];
		return otherIndex === -1 ? -1 : otherIndex % 3;
	}
	getDisjointSiblingTriangleIndices(triIndex, edgeIndex) {
		const index = triIndex * 3 + edgeIndex;
		const arr = this.disjointConnections.get(index);
		return arr ? arr.map((i) => ~~(i / 3)) : [];
	}
	getDisjointSiblingEdgeIndices(triIndex, edgeIndex) {
		const index = triIndex * 3 + edgeIndex;
		const arr = this.disjointConnections.get(index);
		return arr ? arr.map((i) => i % 3) : [];
	}
	isFullyConnected() {
		return this.unmatchedEdges === 0;
	}
	updateFrom(geometry) {
		const { useAllAttributes, useDrawRange, matchDisjointEdges, degenerateEpsilon } = this;
		const hashFunction = useAllAttributes ? hashAllAttributes : hashPositionAttribute;
		const map = /* @__PURE__ */ new Map();
		const { attributes } = geometry;
		const attrKeys = useAllAttributes ? Object.keys(attributes) : null;
		const indexAttr = geometry.index;
		const posAttr = attributes.position;
		let triCount = getTriCount(geometry);
		const maxTriCount = triCount;
		let offset = 0;
		if (useDrawRange) {
			offset = geometry.drawRange.start;
			if (geometry.drawRange.count !== Infinity) triCount = ~~(geometry.drawRange.count / 3);
		}
		let data = this.data;
		if (!data || data.length < 3 * maxTriCount) data = new Int32Array(3 * maxTriCount);
		data.fill(-1);
		let matchedEdges = 0;
		let unmatchedSet = /* @__PURE__ */ new Set();
		for (let i = offset, l = triCount * 3 + offset; i < l; i += 3) {
			const i3 = i;
			for (let e = 0; e < 3; e++) {
				let i0 = i3 + e;
				if (indexAttr) i0 = indexAttr.getX(i0);
				_hashes[e] = hashFunction(i0);
			}
			for (let e = 0; e < 3; e++) {
				const nextE = (e + 1) % 3;
				const vh0 = _hashes[e];
				const vh1 = _hashes[nextE];
				const reverseHash = `${vh1}_${vh0}`;
				if (map.has(reverseHash)) {
					const index = i3 + e;
					const otherIndex = map.get(reverseHash);
					data[index] = otherIndex;
					data[otherIndex] = index;
					map.delete(reverseHash);
					matchedEdges += 2;
					unmatchedSet.delete(otherIndex);
				} else {
					const hash = `${vh0}_${vh1}`;
					const index = i3 + e;
					map.set(hash, index);
					unmatchedSet.add(index);
				}
			}
		}
		if (matchDisjointEdges) {
			const { fragmentMap, disjointConnectivityMap } = computeDisjointEdges(geometry, unmatchedSet, degenerateEpsilon);
			unmatchedSet.clear();
			fragmentMap.forEach(({ forward, reverse }) => {
				forward.forEach(({ index }) => unmatchedSet.add(index));
				reverse.forEach(({ index }) => unmatchedSet.add(index));
			});
			this.unmatchedDisjointEdges = fragmentMap;
			this.disjointConnections = disjointConnectivityMap;
			matchedEdges = triCount * 3 - unmatchedSet.size;
		}
		this.matchedEdges = matchedEdges;
		this.unmatchedEdges = unmatchedSet.size;
		this.data = data;
		function hashPositionAttribute(i) {
			_vec3$1.fromBufferAttribute(posAttr, i);
			return hashVertex3(_vec3$1);
		}
		function hashAllAttributes(i) {
			let result = "";
			for (let k = 0, l = attrKeys.length; k < l; k++) {
				const attr = attributes[attrKeys[k]];
				let str;
				switch (attr.itemSize) {
					case 1:
						str = hashNumber(attr.getX(i));
						break;
					case 2:
						str = hashVertex2(_vec2.fromBufferAttribute(attr, i));
						break;
					case 3:
						str = hashVertex3(_vec3$1.fromBufferAttribute(attr, i));
						break;
					case 4: str = hashVertex4(_vec4.fromBufferAttribute(attr, i));
				}
				if (result !== "") result += "|";
				result += str;
			}
			return result;
		}
	}
};
//#endregion
//#region node_modules/three-bvh-csg/src/core/Brush.js
var Brush = class extends Mesh {
	constructor(...args) {
		super(...args);
		this.isBrush = true;
		this._previousMatrix = new Matrix4();
		this._previousMatrix.elements.fill(0);
	}
	markUpdated() {
		this._previousMatrix.copy(this.matrix);
	}
	isDirty() {
		const { matrix, _previousMatrix } = this;
		const el1 = matrix.elements;
		const el2 = _previousMatrix.elements;
		for (let i = 0; i < 16; i++) if (el1[i] !== el2[i]) return true;
		return false;
	}
	prepareGeometry() {
		const geometry = this.geometry;
		const attributes = geometry.attributes;
		const useSharedArrayBuffer = areSharedArrayBuffersSupported();
		if (useSharedArrayBuffer) for (const key in attributes) {
			const attribute = attributes[key];
			if (attribute.isInterleavedBufferAttribute) throw new Error("Brush: InterleavedBufferAttributes are not supported.");
			attribute.array = convertToSharedArrayBuffer(attribute.array);
		}
		if (!geometry.boundsTree) {
			ensureIndex(geometry, { useSharedArrayBuffer });
			geometry.boundsTree = new MeshBVH(geometry, {
				maxLeafTris: 3,
				indirect: true,
				useSharedArrayBuffer
			});
		}
		if (!geometry.halfEdges) geometry.halfEdges = new HalfEdgeMap(geometry);
		if (!geometry.groupIndices) {
			const triCount = getTriCount(geometry);
			const array = new Uint16Array(triCount);
			const groups = geometry.groups;
			for (let i = 0, l = groups.length; i < l; i++) {
				const { start, count } = groups[i];
				for (let g = start / 3, lg = (start + count) / 3; g < lg; g++) array[g] = i;
			}
			geometry.groupIndices = array;
		}
	}
	disposeCacheData() {
		const { geometry } = this;
		geometry.halfEdges = null;
		geometry.boundsTree = null;
		geometry.groupIndices = null;
	}
};
//#endregion
//#region node_modules/three-bvh-csg/src/core/utils/triangleUtils.js
var EPSILON$1 = 1e-14;
var _AB = new Vector3();
var _AC = new Vector3();
var _CB = new Vector3();
function isTriDegenerate(tri, eps = EPSILON$1) {
	_AB.subVectors(tri.b, tri.a);
	_AC.subVectors(tri.c, tri.a);
	_CB.subVectors(tri.b, tri.c);
	const angle1 = _AB.angleTo(_AC);
	const angle2 = _AB.angleTo(_CB);
	const angle3 = Math.PI - angle1 - angle2;
	return Math.abs(angle1) < eps || Math.abs(angle2) < eps || Math.abs(angle3) < eps || tri.a.distanceToSquared(tri.b) < eps || tri.a.distanceToSquared(tri.c) < eps || tri.b.distanceToSquared(tri.c) < eps;
}
//#endregion
//#region node_modules/three-bvh-csg/src/core/TriangleSplitter.js
var EPSILON = 1e-10;
var COPLANAR_EPSILON = 1e-10;
var PARALLEL_EPSILON = 1e-10;
var _edge$1 = new Line3();
var _foundEdge = new Line3();
var _vec = new Vector3();
var _triangleNormal = new Vector3();
var _planeNormal = new Vector3();
var _plane = new Plane();
var _splittingTriangle = new ExtendedTriangle();
var TrianglePool = class {
	constructor() {
		this._pool = [];
		this._index = 0;
	}
	getTriangle() {
		if (this._index >= this._pool.length) this._pool.push(new Triangle());
		return this._pool[this._index++];
	}
	clear() {
		this._index = 0;
	}
	reset() {
		this._pool.length = 0;
		this._index = 0;
	}
};
var TriangleSplitter = class {
	constructor() {
		this.trianglePool = new TrianglePool();
		this.triangles = [];
		this.normal = new Vector3();
		this.coplanarTriangleUsed = false;
	}
	initialize(tri) {
		this.reset();
		const { triangles, trianglePool, normal } = this;
		if (Array.isArray(tri)) for (let i = 0, l = tri.length; i < l; i++) {
			const t = tri[i];
			if (i === 0) t.getNormal(normal);
			else if (Math.abs(1 - t.getNormal(_vec).dot(normal)) > EPSILON) throw new Error("Triangle Splitter: Cannot initialize with triangles that have different normals.");
			const poolTri = trianglePool.getTriangle();
			poolTri.copy(t);
			triangles.push(poolTri);
		}
		else {
			tri.getNormal(normal);
			const poolTri = trianglePool.getTriangle();
			poolTri.copy(tri);
			triangles.push(poolTri);
		}
	}
	splitByTriangle(triangle) {
		const { normal, triangles } = this;
		triangle.getNormal(_triangleNormal).normalize();
		if (Math.abs(1 - Math.abs(_triangleNormal.dot(normal))) < PARALLEL_EPSILON) {
			this.coplanarTriangleUsed = true;
			for (let i = 0, l = triangles.length; i < l; i++) {
				const t = triangles[i];
				t.coplanarCount = 0;
			}
			const arr = [
				triangle.a,
				triangle.b,
				triangle.c
			];
			for (let i = 0; i < 3; i++) {
				const nexti = (i + 1) % 3;
				const v0 = arr[i];
				const v1 = arr[nexti];
				_vec.subVectors(v1, v0).normalize();
				_planeNormal.crossVectors(_triangleNormal, _vec);
				_plane.setFromNormalAndCoplanarPoint(_planeNormal, v0);
				this.splitByPlane(_plane, triangle);
			}
		} else {
			triangle.getPlane(_plane);
			this.splitByPlane(_plane, triangle);
		}
	}
	splitByPlane(plane, clippingTriangle) {
		const { triangles, trianglePool } = this;
		_splittingTriangle.copy(clippingTriangle);
		_splittingTriangle.needsUpdate = true;
		for (let i = 0, l = triangles.length; i < l; i++) {
			const tri = triangles[i];
			if (!_splittingTriangle.intersectsTriangle(tri, _edge$1, true)) continue;
			const { a, b, c } = tri;
			let intersects = 0;
			let vertexSplitEnd = -1;
			let coplanarEdge = false;
			let posSideVerts = [];
			let negSideVerts = [];
			const arr = [
				a,
				b,
				c
			];
			for (let t = 0; t < 3; t++) {
				const tNext = (t + 1) % 3;
				_edge$1.start.copy(arr[t]);
				_edge$1.end.copy(arr[tNext]);
				const startDist = plane.distanceToPoint(_edge$1.start);
				const endDist = plane.distanceToPoint(_edge$1.end);
				if (Math.abs(startDist) < COPLANAR_EPSILON && Math.abs(endDist) < COPLANAR_EPSILON) {
					coplanarEdge = true;
					break;
				}
				if (startDist > 0) posSideVerts.push(t);
				else negSideVerts.push(t);
				if (Math.abs(startDist) < COPLANAR_EPSILON) continue;
				let didIntersect = !!plane.intersectLine(_edge$1, _vec);
				if (!didIntersect && Math.abs(endDist) < COPLANAR_EPSILON) {
					_vec.copy(_edge$1.end);
					didIntersect = true;
				}
				if (didIntersect && !(_vec.distanceTo(_edge$1.start) < EPSILON)) {
					if (_vec.distanceTo(_edge$1.end) < EPSILON) vertexSplitEnd = t;
					if (intersects === 0) _foundEdge.start.copy(_vec);
					else _foundEdge.end.copy(_vec);
					intersects++;
				}
			}
			if (!coplanarEdge && intersects === 2 && _foundEdge.distance() > COPLANAR_EPSILON) {
				if (vertexSplitEnd !== -1) {
					vertexSplitEnd = (vertexSplitEnd + 1) % 3;
					let otherVert1 = 0;
					if (otherVert1 === vertexSplitEnd) otherVert1 = (otherVert1 + 1) % 3;
					let otherVert2 = otherVert1 + 1;
					if (otherVert2 === vertexSplitEnd) otherVert2 = (otherVert2 + 1) % 3;
					const nextTri = trianglePool.getTriangle();
					nextTri.a.copy(arr[otherVert2]);
					nextTri.b.copy(_foundEdge.end);
					nextTri.c.copy(_foundEdge.start);
					if (!isTriDegenerate(nextTri)) triangles.push(nextTri);
					tri.a.copy(arr[otherVert1]);
					tri.b.copy(_foundEdge.start);
					tri.c.copy(_foundEdge.end);
					if (isTriDegenerate(tri)) {
						triangles.splice(i, 1);
						i--;
						l--;
					}
				} else {
					const singleVert = posSideVerts.length >= 2 ? negSideVerts[0] : posSideVerts[0];
					if (singleVert === 0) {
						let tmp = _foundEdge.start;
						_foundEdge.start = _foundEdge.end;
						_foundEdge.end = tmp;
					}
					const nextVert1 = (singleVert + 1) % 3;
					const nextVert2 = (singleVert + 2) % 3;
					const nextTri1 = trianglePool.getTriangle();
					const nextTri2 = trianglePool.getTriangle();
					if (arr[nextVert1].distanceToSquared(_foundEdge.start) < arr[nextVert2].distanceToSquared(_foundEdge.end)) {
						nextTri1.a.copy(arr[nextVert1]);
						nextTri1.b.copy(_foundEdge.start);
						nextTri1.c.copy(_foundEdge.end);
						nextTri2.a.copy(arr[nextVert1]);
						nextTri2.b.copy(arr[nextVert2]);
						nextTri2.c.copy(_foundEdge.start);
					} else {
						nextTri1.a.copy(arr[nextVert2]);
						nextTri1.b.copy(_foundEdge.start);
						nextTri1.c.copy(_foundEdge.end);
						nextTri2.a.copy(arr[nextVert1]);
						nextTri2.b.copy(arr[nextVert2]);
						nextTri2.c.copy(_foundEdge.end);
					}
					tri.a.copy(arr[singleVert]);
					tri.b.copy(_foundEdge.end);
					tri.c.copy(_foundEdge.start);
					if (!isTriDegenerate(nextTri1)) triangles.push(nextTri1);
					if (!isTriDegenerate(nextTri2)) triangles.push(nextTri2);
					if (isTriDegenerate(tri)) {
						triangles.splice(i, 1);
						i--;
						l--;
					}
				}
			} else if (intersects === 3) console.warn("TriangleClipper: Coplanar clip not handled");
		}
	}
	reset() {
		this.triangles.length = 0;
		this.trianglePool.clear();
		this.coplanarTriangleUsed = false;
	}
};
//#endregion
//#region node_modules/three-bvh-csg/src/core/TypeBackedArray.js
function ceilToFourByteStride(byteLength) {
	byteLength = ~~byteLength;
	return byteLength + 4 - byteLength % 4;
}
var TypeBackedArray = class {
	constructor(type, initialSize = 500) {
		this.expansionFactor = 1.5;
		this.type = type;
		this.length = 0;
		this.array = null;
		this.setSize(initialSize);
	}
	setType(type) {
		if (this.length !== 0) throw new Error("TypeBackedArray: Cannot change the type while there is used data in the buffer.");
		const buffer = this.array.buffer;
		this.array = new type(buffer);
		this.type = type;
	}
	setSize(size) {
		if (this.array && size === this.array.length) return;
		const type = this.type;
		const newArray = new type(new (areSharedArrayBuffersSupported() ? SharedArrayBuffer : ArrayBuffer)(ceilToFourByteStride(size * type.BYTES_PER_ELEMENT)));
		if (this.array) newArray.set(this.array, 0);
		this.array = newArray;
	}
	expand() {
		const { array, expansionFactor } = this;
		this.setSize(array.length * expansionFactor);
	}
	push(...args) {
		let { array, length } = this;
		if (length + args.length > array.length) {
			this.expand();
			array = this.array;
		}
		for (let i = 0, l = args.length; i < l; i++) array[length + i] = args[i];
		this.length += args.length;
	}
	clear() {
		this.length = 0;
	}
};
//#endregion
//#region node_modules/three-bvh-csg/src/core/TypedAttributeData.js
var TypedAttributeData = class {
	constructor() {
		this.groupAttributes = [{}];
		this.groupCount = 0;
	}
	getType(name) {
		return this.groupAttributes[0][name].type;
	}
	getItemSize(name) {
		return this.groupAttributes[0][name].itemSize;
	}
	getNormalized(name) {
		return this.groupAttributes[0][name].normalized;
	}
	getCount(index) {
		if (this.groupCount <= index) return 0;
		const pos = this.getGroupAttrArray("position", index);
		return pos.length / pos.itemSize;
	}
	getTotalLength(name) {
		const { groupCount, groupAttributes } = this;
		let length = 0;
		for (let i = 0; i < groupCount; i++) {
			const attrSet = groupAttributes[i];
			length += attrSet[name].length;
		}
		return length;
	}
	getGroupAttrSet(index = 0) {
		const { groupAttributes } = this;
		if (groupAttributes[index]) {
			this.groupCount = Math.max(this.groupCount, index + 1);
			return groupAttributes[index];
		}
		const refAttrSet = groupAttributes[0];
		this.groupCount = Math.max(this.groupCount, index + 1);
		while (index >= groupAttributes.length) {
			const newAttrSet = {};
			groupAttributes.push(newAttrSet);
			for (const key in refAttrSet) {
				const refAttr = refAttrSet[key];
				const newAttr = new TypeBackedArray(refAttr.type);
				newAttr.itemSize = refAttr.itemSize;
				newAttr.normalized = refAttr.normalized;
				newAttrSet[key] = newAttr;
			}
		}
		return groupAttributes[index];
	}
	getGroupAttrArray(name, index = 0) {
		const { groupAttributes } = this;
		if (!groupAttributes[0][name]) throw new Error(`TypedAttributeData: Attribute with "${name}" has not been initialized`);
		return this.getGroupAttrSet(index)[name];
	}
	initializeArray(name, type, itemSize, normalized) {
		const { groupAttributes } = this;
		const referenceAttr = groupAttributes[0][name];
		if (referenceAttr) {
			if (referenceAttr.type !== type) for (let i = 0, l = groupAttributes.length; i < l; i++) {
				const arr = groupAttributes[i][name];
				arr.setType(type);
				arr.itemSize = itemSize;
				arr.normalized = normalized;
			}
		} else for (let i = 0, l = groupAttributes.length; i < l; i++) {
			const arr = new TypeBackedArray(type);
			arr.itemSize = itemSize;
			arr.normalized = normalized;
			groupAttributes[i][name] = arr;
		}
	}
	clear() {
		this.groupCount = 0;
		const { groupAttributes } = this;
		groupAttributes.forEach((attrSet) => {
			for (const key in attrSet) attrSet[key].clear();
		});
	}
	delete(key) {
		this.groupAttributes.forEach((attrSet) => {
			delete attrSet[key];
		});
	}
	reset() {
		this.groupAttributes = [];
		this.groupCount = 0;
	}
};
//#endregion
//#region node_modules/three-bvh-csg/src/core/IntersectionMap.js
var IntersectionMap = class {
	constructor() {
		this.intersectionSet = {};
		this.ids = [];
	}
	add(id, intersectionId) {
		const { intersectionSet, ids } = this;
		if (!intersectionSet[id]) {
			intersectionSet[id] = [];
			ids.push(id);
		}
		intersectionSet[id].push(intersectionId);
	}
};
//#endregion
//#region node_modules/three-bvh-csg/src/core/operations/operationsUtils.js
var _ray = new Ray();
var _matrix$1 = new Matrix4();
var _tri$1 = new Triangle();
var _vec3 = new Vector3();
var _vec4a = new Vector4();
var _vec4b = new Vector4();
var _vec4c = new Vector4();
var _vec4_0 = new Vector4();
var _vec4_1 = new Vector4();
var _vec4_2 = new Vector4();
var _edge = new Line3();
var _normal = new Vector3();
var JITTER_EPSILON = 1e-8;
var OFFSET_EPSILON = 1e-15;
var FLOATING_COPLANAR_EPSILON = 1e-14;
var _debugContext = null;
function setDebugContext(debugData) {
	_debugContext = debugData;
}
function getHitSide(tri, bvh) {
	tri.getMidpoint(_ray.origin);
	tri.getNormal(_ray.direction);
	const hit = bvh.raycastFirst(_ray, 2);
	return Boolean(hit && _ray.direction.dot(hit.face.normal) > 0) ? -1 : 1;
}
function getHitSideWithCoplanarCheck(tri, bvh) {
	function rand() {
		return Math.random() - .5;
	}
	tri.getNormal(_normal);
	_ray.direction.copy(_normal);
	tri.getMidpoint(_ray.origin);
	const total = 3;
	let count = 0;
	let minDistance = Infinity;
	for (let i = 0; i < total; i++) {
		_ray.direction.x += rand() * JITTER_EPSILON;
		_ray.direction.y += rand() * JITTER_EPSILON;
		_ray.direction.z += rand() * JITTER_EPSILON;
		_ray.direction.multiplyScalar(-1);
		const hit = bvh.raycastFirst(_ray, 2);
		if (Boolean(hit && _ray.direction.dot(hit.face.normal) > 0)) count++;
		if (hit !== null) minDistance = Math.min(minDistance, hit.distance);
		if (minDistance <= OFFSET_EPSILON) return hit.face.normal.dot(_normal) > 0 ? 2 : -2;
		if (count / total > .5 || (i - count + 1) / total > .5) break;
	}
	return count / total > .5 ? -1 : 1;
}
function collectIntersectingTriangles(a, b) {
	const aIntersections = new IntersectionMap();
	const bIntersections = new IntersectionMap();
	_matrix$1.copy(a.matrixWorld).invert().multiply(b.matrixWorld);
	a.geometry.boundsTree.bvhcast(b.geometry.boundsTree, _matrix$1, { intersectsTriangles(triangleA, triangleB, ia, ib) {
		if (!isTriDegenerate(triangleA) && !isTriDegenerate(triangleB)) {
			let intersected = triangleA.intersectsTriangle(triangleB, _edge, true);
			if (!intersected) {
				const pa = triangleA.plane;
				const pb = triangleB.plane;
				const na = pa.normal;
				const nb = pb.normal;
				if (na.dot(nb) === 1 && Math.abs(pa.constant - pb.constant) < FLOATING_COPLANAR_EPSILON) intersected = true;
			}
			if (intersected) {
				let va = a.geometry.boundsTree.resolveTriangleIndex(ia);
				let vb = b.geometry.boundsTree.resolveTriangleIndex(ib);
				aIntersections.add(va, vb);
				bIntersections.add(vb, va);
				if (_debugContext) {
					_debugContext.addEdge(_edge);
					_debugContext.addIntersectingTriangles(ia, triangleA, ib, triangleB);
				}
			}
		}
		return false;
	} });
	return {
		aIntersections,
		bIntersections
	};
}
function appendAttributeFromTriangle(triIndex, baryCoordTri, geometry, matrixWorld, normalMatrix, attributeData, invert = false) {
	const attributes = geometry.attributes;
	const indexAttr = geometry.index;
	const i3 = triIndex * 3;
	const i0 = indexAttr.getX(i3 + 0);
	const i1 = indexAttr.getX(i3 + 1);
	const i2 = indexAttr.getX(i3 + 2);
	for (const key in attributeData) {
		const attr = attributes[key];
		const arr = attributeData[key];
		if (!(key in attributes)) throw new Error(`CSG Operations: Attribute ${key} not available on geometry.`);
		const itemSize = attr.itemSize;
		if (key === "position") {
			_tri$1.a.fromBufferAttribute(attr, i0).applyMatrix4(matrixWorld);
			_tri$1.b.fromBufferAttribute(attr, i1).applyMatrix4(matrixWorld);
			_tri$1.c.fromBufferAttribute(attr, i2).applyMatrix4(matrixWorld);
			pushBarycoordInterpolatedValues(_tri$1.a, _tri$1.b, _tri$1.c, baryCoordTri, 3, arr, invert);
		} else if (key === "normal") {
			_tri$1.a.fromBufferAttribute(attr, i0).applyNormalMatrix(normalMatrix);
			_tri$1.b.fromBufferAttribute(attr, i1).applyNormalMatrix(normalMatrix);
			_tri$1.c.fromBufferAttribute(attr, i2).applyNormalMatrix(normalMatrix);
			if (invert) {
				_tri$1.a.multiplyScalar(-1);
				_tri$1.b.multiplyScalar(-1);
				_tri$1.c.multiplyScalar(-1);
			}
			pushBarycoordInterpolatedValues(_tri$1.a, _tri$1.b, _tri$1.c, baryCoordTri, 3, arr, invert, true);
		} else {
			_vec4a.fromBufferAttribute(attr, i0);
			_vec4b.fromBufferAttribute(attr, i1);
			_vec4c.fromBufferAttribute(attr, i2);
			pushBarycoordInterpolatedValues(_vec4a, _vec4b, _vec4c, baryCoordTri, itemSize, arr, invert);
		}
	}
}
function appendAttributesFromIndices(i0, i1, i2, attributes, matrixWorld, normalMatrix, attributeData, invert = false) {
	appendAttributeFromIndex(i0, attributes, matrixWorld, normalMatrix, attributeData, invert);
	appendAttributeFromIndex(invert ? i2 : i1, attributes, matrixWorld, normalMatrix, attributeData, invert);
	appendAttributeFromIndex(invert ? i1 : i2, attributes, matrixWorld, normalMatrix, attributeData, invert);
}
function getOperationAction(operation, hitSide, invert = false) {
	switch (operation) {
		case 0:
			if (hitSide === 1 || hitSide === 2 && !invert) return 1;
			break;
		case 1:
			if (invert) {
				if (hitSide === -1) return 0;
			} else if (hitSide === 1 || hitSide === -2) return 1;
			break;
		case 2:
			if (invert) {
				if (hitSide === 1 || hitSide === -2) return 1;
			} else if (hitSide === -1) return 0;
			break;
		case 4:
			if (hitSide === -1) return 0;
			else if (hitSide === 1) return 1;
			break;
		case 3:
			if (hitSide === -1 || hitSide === 2 && !invert) return 1;
			break;
		case 5:
			if (!invert && (hitSide === 1 || hitSide === -2)) return 1;
			break;
		case 6:
			if (!invert && (hitSide === -1 || hitSide === 2)) return 1;
			break;
		default: throw new Error(`Unrecognized CSG operation enum "${operation}".`);
	}
	return 2;
}
function pushBarycoordInterpolatedValues(v0, v1, v2, baryCoordTri, itemSize, attrArr, invert = false, normalize = false) {
	const addValues = (v) => {
		attrArr.push(v.x);
		if (itemSize > 1) attrArr.push(v.y);
		if (itemSize > 2) attrArr.push(v.z);
		if (itemSize > 3) attrArr.push(v.w);
	};
	_vec4_0.set(0, 0, 0, 0).addScaledVector(v0, baryCoordTri.a.x).addScaledVector(v1, baryCoordTri.a.y).addScaledVector(v2, baryCoordTri.a.z);
	_vec4_1.set(0, 0, 0, 0).addScaledVector(v0, baryCoordTri.b.x).addScaledVector(v1, baryCoordTri.b.y).addScaledVector(v2, baryCoordTri.b.z);
	_vec4_2.set(0, 0, 0, 0).addScaledVector(v0, baryCoordTri.c.x).addScaledVector(v1, baryCoordTri.c.y).addScaledVector(v2, baryCoordTri.c.z);
	if (normalize) {
		_vec4_0.normalize();
		_vec4_1.normalize();
		_vec4_2.normalize();
	}
	addValues(_vec4_0);
	if (invert) {
		addValues(_vec4_2);
		addValues(_vec4_1);
	} else {
		addValues(_vec4_1);
		addValues(_vec4_2);
	}
}
function appendAttributeFromIndex(index, attributes, matrixWorld, normalMatrix, attributeData, invert = false) {
	for (const key in attributeData) {
		const attr = attributes[key];
		const arr = attributeData[key];
		if (!(key in attributes)) throw new Error(`CSG Operations: Attribute ${key} no available on geometry.`);
		const itemSize = attr.itemSize;
		if (key === "position") {
			_vec3.fromBufferAttribute(attr, index).applyMatrix4(matrixWorld);
			arr.push(_vec3.x, _vec3.y, _vec3.z);
		} else if (key === "normal") {
			_vec3.fromBufferAttribute(attr, index).applyNormalMatrix(normalMatrix);
			if (invert) _vec3.multiplyScalar(-1);
			arr.push(_vec3.x, _vec3.y, _vec3.z);
		} else {
			arr.push(attr.getX(index));
			if (itemSize > 1) arr.push(attr.getY(index));
			if (itemSize > 2) arr.push(attr.getZ(index));
			if (itemSize > 3) arr.push(attr.getW(index));
		}
	}
}
//#endregion
//#region node_modules/three-bvh-csg/src/core/debug/OperationDebugData.js
var TriangleIntersectData = class {
	constructor(tri) {
		this.triangle = new Triangle().copy(tri);
		this.intersects = {};
	}
	addTriangle(index, tri) {
		this.intersects[index] = new Triangle().copy(tri);
	}
	getIntersectArray() {
		const array = [];
		const { intersects } = this;
		for (const key in intersects) array.push(intersects[key]);
		return array;
	}
};
var TriangleIntersectionSets = class {
	constructor() {
		this.data = {};
	}
	addTriangleIntersection(ia, triA, ib, triB) {
		const { data } = this;
		if (!data[ia]) data[ia] = new TriangleIntersectData(triA);
		data[ia].addTriangle(ib, triB);
	}
	getTrianglesAsArray(id = null) {
		const { data } = this;
		const arr = [];
		if (id !== null) {
			if (id in data) arr.push(data[id].triangle);
		} else for (const key in data) arr.push(data[key].triangle);
		return arr;
	}
	getTriangleIndices() {
		return Object.keys(this.data).map((i) => parseInt(i));
	}
	getIntersectionIndices(id) {
		const { data } = this;
		if (!data[id]) return [];
		else return Object.keys(data[id].intersects).map((i) => parseInt(i));
	}
	getIntersectionsAsArray(id = null, id2 = null) {
		const { data } = this;
		const triSet = /* @__PURE__ */ new Set();
		const arr = [];
		const addTriangles = (key) => {
			if (!data[key]) return;
			if (id2 !== null) {
				if (data[key].intersects[id2]) arr.push(data[key].intersects[id2]);
			} else {
				const intersects = data[key].intersects;
				for (const key2 in intersects) if (!triSet.has(key2)) {
					triSet.add(key2);
					arr.push(intersects[key2]);
				}
			}
		};
		if (id !== null) addTriangles(id);
		else for (const key in data) addTriangles(key);
		return arr;
	}
	reset() {
		this.data = {};
	}
};
var OperationDebugData = class {
	constructor() {
		this.enabled = false;
		this.triangleIntersectsA = new TriangleIntersectionSets();
		this.triangleIntersectsB = new TriangleIntersectionSets();
		this.intersectionEdges = [];
	}
	addIntersectingTriangles(ia, triA, ib, triB) {
		const { triangleIntersectsA, triangleIntersectsB } = this;
		triangleIntersectsA.addTriangleIntersection(ia, triA, ib, triB);
		triangleIntersectsB.addTriangleIntersection(ib, triB, ia, triA);
	}
	addEdge(edge) {
		this.intersectionEdges.push(edge.clone());
	}
	reset() {
		this.triangleIntersectsA.reset();
		this.triangleIntersectsB.reset();
		this.intersectionEdges = [];
	}
	init() {
		if (this.enabled) {
			this.reset();
			setDebugContext(this);
		}
	}
	complete() {
		if (this.enabled) setDebugContext(null);
	}
};
//#endregion
//#region node_modules/three-bvh-csg/src/core/operations/operations.js
var _matrix = new Matrix4();
var _normalMatrix = new Matrix3();
var _triA = new Triangle();
var _triB = new Triangle();
var _tri = new Triangle();
var _barycoordTri = new Triangle();
var _attr = [];
var _actions = [];
function getFirstIdFromSet(set) {
	for (const id of set) return id;
}
function performOperation(a, b, operations, splitter, attributeData, options = {}) {
	const { useGroups = true } = options;
	const { aIntersections, bIntersections } = collectIntersectingTriangles(a, b);
	const resultGroups = [];
	let resultMaterials = null;
	let groupOffset;
	groupOffset = useGroups ? 0 : -1;
	performSplitTriangleOperations(a, b, aIntersections, operations, false, splitter, attributeData, groupOffset);
	performWholeTriangleOperations(a, b, aIntersections, operations, false, attributeData, groupOffset);
	if (operations.findIndex((op) => op !== 6 && op !== 5) !== -1) {
		groupOffset = useGroups ? a.geometry.groups.length || 1 : -1;
		performSplitTriangleOperations(b, a, bIntersections, operations, true, splitter, attributeData, groupOffset);
		performWholeTriangleOperations(b, a, bIntersections, operations, true, attributeData, groupOffset);
	}
	_attr.length = 0;
	_actions.length = 0;
	return {
		groups: resultGroups,
		materials: resultMaterials
	};
}
function performSplitTriangleOperations(a, b, intersectionMap, operations, invert, splitter, attributeData, groupOffset = 0) {
	const invertedGeometry = a.matrixWorld.determinant() < 0;
	_matrix.copy(b.matrixWorld).invert().multiply(a.matrixWorld);
	_normalMatrix.getNormalMatrix(a.matrixWorld).multiplyScalar(invertedGeometry ? -1 : 1);
	const groupIndices = a.geometry.groupIndices;
	const aIndex = a.geometry.index;
	const aPosition = a.geometry.attributes.position;
	const bBVH = b.geometry.boundsTree;
	const bIndex = b.geometry.index;
	const bPosition = b.geometry.attributes.position;
	const splitIds = intersectionMap.ids;
	const intersectionSet = intersectionMap.intersectionSet;
	for (let i = 0, l = splitIds.length; i < l; i++) {
		const ia = splitIds[i];
		const groupIndex = groupOffset === -1 ? 0 : groupIndices[ia] + groupOffset;
		const ia3 = 3 * ia;
		const ia0 = aIndex.getX(ia3 + 0);
		const ia1 = aIndex.getX(ia3 + 1);
		const ia2 = aIndex.getX(ia3 + 2);
		_triA.a.fromBufferAttribute(aPosition, ia0).applyMatrix4(_matrix);
		_triA.b.fromBufferAttribute(aPosition, ia1).applyMatrix4(_matrix);
		_triA.c.fromBufferAttribute(aPosition, ia2).applyMatrix4(_matrix);
		splitter.reset();
		splitter.initialize(_triA);
		const intersectingIndices = intersectionSet[ia];
		for (let ib = 0, l = intersectingIndices.length; ib < l; ib++) {
			const ib3 = 3 * intersectingIndices[ib];
			const ib0 = bIndex.getX(ib3 + 0);
			const ib1 = bIndex.getX(ib3 + 1);
			const ib2 = bIndex.getX(ib3 + 2);
			_triB.a.fromBufferAttribute(bPosition, ib0);
			_triB.b.fromBufferAttribute(bPosition, ib1);
			_triB.c.fromBufferAttribute(bPosition, ib2);
			splitter.splitByTriangle(_triB);
		}
		const triangles = splitter.triangles;
		for (let ib = 0, l = triangles.length; ib < l; ib++) {
			const clippedTri = triangles[ib];
			const hitSide = splitter.coplanarTriangleUsed ? getHitSideWithCoplanarCheck(clippedTri, bBVH) : getHitSide(clippedTri, bBVH);
			_attr.length = 0;
			_actions.length = 0;
			for (let o = 0, lo = operations.length; o < lo; o++) {
				const op = getOperationAction(operations[o], hitSide, invert);
				if (op !== 2) {
					_actions.push(op);
					_attr.push(attributeData[o].getGroupAttrSet(groupIndex));
				}
			}
			if (_attr.length !== 0) {
				_triA.getBarycoord(clippedTri.a, _barycoordTri.a);
				_triA.getBarycoord(clippedTri.b, _barycoordTri.b);
				_triA.getBarycoord(clippedTri.c, _barycoordTri.c);
				for (let k = 0, lk = _attr.length; k < lk; k++) {
					const attrSet = _attr[k];
					const invertTri = _actions[k] === 0;
					appendAttributeFromTriangle(ia, _barycoordTri, a.geometry, a.matrixWorld, _normalMatrix, attrSet, invertedGeometry !== invertTri);
				}
			}
		}
	}
	return splitIds.length;
}
function performWholeTriangleOperations(a, b, splitTriSet, operations, invert, attributeData, groupOffset = 0) {
	const invertedGeometry = a.matrixWorld.determinant() < 0;
	_matrix.copy(b.matrixWorld).invert().multiply(a.matrixWorld);
	_normalMatrix.getNormalMatrix(a.matrixWorld).multiplyScalar(invertedGeometry ? -1 : 1);
	const bBVH = b.geometry.boundsTree;
	const groupIndices = a.geometry.groupIndices;
	const aIndex = a.geometry.index;
	const aAttributes = a.geometry.attributes;
	const aPosition = aAttributes.position;
	const stack = [];
	const halfEdges = a.geometry.halfEdges;
	const traverseSet = /* @__PURE__ */ new Set();
	const triCount = getTriCount(a.geometry);
	for (let i = 0, l = triCount; i < l; i++) if (!(i in splitTriSet.intersectionSet)) traverseSet.add(i);
	while (traverseSet.size > 0) {
		const id = getFirstIdFromSet(traverseSet);
		traverseSet.delete(id);
		stack.push(id);
		const i3 = 3 * id;
		const i0 = aIndex.getX(i3 + 0);
		const i1 = aIndex.getX(i3 + 1);
		const i2 = aIndex.getX(i3 + 2);
		_tri.a.fromBufferAttribute(aPosition, i0).applyMatrix4(_matrix);
		_tri.b.fromBufferAttribute(aPosition, i1).applyMatrix4(_matrix);
		_tri.c.fromBufferAttribute(aPosition, i2).applyMatrix4(_matrix);
		const hitSide = getHitSide(_tri, bBVH);
		_actions.length = 0;
		_attr.length = 0;
		for (let o = 0, lo = operations.length; o < lo; o++) {
			const op = getOperationAction(operations[o], hitSide, invert);
			if (op !== 2) {
				_actions.push(op);
				_attr.push(attributeData[o]);
			}
		}
		while (stack.length > 0) {
			const currId = stack.pop();
			for (let i = 0; i < 3; i++) {
				const sid = halfEdges.getSiblingTriangleIndex(currId, i);
				if (sid !== -1 && traverseSet.has(sid)) {
					stack.push(sid);
					traverseSet.delete(sid);
				}
			}
			if (_attr.length !== 0) {
				const i3 = 3 * currId;
				const i0 = aIndex.getX(i3 + 0);
				const i1 = aIndex.getX(i3 + 1);
				const i2 = aIndex.getX(i3 + 2);
				const groupIndex = groupOffset === -1 ? 0 : groupIndices[currId] + groupOffset;
				_tri.a.fromBufferAttribute(aPosition, i0);
				_tri.b.fromBufferAttribute(aPosition, i1);
				_tri.c.fromBufferAttribute(aPosition, i2);
				if (!isTriDegenerate(_tri)) for (let k = 0, lk = _attr.length; k < lk; k++) {
					const action = _actions[k];
					const attrSet = _attr[k].getGroupAttrSet(groupIndex);
					const invertTri = action === 0;
					appendAttributesFromIndices(i0, i1, i2, aAttributes, a.matrixWorld, _normalMatrix, attrSet, invertTri !== invertedGeometry);
				}
			}
		}
	}
}
//#endregion
//#region node_modules/three-bvh-csg/src/core/Evaluator.js
function joinGroups(groups) {
	for (let i = 0; i < groups.length - 1; i++) {
		const group = groups[i];
		const nextGroup = groups[i + 1];
		if (group.materialIndex === nextGroup.materialIndex) {
			const start = group.start;
			const end = nextGroup.start + nextGroup.count;
			nextGroup.start = start;
			nextGroup.count = end - start;
			groups.splice(i, 1);
			i--;
		}
	}
}
function prepareAttributesData(referenceGeometry, targetGeometry, attributeData, relevantAttributes) {
	attributeData.clear();
	const aAttributes = referenceGeometry.attributes;
	for (let i = 0, l = relevantAttributes.length; i < l; i++) {
		const key = relevantAttributes[i];
		const aAttr = aAttributes[key];
		attributeData.initializeArray(key, aAttr.array.constructor, aAttr.itemSize, aAttr.normalized);
	}
	for (const key in attributeData.attributes) if (!relevantAttributes.includes(key)) attributeData.delete(key);
	for (const key in targetGeometry.attributes) if (!relevantAttributes.includes(key)) {
		targetGeometry.deleteAttribute(key);
		targetGeometry.dispose();
	}
}
function assignBufferData(geometry, attributeData, groupOrder) {
	let needsDisposal = false;
	let drawRange = -1;
	const attributes = geometry.attributes;
	const referenceAttrSet = attributeData.groupAttributes[0];
	for (const key in referenceAttrSet) {
		const requiredLength = attributeData.getTotalLength(key);
		const type = attributeData.getType(key);
		const itemSize = attributeData.getItemSize(key);
		const normalized = attributeData.getNormalized(key);
		let geoAttr = attributes[key];
		if (!geoAttr || geoAttr.array.length < requiredLength) {
			geoAttr = new BufferAttribute(new type(requiredLength), itemSize, normalized);
			geometry.setAttribute(key, geoAttr);
			needsDisposal = true;
		}
		let offset = 0;
		for (let i = 0, l = Math.min(groupOrder.length, attributeData.groupCount); i < l; i++) {
			const index = groupOrder[i].index;
			const { array, type, length } = attributeData.groupAttributes[index][key];
			const trimmedArray = new type(array.buffer, 0, length);
			geoAttr.array.set(trimmedArray, offset);
			offset += trimmedArray.length;
		}
		geoAttr.needsUpdate = true;
		drawRange = requiredLength / geoAttr.itemSize;
	}
	if (geometry.index) {
		const indexArray = geometry.index.array;
		if (indexArray.length < drawRange) {
			geometry.index = null;
			needsDisposal = true;
		} else for (let i = 0, l = indexArray.length; i < l; i++) indexArray[i] = i;
	}
	let groupOffset = 0;
	geometry.clearGroups();
	for (let i = 0, l = Math.min(groupOrder.length, attributeData.groupCount); i < l; i++) {
		const { index, materialIndex } = groupOrder[i];
		const vertCount = attributeData.getCount(index);
		if (vertCount !== 0) {
			geometry.addGroup(groupOffset, vertCount, materialIndex);
			groupOffset += vertCount;
		}
	}
	geometry.setDrawRange(0, drawRange);
	geometry.boundsTree = null;
	if (needsDisposal) geometry.dispose();
}
function getMaterialList(groups, materials) {
	let result = materials;
	if (!Array.isArray(materials)) {
		result = [];
		groups.forEach((g) => {
			result[g.materialIndex] = materials;
		});
	}
	return result;
}
var Evaluator = class {
	constructor() {
		this.triangleSplitter = new TriangleSplitter();
		this.attributeData = [];
		this.attributes = [
			"position",
			"uv",
			"normal"
		];
		this.useGroups = true;
		this.consolidateGroups = true;
		this.debug = new OperationDebugData();
	}
	getGroupRanges(geometry) {
		return !this.useGroups || geometry.groups.length === 0 ? [{
			start: 0,
			count: Infinity,
			materialIndex: 0
		}] : geometry.groups.map((group) => ({ ...group }));
	}
	evaluate(a, b, operations, targetBrushes = new Brush()) {
		let wasArray = true;
		if (!Array.isArray(operations)) operations = [operations];
		if (!Array.isArray(targetBrushes)) {
			targetBrushes = [targetBrushes];
			wasArray = false;
		}
		if (targetBrushes.length !== operations.length) throw new Error("Evaluator: operations and target array passed as different sizes.");
		a.prepareGeometry();
		b.prepareGeometry();
		const { triangleSplitter, attributeData, attributes, useGroups, consolidateGroups, debug } = this;
		while (attributeData.length < targetBrushes.length) attributeData.push(new TypedAttributeData());
		targetBrushes.forEach((brush, i) => {
			prepareAttributesData(a.geometry, brush.geometry, attributeData[i], attributes);
		});
		debug.init();
		performOperation(a, b, operations, triangleSplitter, attributeData, { useGroups });
		debug.complete();
		const aGroups = this.getGroupRanges(a.geometry);
		const aMaterials = getMaterialList(aGroups, a.material);
		const bGroups = this.getGroupRanges(b.geometry);
		const bMaterials = getMaterialList(bGroups, b.material);
		bGroups.forEach((g) => g.materialIndex += aMaterials.length);
		let groups = [...aGroups, ...bGroups].map((group, index) => ({
			...group,
			index
		}));
		if (useGroups) {
			const allMaterials = [...aMaterials, ...bMaterials];
			if (consolidateGroups) groups = groups.map((group) => {
				const mat = allMaterials[group.materialIndex];
				group.materialIndex = allMaterials.indexOf(mat);
				return group;
			}).sort((a, b) => {
				return a.materialIndex - b.materialIndex;
			});
			const finalMaterials = [];
			for (let i = 0, l = allMaterials.length; i < l; i++) {
				let foundGroup = false;
				for (let g = 0, lg = groups.length; g < lg; g++) {
					const group = groups[g];
					if (group.materialIndex === i) {
						foundGroup = true;
						group.materialIndex = finalMaterials.length;
					}
				}
				if (foundGroup) finalMaterials.push(allMaterials[i]);
			}
			targetBrushes.forEach((tb) => {
				tb.material = finalMaterials;
			});
		} else {
			groups = [{
				start: 0,
				count: Infinity,
				index: 0,
				materialIndex: 0
			}];
			targetBrushes.forEach((tb) => {
				tb.material = aMaterials[0];
			});
		}
		targetBrushes.forEach((brush, i) => {
			const targetGeometry = brush.geometry;
			assignBufferData(targetGeometry, attributeData[i], groups);
			if (consolidateGroups) joinGroups(targetGeometry.groups);
		});
		return wasArray ? targetBrushes : targetBrushes[0];
	}
	evaluateHierarchy(root, target = new Brush()) {
		root.updateMatrixWorld(true);
		const flatTraverse = (obj, cb) => {
			const children = obj.children;
			for (let i = 0, l = children.length; i < l; i++) {
				const child = children[i];
				if (child.isOperationGroup) flatTraverse(child, cb);
				else cb(child);
			}
		};
		const traverse = (brush) => {
			const children = brush.children;
			let didChange = false;
			for (let i = 0, l = children.length; i < l; i++) {
				const child = children[i];
				didChange = traverse(child) || didChange;
			}
			const isDirty = brush.isDirty();
			if (isDirty) brush.markUpdated();
			if (didChange && !brush.isOperationGroup) {
				let result;
				flatTraverse(brush, (child) => {
					if (!result) result = this.evaluate(brush, child, child.operation);
					else result = this.evaluate(result, child, child.operation);
				});
				brush._cachedGeometry = result.geometry;
				brush._cachedMaterials = result.material;
				return true;
			} else return didChange || isDirty;
		};
		traverse(root);
		target.geometry = root._cachedGeometry;
		target.material = root._cachedMaterials;
		return target;
	}
	reset() {
		this.triangleSplitter.reset();
	}
};
//#endregion
//#region node_modules/three-bvh-csg/src/index.js
var src_exports = /* @__PURE__ */ __exportAll({
	ADDITION: () => 0,
	Brush: () => Brush,
	DIFFERENCE: () => 4,
	Evaluator: () => Evaluator,
	HOLLOW_INTERSECTION: () => 6,
	HOLLOW_SUBTRACTION: () => 5,
	HalfEdgeMap: () => HalfEdgeMap,
	INTERSECTION: () => 3,
	REVERSE_SUBTRACTION: () => 2,
	SUBTRACTION: () => 1,
	TriangleSplitter: () => TriangleSplitter
});
//#endregion
export { src_exports as t };
