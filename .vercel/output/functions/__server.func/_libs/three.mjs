import { E as Vector3, s as BoxGeometry } from "./@react-three/drei+[...].mjs";
//#region node_modules/three/examples/jsm/geometries/RoundedBoxGeometry.js
var _tempNormal = new Vector3();
function getUv(faceDirVector, normal, uvAxis, projectionAxis, radius, sideLength) {
	const totArcLength = 2 * Math.PI * radius / 4;
	const centerLength = Math.max(sideLength - 2 * radius, 0);
	const halfArc = Math.PI / 4;
	_tempNormal.copy(normal);
	_tempNormal[projectionAxis] = 0;
	_tempNormal.normalize();
	const arcUvRatio = .5 * totArcLength / (totArcLength + centerLength);
	const arcAngleRatio = 1 - _tempNormal.angleTo(faceDirVector) / halfArc;
	if (Math.sign(_tempNormal[uvAxis]) === 1) return arcAngleRatio * arcUvRatio;
	else return centerLength / (totArcLength + centerLength) + arcUvRatio + arcUvRatio * (1 - arcAngleRatio);
}
/**
* A special type of box geometry with rounded corners and edges.
*
* ```js
* const geometry = new RoundedBoxGeometry();
* const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
* const cube = new THREE.Mesh( geometry, material );
* scene.add( cube );
* ```
*
* @augments BoxGeometry
* @three_import import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
*/
var RoundedBoxGeometry = class RoundedBoxGeometry extends BoxGeometry {
	/**
	* Constructs a new rounded box geometry.
	*
	* @param {number} [width=1] - The width. That is, the length of the edges parallel to the X axis.
	* @param {number} [height=1] - The height. That is, the length of the edges parallel to the Y axis.
	* @param {number} [depth=1] - The depth. That is, the length of the edges parallel to the Z axis.
	* @param {number} [segments=2] - Number of segments that form the rounded corners.
	* @param {number} [radius=0.1] - The radius of the rounded corners.
	*/
	constructor(width = 1, height = 1, depth = 1, segments = 2, radius = .1) {
		const totalSegments = segments * 2 + 1;
		radius = Math.min(width / 2, height / 2, depth / 2, radius);
		super(1, 1, 1, totalSegments, totalSegments, totalSegments);
		this.type = "RoundedBoxGeometry";
		/**
		* Holds the constructor parameters that have been
		* used to generate the geometry. Any modification
		* after instantiation does not change the geometry.
		*
		* @type {Object}
		*/
		this.parameters = {
			width,
			height,
			depth,
			segments,
			radius
		};
		if (totalSegments === 1) return;
		const geometry2 = this.toNonIndexed();
		this.index = null;
		this.attributes.position = geometry2.attributes.position;
		this.attributes.normal = geometry2.attributes.normal;
		this.attributes.uv = geometry2.attributes.uv;
		const position = new Vector3();
		const normal = new Vector3();
		const box = new Vector3(width, height, depth).divideScalar(2).subScalar(radius);
		const positions = this.attributes.position.array;
		const normals = this.attributes.normal.array;
		const uvs = this.attributes.uv.array;
		const faceTris = positions.length / 6;
		const faceDirVector = new Vector3();
		const halfSegmentSize = .5 / totalSegments;
		for (let i = 0, j = 0; i < positions.length; i += 3, j += 2) {
			position.fromArray(positions, i);
			normal.copy(position);
			normal.x -= Math.sign(normal.x) * halfSegmentSize;
			normal.y -= Math.sign(normal.y) * halfSegmentSize;
			normal.z -= Math.sign(normal.z) * halfSegmentSize;
			normal.normalize();
			positions[i + 0] = box.x * Math.sign(position.x) + normal.x * radius;
			positions[i + 1] = box.y * Math.sign(position.y) + normal.y * radius;
			positions[i + 2] = box.z * Math.sign(position.z) + normal.z * radius;
			normals[i + 0] = normal.x;
			normals[i + 1] = normal.y;
			normals[i + 2] = normal.z;
			switch (Math.floor(i / faceTris)) {
				case 0:
					faceDirVector.set(1, 0, 0);
					uvs[j + 0] = getUv(faceDirVector, normal, "z", "y", radius, depth);
					uvs[j + 1] = 1 - getUv(faceDirVector, normal, "y", "z", radius, height);
					break;
				case 1:
					faceDirVector.set(-1, 0, 0);
					uvs[j + 0] = 1 - getUv(faceDirVector, normal, "z", "y", radius, depth);
					uvs[j + 1] = 1 - getUv(faceDirVector, normal, "y", "z", radius, height);
					break;
				case 2:
					faceDirVector.set(0, 1, 0);
					uvs[j + 0] = 1 - getUv(faceDirVector, normal, "x", "z", radius, width);
					uvs[j + 1] = getUv(faceDirVector, normal, "z", "x", radius, depth);
					break;
				case 3:
					faceDirVector.set(0, -1, 0);
					uvs[j + 0] = 1 - getUv(faceDirVector, normal, "x", "z", radius, width);
					uvs[j + 1] = 1 - getUv(faceDirVector, normal, "z", "x", radius, depth);
					break;
				case 4:
					faceDirVector.set(0, 0, 1);
					uvs[j + 0] = 1 - getUv(faceDirVector, normal, "x", "y", radius, width);
					uvs[j + 1] = 1 - getUv(faceDirVector, normal, "y", "x", radius, height);
					break;
				case 5:
					faceDirVector.set(0, 0, -1);
					uvs[j + 0] = getUv(faceDirVector, normal, "x", "y", radius, width);
					uvs[j + 1] = 1 - getUv(faceDirVector, normal, "y", "x", radius, height);
			}
		}
	}
	/**
	* Factory method for creating an instance of this class from the given
	* JSON object.
	*
	* @param {Object} data - A JSON object representing the serialized geometry.
	* @returns {RoundedBoxGeometry} A new instance.
	*/
	static fromJSON(data) {
		return new RoundedBoxGeometry(data.width, data.height, data.depth, data.segments, data.radius);
	}
};
//#endregion
export { RoundedBoxGeometry as t };
