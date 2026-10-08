import { i as __toESM, n as __exportAll } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as SphereGeometry, E as Vector3, a as useThree, d as Euler, f as ExtrudeGeometry, g as Matrix4, i as Canvas, l as BufferGeometry, n as Grid, o as Box3, p as Float32BufferAttribute, r as OrbitControls, s as BoxGeometry, t as ContactShadows, u as CylinderGeometry, v as MeshStandardMaterial, x as Shape } from "../_libs/@react-three/drei+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as uid, i as slugify, n as downloadBlob, o as zipBlobs, r as openSketchFile, t as cn } from "./utils-DRgkC81K.mjs";
import { A as Camera, C as Download, D as ChevronRight, E as CircleAlert, M as ArrowUp, O as ChevronDown, S as Ellipsis, T as Copy, _ as LoaderCircle, a as Trash2, b as Eye, c as Search, d as PenLine, f as PanelRight, g as Mic, h as Minus, i as TriangleAlert, j as Box, k as Check, l as Plus, m as PanelBottom, n as Upload, o as Square, p as PanelLeft, r as Type, s as Settings2, t as X, u as Play, v as Layers, w as Cylinder, x as EyeOff, y as Files } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as RoundedBoxGeometry } from "../_libs/three.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
import { a as Portal2, c as Root2, d as SubContent2, f as SubTrigger2, i as ItemIndicator2, l as Separator2, n as Content2, o as RadioGroup2, p as Trigger, r as Item2, s as RadioItem2, t as CheckboxItem2, u as Sub2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dcb4sYPf.js
var routes_Dcb4sYPf_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-fg",
			secondary: "bg-surface-subtle text-fg hover:bg-surface-subtle/80",
			outline: "bg-transparent text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "bg-transparent text-muted hover:text-fg hover:bg-surface-subtle",
			inverse: "bg-fg text-bg hover:bg-accent"
		},
		size: {
			default: "h-11 rounded-sm px-4",
			sm: "h-9 rounded-sm px-3 text-xs",
			lg: "h-12 rounded-md px-5",
			icon: "size-11 rounded-sm",
			"icon-sm": "size-9 rounded-sm"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var interpretSketch = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("34828d8a1a5c2cb2fe0b47abcc1ab53aa60b1c08253b6134e105f8e96a93bf37"));
var PARAM_META = {
	box: [
		{
			key: "length",
			label: "Length X",
			min: 1,
			max: 400,
			step: .5
		},
		{
			key: "width",
			label: "Width Z",
			min: 1,
			max: 400,
			step: .5
		},
		{
			key: "height",
			label: "Height Y",
			min: .5,
			max: 400,
			step: .1
		},
		{
			key: "fillet",
			label: "Fillet",
			min: 0,
			max: 40,
			step: .1
		}
	],
	cylinder: [{
		key: "radius",
		label: "Radius",
		min: .5,
		max: 200,
		step: .1
	}, {
		key: "height",
		label: "Height",
		min: .5,
		max: 400,
		step: .1
	}],
	sphere: [{
		key: "radius",
		label: "Radius",
		min: .5,
		max: 200,
		step: .1
	}],
	cone: [
		{
			key: "radiusBottom",
			label: "Base R",
			min: 0,
			max: 200,
			step: .1
		},
		{
			key: "radiusTop",
			label: "Top R",
			min: 0,
			max: 200,
			step: .1
		},
		{
			key: "height",
			label: "Height",
			min: .5,
			max: 400,
			step: .1
		}
	],
	wedge: [
		{
			key: "length",
			label: "Length X",
			min: 1,
			max: 400,
			step: .5
		},
		{
			key: "width",
			label: "Base Z",
			min: 1,
			max: 400,
			step: .5
		},
		{
			key: "height",
			label: "Height Y",
			min: 1,
			max: 400,
			step: .5
		}
	],
	extrude: [{
		key: "height",
		label: "Height",
		min: .5,
		max: 400,
		step: .1
	}],
	hole: [{
		key: "radius",
		label: "Radius",
		min: .4,
		max: 80,
		step: .05
	}, {
		key: "depth",
		label: "Depth",
		min: .5,
		max: 400,
		step: .1
	}],
	slot: [
		{
			key: "length",
			label: "Length",
			min: 1,
			max: 400,
			step: .5
		},
		{
			key: "width",
			label: "Width",
			min: .5,
			max: 80,
			step: .1
		},
		{
			key: "depth",
			label: "Depth",
			min: .5,
			max: 400,
			step: .1
		}
	],
	pocket: [
		{
			key: "length",
			label: "Length",
			min: 1,
			max: 400,
			step: .5
		},
		{
			key: "width",
			label: "Width",
			min: 1,
			max: 400,
			step: .5
		},
		{
			key: "depth",
			label: "Depth",
			min: .5,
			max: 400,
			step: .1
		}
	]
};
var KIND_DEFAULTS = {
	box: {
		length: 40,
		width: 40,
		height: 10,
		fillet: 0
	},
	cylinder: {
		radius: 10,
		height: 20
	},
	sphere: { radius: 12 },
	cone: {
		radiusBottom: 12,
		radiusTop: 0,
		height: 24
	},
	wedge: {
		length: 80,
		width: 70,
		height: 50
	},
	extrude: { height: 8 },
	hole: {
		radius: 2.5,
		depth: 12
	},
	slot: {
		length: 24,
		width: 6,
		depth: 8
	},
	pocket: {
		length: 30,
		width: 20,
		depth: 6
	}
};
var origin = {
	x: 0,
	y: 0,
	z: 0
};
function f(partial) {
	return {
		id: uid("f"),
		rotation: origin,
		...partial
	};
}
function q(prompt, why, options) {
	return {
		id: uid("q"),
		prompt,
		why,
		options
	};
}
var TEMPLATES = {
	bracket: {
		title: "L-bracket",
		blurb: "Graph paper · 80 × 50 × 40",
		mediaLabel: "Graph paper",
		image: "/samples/bracket.jpg",
		media: "graph-paper",
		build: bracketDoc
	},
	stand: {
		title: "Phone stand",
		blurb: "Napkin · wedge + slot",
		mediaLabel: "Napkin",
		image: "/samples/stand.jpg",
		media: "napkin",
		build: standDoc
	},
	enclosure: {
		title: "Project box",
		blurb: "Whiteboard · 120 × 80 × 40",
		mediaLabel: "Whiteboard",
		image: "/samples/enclosure.jpg",
		media: "whiteboard",
		build: enclosureDoc
	},
	bushing: {
		title: "Spacer bushing",
		blurb: "Coaster · Ø20 × 12",
		mediaLabel: "Coaster",
		image: "/samples/bushing.jpg",
		media: "coaster",
		build: bushingDoc
	}
};
function bracketDoc() {
	const baseHoles = [f({
		kind: "hole",
		name: "Base hole A",
		op: "subtract",
		params: {
			radius: 2.5,
			depth: 5
		},
		position: {
			x: -20,
			y: 1.5,
			z: 16
		},
		axis: "y"
	}), f({
		kind: "hole",
		name: "Base hole B",
		op: "subtract",
		params: {
			radius: 2.5,
			depth: 5
		},
		position: {
			x: 20,
			y: 1.5,
			z: 16
		},
		axis: "y"
	})];
	const wallHoles = [f({
		kind: "hole",
		name: "Wall hole A",
		op: "subtract",
		params: {
			radius: 2.5,
			depth: 5
		},
		position: {
			x: -20,
			y: 16,
			z: 1.5
		},
		axis: "z"
	}), f({
		kind: "hole",
		name: "Wall hole B",
		op: "subtract",
		params: {
			radius: 2.5,
			depth: 5
		},
		position: {
			x: 20,
			y: 16,
			z: 1.5
		},
		axis: "z"
	})];
	return {
		id: uid("doc"),
		name: "Corner bracket",
		units: "mm",
		media: "graph-paper",
		pipelineNote: "5 mm grid on engineering paper. Legs read 80 × 50, upright 40, stock 3 mm.",
		confidence: .74,
		notes: "Assumed 3 mm aluminum sheet. Hole diameters unlabeled — treating as M4 clearance (Ø5).",
		sourceLabel: "Graph paper sketch",
		features: [
			f({
				kind: "box",
				name: "Base flange",
				op: "add",
				params: {
					length: 80,
					width: 50,
					height: 3,
					fillet: 1
				},
				position: {
					x: 0,
					y: 1.5,
					z: 25
				}
			}),
			f({
				kind: "box",
				name: "Upright flange",
				op: "add",
				params: {
					length: 80,
					width: 3,
					height: 40,
					fillet: 1
				},
				position: {
					x: 0,
					y: 20,
					z: 1.5
				}
			}),
			...baseHoles,
			...wallHoles
		],
		questions: [q("Hole size — the sketch marks centers but not a diameter.", "A 0.5 mm error here scrapes the bolt or the part.", [
			{
				label: "M4 clearance Ø5",
				reply: "M4 clearance, 5 mm holes",
				patch: { params: { radius: 2.5 } }
			},
			{
				label: "M3 clearance Ø3.4",
				reply: "M3 clearance",
				patch: { params: { radius: 1.7 } }
			},
			{
				label: "M5 clearance Ø5.5",
				reply: "M5 clearance",
				patch: { params: { radius: 2.75 } }
			}
		]), q("Stock thickness. Graph paper suggests 3 mm, but that is a guess.", "Sheet vs plate changes every other dimension.", [
			{
				label: "3 mm sheet",
				reply: "Keep 3 mm thickness",
				patch: { params: { height: 3 } }
			},
			{
				label: "4 mm plate",
				reply: "Make both flanges 4 mm thick",
				patch: { params: { height: 4 } }
			},
			{
				label: "6 mm plate",
				reply: "Make both flanges 6 mm thick",
				patch: { params: { height: 6 } }
			}
		])]
	};
}
function standDoc() {
	return {
		id: uid("doc"),
		name: "Phone stand",
		units: "mm",
		media: "napkin",
		pipelineNote: "Napkin sketch, no grid. Perspective corrected. Wedge profile with a catch slot.",
		confidence: .61,
		notes: "Proportions inferred from a typical 6-inch phone. Angle ~40° from the wedge.",
		sourceLabel: "Napkin sketch",
		features: [f({
			kind: "wedge",
			name: "Body",
			op: "add",
			params: {
				length: 82,
				width: 72,
				height: 58
			},
			position: {
				x: 0,
				y: 0,
				z: 0
			}
		}), f({
			kind: "slot",
			name: "Phone slot",
			op: "subtract",
			params: {
				length: 76,
				width: 10,
				depth: 12
			},
			position: {
				x: 0,
				y: 14,
				z: 18
			},
			axis: "y"
		})],
		questions: [q("Which phone size should the slot fit?", "Width of the slot and body follow this.", [
			{
				label: "Compact (~70 mm)",
				reply: "Fit a compact phone, 70 mm slot",
				patch: {
					featureId: "slot",
					params: { length: 70 }
				}
			},
			{
				label: "Standard (~76 mm)",
				reply: "Standard phone width",
				patch: {}
			},
			{
				label: "Pro Max (~80 mm)",
				reply: "Wide phone, 80 mm slot",
				patch: { params: { length: 80 } }
			}
		]), q("Print this solid, or shell it to save filament?", "A 2 mm wall cuts print time in half.", [{
			label: "Solid",
			reply: "Keep it solid",
			patch: {}
		}, {
			label: "2 mm shell",
			reply: "Shell the stand to 2 mm walls",
			patch: {}
		}])]
	};
}
function enclosureDoc() {
	return {
		id: uid("doc"),
		name: "Project enclosure",
		units: "mm",
		media: "whiteboard",
		pipelineNote: "Whiteboard isometric. 120 × 80 × 40 box, four lid screws, USB cutout on a short wall.",
		confidence: .69,
		notes: "3 mm walls. Interior pocket leaves a floor and a lid. USB on the +Z wall.",
		sourceLabel: "Whiteboard sketch",
		features: [
			f({
				kind: "box",
				name: "Outer shell",
				op: "add",
				params: {
					length: 120,
					width: 80,
					height: 40,
					fillet: 2
				},
				position: {
					x: 0,
					y: 20,
					z: 0
				}
			}),
			f({
				kind: "pocket",
				name: "Interior",
				op: "subtract",
				params: {
					length: 114,
					width: 74,
					depth: 34
				},
				position: {
					x: 0,
					y: 20,
					z: 0
				},
				axis: "y"
			}),
			f({
				kind: "hole",
				name: "Lid screw A",
				op: "subtract",
				params: {
					radius: 1.6,
					depth: 8
				},
				position: {
					x: -52,
					y: 38,
					z: -32
				},
				axis: "y"
			}),
			f({
				kind: "hole",
				name: "Lid screw B",
				op: "subtract",
				params: {
					radius: 1.6,
					depth: 8
				},
				position: {
					x: 52,
					y: 38,
					z: -32
				},
				axis: "y"
			}),
			f({
				kind: "hole",
				name: "Lid screw C",
				op: "subtract",
				params: {
					radius: 1.6,
					depth: 8
				},
				position: {
					x: -52,
					y: 38,
					z: 32
				},
				axis: "y"
			}),
			f({
				kind: "hole",
				name: "Lid screw D",
				op: "subtract",
				params: {
					radius: 1.6,
					depth: 8
				},
				position: {
					x: 52,
					y: 38,
					z: 32
				},
				axis: "y"
			}),
			f({
				kind: "slot",
				name: "USB cutout",
				op: "subtract",
				params: {
					length: 14,
					width: 8,
					depth: 8
				},
				position: {
					x: 0,
					y: 10,
					z: 38
				},
				axis: "z"
			})
		],
		questions: [q("USB cutout — data or power?", "The opening height changes.", [
			{
				label: "USB-C (9 × 3.5)",
				reply: "USB-C cutout",
				patch: {
					featureId: "usb",
					params: {
						length: 10,
						width: 4
					}
				}
			},
			{
				label: "USB-A (16 × 8)",
				reply: "USB-A cutout",
				patch: {}
			},
			{
				label: "No cutout",
				reply: "Remove the USB cutout",
				patch: { deleteFeature: true }
			}
		]), q("Lid screws — M3 as drawn, or press-fit heat inserts?", "Inserts need Ø4.6 bosses, not Ø3.2 through-holes.", [{
			label: "M3 through",
			reply: "Keep M3 through holes",
			patch: {}
		}, {
			label: "Heat inserts",
			reply: "Switch lid holes to heat-insert bosses",
			patch: {}
		}])]
	};
}
function bushingDoc() {
	return {
		id: uid("doc"),
		name: "Spacer bushing",
		units: "mm",
		media: "coaster",
		pipelineNote: "Coaster sketch. Two concentric circles and a side view. OD 20, ID 8, height 12.",
		confidence: .86,
		notes: "Through-bore. No chamfer drawn — asking before adding.",
		sourceLabel: "Coaster sketch",
		features: [f({
			kind: "cylinder",
			name: "Body",
			op: "add",
			params: {
				radius: 10,
				height: 12
			},
			position: {
				x: 0,
				y: 6,
				z: 0
			},
			axis: "y"
		}), f({
			kind: "hole",
			name: "Bore",
			op: "subtract",
			params: {
				radius: 4,
				depth: 14
			},
			position: {
				x: 0,
				y: 6,
				z: 0
			},
			axis: "y"
		})],
		questions: [q("Bore fit. Ø8 as written — clearance, or press on a shaft?", "Press fits print undersize on FDM.", [
			{
				label: "Free running Ø8.2",
				reply: "Clearance bore 8.2 mm",
				patch: {
					featureId: "bore",
					params: { radius: 4.1 }
				}
			},
			{
				label: "As drawn Ø8.0",
				reply: "Keep 8 mm bore",
				patch: {}
			},
			{
				label: "Press Ø7.8",
				reply: "Press-fit 7.8 mm",
				patch: { params: { radius: 3.9 } }
			}
		]), q("Break the sharp edges?", "A 0.4 mm chamfer helps it start on a shaft.", [{
			label: "Leave sharp",
			reply: "No chamfer",
			patch: {}
		}, {
			label: "0.4 mm chamfer both ends",
			reply: "Add 0.4 mm chamfers",
			patch: {}
		}])]
	};
}
function listTemplates() {
	return Object.keys(TEMPLATES).map((id) => ({
		id,
		...TEMPLATES[id]
	}));
}
var BOX_RE = /(\d+(?:\.\d+)?)\s*(?:mm|in)?\s*[x×*]+\s*(\d+(?:\.\d+)?)\s*(?:mm|in)?\s*[x×*]+\s*(\d+(?:\.\d+)?)/i;
var HOLE_COUNT_RE = /(\d+)\s*(?:×\s*)?(?:mm\s+)?holes?\b/i;
var M_HOLE_RE = /\bm\s*([3-8])\b/i;
var DIA_RE = /(?:ø|od|diameter)\s*(\d+(?:\.\d+)?)/i;
var ID_RE = /(?:id|bore|inner)\s*(\d+(?:\.\d+)?)/i;
var HEIGHT_RE = /(?:h(?:eight)?|thick(?:ness)?)\s*(?:of\s*)?(\d+(?:\.\d+)?)/i;
function box(length, width, height, name = "Body") {
	return {
		id: uid("f"),
		kind: "box",
		name,
		op: "add",
		params: {
			length,
			width,
			height,
			fillet: 0
		},
		position: {
			x: 0,
			y: height / 2,
			z: 0
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		}
	};
}
function hole(x, z, r, depth, name) {
	return {
		id: uid("f"),
		kind: "hole",
		name,
		op: "subtract",
		params: {
			radius: r,
			depth: depth + 1
		},
		position: {
			x,
			y: depth / 2,
			z
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		},
		axis: "y"
	};
}
function cornerHoles(length, width, height, n, r) {
	const insetX = Math.min(8, length * .18);
	const insetZ = Math.min(8, width * .18);
	return [
		{
			x: -length / 2 + insetX,
			z: -width / 2 + insetZ
		},
		{
			x: length / 2 - insetX,
			z: -width / 2 + insetZ
		},
		{
			x: -length / 2 + insetX,
			z: width / 2 - insetZ
		},
		{
			x: length / 2 - insetX,
			z: width / 2 - insetZ
		}
	].slice(0, Math.min(4, Math.max(1, n))).map((p, i) => hole(p.x, p.z, r, height, `Hole ${i + 1}`));
}
function parseIntent(text) {
	const raw = text.trim();
	if (!raw) return null;
	const lower = raw.toLowerCase();
	if (/bracket|angle iron|l-?shape/.test(lower)) return TEMPLATES.bracket.build();
	if (/phone|stand|wedge/.test(lower)) return TEMPLATES.stand.build();
	if (/enclos|project box|housing|case/.test(lower)) return TEMPLATES.enclosure.build();
	if (/bushing|spacer|standoff/.test(lower)) return TEMPLATES.bushing.build();
	const dim = raw.match(BOX_RE);
	const dia = raw.match(DIA_RE);
	const idm = raw.match(ID_RE);
	const ht = raw.match(HEIGHT_RE);
	const holeCount = raw.match(HOLE_COUNT_RE);
	const mHole = raw.match(M_HOLE_RE);
	if (/cylinder|tube|pipe|rod|disc|disk|washer/.test(lower) || dia && !dim) {
		const od = dia ? Number(dia[1]) : 20;
		const id = idm ? Number(idm[1]) : od * .4;
		const height = ht ? Number(ht[1]) : 12;
		const features = [{
			id: uid("f"),
			kind: "cylinder",
			name: "Body",
			op: "add",
			params: {
				radius: od / 2,
				height
			},
			position: {
				x: 0,
				y: height / 2,
				z: 0
			},
			rotation: {
				x: 0,
				y: 0,
				z: 0
			},
			axis: "y"
		}];
		if (id > 0 && id < od) features.push(hole(0, 0, id / 2, height, "Bore"));
		return wrap(raw, "Turned part", features, "voice");
	}
	if (dim) {
		const length = Number(dim[1]);
		const width = Number(dim[2]);
		const height = Number(dim[3]);
		const features = [box(length, width, height, "Plate")];
		const n = holeCount ? Number(holeCount[1]) : /holes?/.test(lower) ? 4 : 0;
		const r = mHole ? (Number(mHole[1]) + .2) / 2 : 1.7;
		if (n) features.push(...cornerHoles(length, width, height, n, r));
		return wrap(raw, "Plate", features, "voice");
	}
	if (/plate|block|bar|cube/.test(lower)) return wrap(raw, "Plate", [box(40, 40, 6)], "voice");
	return null;
}
function wrap(source, name, features, media) {
	return {
		id: uid("doc"),
		name,
		units: "mm",
		media,
		pipelineNote: `Speech-to-intent · “${source.slice(0, 80)}”`,
		confidence: .55,
		notes: "Parsed from language, not a drawing. Confirm every number.",
		sourceLabel: "Spoken description",
		features,
		questions: [{
			id: uid("q"),
			prompt: "I treated the units as millimetres. Is that right?",
			why: "An inch-mode part scaled in mm is 25× too small.",
			options: [{
				label: "Millimetres",
				reply: "Units are millimetres",
				patch: { units: "mm" }
			}, {
				label: "Inches",
				reply: "Units are inches",
				patch: { units: "in" }
			}]
		}]
	};
}
function applyPatch(doc, patch) {
	let features = doc.features.map((f) => ({
		...f,
		params: { ...f.params }
	}));
	const target = patch.featureId ? features.filter((f) => f.id === patch.featureId || f.name.toLowerCase().includes(patch.featureId.toLowerCase())) : features;
	if (patch.deleteFeature && patch.featureId) features = features.filter((f) => f.id !== patch.featureId && !f.name.toLowerCase().includes(patch.featureId.toLowerCase()));
	else {
		const applyTo = target.length ? target : features;
		for (const f of applyTo) {
			if (patch.params) {
				const allowed = new Set(PARAM_META[f.kind].map((p) => p.key));
				for (const [k, v] of Object.entries(patch.params)) if (allowed.has(k)) f.params[k] = v;
			}
			if (patch.position) f.position = {
				...f.position,
				...patch.position
			};
			if (patch.rotation) f.rotation = {
				...f.rotation,
				...patch.rotation
			};
			if (patch.name) f.name = patch.name;
			if (patch.hidden !== void 0) f.hidden = patch.hidden;
		}
	}
	if (patch.addFeatures?.length) features = features.concat(patch.addFeatures);
	if (patch.params?.height) for (const f of features) {
		if (f.op === "add" && (f.kind === "box" || f.kind === "cylinder" || f.kind === "wedge")) {
			if (patch.featureId && f.id !== patch.featureId && !f.name.toLowerCase().includes(patch.featureId.toLowerCase())) continue;
			f.position = {
				...f.position,
				y: (f.params.height ?? patch.params.height) / 2
			};
		}
		if (f.kind === "hole" && patch.params.height) {
			f.params.depth = patch.params.height + 1;
			f.position = {
				...f.position,
				y: (patch.params.height ?? f.position.y) / 2
			};
		}
	}
	return {
		...doc,
		name: patch.docName ?? doc.name,
		units: patch.units ?? doc.units,
		features,
		questions: doc.questions.map((q) => patch && q.options.some((o) => o.patch === patch) ? {
			...q,
			answered: "applied"
		} : q)
	};
}
function applyThickness(doc, height) {
	return {
		...doc,
		features: doc.features.map((f) => {
			if (f.kind === "hole" || f.kind === "slot" || f.kind === "pocket") {
				if ((f.axis ?? "y") === "y") return {
					...f,
					params: {
						...f.params,
						depth: height + 1
					},
					position: {
						...f.position,
						y: height / 2
					}
				};
				return f;
			}
			if (f.op !== "add") return f;
			if (f.kind === "cylinder" && (f.axis ?? "y") === "y") return {
				...f,
				params: {
					...f.params,
					height
				},
				position: {
					...f.position,
					y: height / 2
				}
			};
			if (f.kind === "extrude") return {
				...f,
				params: {
					...f.params,
					height
				}
			};
			if (f.kind === "box") {
				const l = f.params.length ?? 0;
				const w = f.params.width ?? 0;
				const h = f.params.height ?? 0;
				const min = Math.min(l, w, h);
				if (Math.abs(h - min) <= .25) return {
					...f,
					params: {
						...f.params,
						height
					},
					position: {
						...f.position,
						y: height / 2
					}
				};
				if (Math.abs(w - min) <= .25) {
					const sign = f.position.z >= 0 ? 1 : -1;
					return {
						...f,
						params: {
							...f.params,
							width: height
						},
						position: {
							...f.position,
							z: sign * (height / 2)
						}
					};
				}
				if (Math.abs(l - min) <= .25) {
					const sign = f.position.x >= 0 ? 1 : -1;
					return {
						...f,
						params: {
							...f.params,
							length: height
						},
						position: {
							...f.position,
							x: sign * (height / 2)
						}
					};
				}
			}
			return f;
		})
	};
}
function applySpokenDims(doc, note) {
	const raw = note.trim();
	if (!raw) return doc;
	let next = {
		...doc,
		features: doc.features.map((f) => ({
			...f,
			params: { ...f.params },
			position: { ...f.position }
		})),
		pipelineNote: `${doc.pipelineNote} · note: “${raw.slice(0, 80)}”`,
		notes: `${doc.notes} Typed/spoken: “${raw}”.`.trim(),
		confidence: Math.min(1, doc.confidence + .12)
	};
	const named = parseIntent(raw);
	if (named && /bracket|stand|enclos|bushing|spacer|phone/.test(raw.toLowerCase()) && named.name !== "Plate") return {
		...named,
		id: next.id,
		media: next.media,
		sourceLabel: next.sourceLabel,
		pipelineNote: `${next.pipelineNote} · matched “${named.name}” from the note`,
		notes: `${named.notes} Identity from the note, confirm the sketch still matches.`,
		confidence: Math.min(1, Math.max(next.confidence, named.confidence) + .08)
	};
	const dim = raw.match(BOX_RE);
	const dia = raw.match(DIA_RE);
	const idm = raw.match(ID_RE);
	const ht = raw.match(HEIGHT_RE);
	const mHole = raw.match(M_HOLE_RE);
	if (dim) {
		const length = Number(dim[1]);
		const width = Number(dim[2]);
		const height = Number(dim[3]);
		const turned = /cylinder|bushing|spacer|ø|od|diameter/.test(raw.toLowerCase());
		next = {
			...next,
			features: next.features.map((f) => {
				if (f.op === "add" && (f.kind === "box" || f.kind === "cylinder" && !turned)) return {
					...f,
					kind: "box",
					name: f.name === "Body" ? "Plate" : f.name,
					params: {
						length,
						width,
						height,
						fillet: f.params.fillet ?? 0
					},
					position: {
						x: 0,
						y: height / 2,
						z: 0
					},
					rotation: {
						x: 0,
						y: 0,
						z: 0
					},
					axis: void 0
				};
				if (f.op === "add" && f.kind === "cylinder") return {
					...f,
					params: {
						...f.params,
						radius: Math.min(length, width) / 2,
						height
					},
					position: {
						...f.position,
						y: height / 2
					}
				};
				if (f.kind === "hole" && (f.axis ?? "y") === "y") return {
					...f,
					params: {
						...f.params,
						depth: height + 1
					},
					position: {
						...f.position,
						y: height / 2
					}
				};
				return f;
			}),
			name: turned ? next.name : next.name === "Turned part" ? "Plate" : next.name
		};
		next = applyThickness(next, height);
	} else if (ht) next = applyThickness(next, Number(ht[1]));
	if (dia) {
		const od = Number(dia[1]);
		next = {
			...next,
			features: next.features.map((f) => f.kind === "cylinder" && f.op === "add" ? {
				...f,
				params: {
					...f.params,
					radius: od / 2
				}
			} : f)
		};
	}
	if (idm) {
		const id = Number(idm[1]);
		next = {
			...next,
			features: next.features.map((f) => f.kind === "hole" ? {
				...f,
				params: {
					...f.params,
					radius: id / 2
				}
			} : f)
		};
	}
	if (mHole || /holes?/.test(raw.toLowerCase())) {
		const r = mHole ? (Number(mHole[1]) + .2) / 2 : 1.7;
		const words = {
			two: 2,
			three: 3,
			four: 4,
			six: 6,
			eight: 8
		};
		const word = raw.toLowerCase().match(/\b(two|three|four|six|eight)\b/);
		const counted = raw.match(/(?<![mM])\b([2-8])\s+(?:x\s*)?holes?\b/i);
		const count = counted ? Number(counted[1]) : word ? words[word[1]] : 4;
		const body = next.features.find((f) => f.op === "add" && f.kind === "box");
		if (body) {
			const length = body.params.length ?? 40;
			const width = body.params.width ?? 40;
			const height = body.params.height ?? 6;
			next = {
				...next,
				features: [...next.features.filter((f) => f.kind !== "hole"), ...cornerHoles(length, width, height, count, r)]
			};
		} else next = {
			...next,
			features: next.features.map((f) => f.kind === "hole" ? {
				...f,
				params: {
					...f.params,
					radius: r
				}
			} : f)
		};
	}
	return next;
}
function grayscale(data, i) {
	return data[i] * .299 + data[i + 1] * .587 + data[i + 2] * .114;
}
function autocorrPeak(profile, minLag, maxLag) {
	let bestLag = 0;
	let best = 0;
	const mean = profile.reduce((a, b) => a + b, 0) / (profile.length || 1);
	const centered = profile.map((v) => v - mean);
	for (let lag = minLag; lag <= maxLag; lag++) {
		let s = 0;
		for (let i = 0; i + lag < centered.length; i++) s += centered[i] * centered[i + lag];
		if (s > best) {
			best = s;
			bestLag = lag;
		}
	}
	return {
		lag: bestLag,
		score: best
	};
}
function classifyCanvas(canvas) {
	const w = 160;
	const h = 120;
	const c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	const ctx = c.getContext("2d");
	ctx.drawImage(canvas, 0, 0, w, h);
	const d = ctx.getImageData(0, 0, w, h).data;
	let r = 0, g = 0, b = 0;
	const n = 19200;
	const col = new Array(w).fill(0);
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		const i = (y * w + x) * 4;
		r += d[i];
		g += d[i + 1];
		b += d[i + 2];
		col[x] += grayscale(d, i);
	}
	r /= n;
	g /= n;
	b /= n;
	for (let x = 0; x < w; x++) col[x] /= h;
	const peak = autocorrPeak(col, 4, 28);
	const grid = peak.lag >= 5 && peak.score > 4e3;
	const greenPaper = g > r + 12 && g > b + 8;
	const warmPaper = r > 140 && g > 110 && b < 120 && r > b + 25;
	const bright = (r + g + b) / 3 > 198;
	if (greenPaper && grid) return {
		media: "graph-paper",
		detail: "Green engineering paper, periodic grid",
		gridMm: 5
	};
	if (grid) return {
		media: "graph-paper",
		detail: `Grid pitch ~${peak.lag}px`,
		gridMm: 5
	};
	if (bright) return {
		media: "whiteboard",
		detail: "High-key surface, marker strokes",
		gridMm: null
	};
	if (warmPaper) return {
		media: "napkin",
		detail: "Warm fibrous paper, no regular grid",
		gridMm: null
	};
	return {
		media: "photo",
		detail: "Unlined photo, perspective inferred",
		gridMm: null
	};
}
function rdp(points, epsilon) {
	if (points.length < 3) return points;
	const first = points[0];
	const last = points[points.length - 1];
	let maxD = 0;
	let idx = 0;
	const dx = last.x - first.x;
	const dy = last.y - first.y;
	const mag = Math.hypot(dx, dy) || 1;
	for (let i = 1; i < points.length - 1; i++) {
		const d = Math.abs(dy * points[i].x - dx * points[i].y + last.x * first.y - last.y * first.x) / mag;
		if (d > maxD) {
			maxD = d;
			idx = i;
		}
	}
	if (maxD > epsilon) {
		const left = rdp(points.slice(0, idx + 1), epsilon);
		const right = rdp(points.slice(idx), epsilon);
		return left.slice(0, -1).concat(right);
	}
	return [first, last];
}
function recognizeStrokes(strokes, canvasW, canvasH, mmPerPx = .2) {
	const pts = strokes.flat();
	const empty = () => ({
		id: uid("doc"),
		name: "Sketch plate",
		units: "mm",
		media: "gesture",
		pipelineNote: "Live sketch. No closed profile — defaulting to a 40 mm plate.",
		confidence: .35,
		notes: "Draw a closed outline for a better fit.",
		features: [{
			id: uid("f"),
			kind: "box",
			name: "Plate",
			op: "add",
			params: {
				length: 40,
				width: 40,
				height: 4,
				fillet: 0
			},
			position: {
				x: 0,
				y: 2,
				z: 0
			},
			rotation: {
				x: 0,
				y: 0,
				z: 0
			}
		}],
		questions: [{
			id: uid("q"),
			prompt: "Thickness? The sketch is 2D, so this is always a guess.",
			why: "Print orientation and strength hinge on it.",
			options: [
				{
					label: "3 mm",
					reply: "3 mm thick",
					patch: { params: { height: 3 } }
				},
				{
					label: "4 mm",
					reply: "4 mm thick",
					patch: { params: { height: 4 } }
				},
				{
					label: "6 mm",
					reply: "6 mm thick",
					patch: { params: { height: 6 } }
				}
			]
		}]
	});
	if (pts.length < 8) return empty();
	let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
	for (const p of pts) {
		minX = Math.min(minX, p.x);
		minY = Math.min(minY, p.y);
		maxX = Math.max(maxX, p.x);
		maxY = Math.max(maxY, p.y);
	}
	const pxW = Math.max(8, maxX - minX);
	const pxH = Math.max(8, maxY - minY);
	const length = roundNice(pxW * mmPerPx);
	const width = roundNice(pxH * mmPerPx);
	const gw = Math.max(16, Math.ceil(pxW / 2));
	const gh = Math.max(16, Math.ceil(pxH / 2));
	const occ = new Uint8Array(gw * gh);
	const toG = (p) => ({
		x: Math.floor((p.x - minX) / pxW * (gw - 1)),
		y: Math.floor((p.y - minY) / pxH * (gh - 1))
	});
	for (const stroke of strokes) for (let i = 1; i < stroke.length; i++) {
		const a = toG(stroke[i - 1]);
		const b = toG(stroke[i]);
		stampLine(occ, gw, gh, a.x, a.y, b.x, b.y);
	}
	dilate(occ, gw, gh);
	const holes = findHoles(occ, gw, gh, length, width);
	const circular = isCircular(occ, gw, gh);
	const l = detectL(occ, gw, gh);
	const features = [];
	const height = 4;
	if (circular && holes.length <= 1) {
		const radius = roundNice(Math.min(length, width) / 2);
		features.push({
			id: uid("f"),
			kind: "cylinder",
			name: "Body",
			op: "add",
			params: {
				radius,
				height
			},
			position: {
				x: 0,
				y: height / 2,
				z: 0
			},
			rotation: {
				x: 0,
				y: 0,
				z: 0
			},
			axis: "y"
		});
	} else if (l) {
		const { a, b } = lToBoxes(l, length, width, height);
		features.push(a, b);
	} else features.push({
		id: uid("f"),
		kind: "box",
		name: "Plate",
		op: "add",
		params: {
			length,
			width,
			height,
			fillet: 0
		},
		position: {
			x: 0,
			y: height / 2,
			z: 0
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		}
	});
	for (const hole of holes) features.push({
		id: uid("f"),
		kind: "hole",
		name: `Hole ${features.filter((f) => f.kind === "hole").length + 1}`,
		op: "subtract",
		params: {
			radius: hole.r,
			depth: 5
		},
		position: {
			x: hole.x,
			y: height / 2,
			z: hole.z
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		},
		axis: "y"
	});
	rdp([
		{
			x: minX,
			y: minY
		},
		{
			x: maxX,
			y: minY
		},
		{
			x: maxX,
			y: maxY
		},
		{
			x: minX,
			y: maxY
		}
	], 2).map((p) => ({
		x: (p.x - (minX + maxX) / 2) * mmPerPx,
		z: (p.y - (minY + maxY) / 2) * mmPerPx
	}));
	return {
		id: uid("doc"),
		name: circular ? "Turned part" : l ? "L-bracket" : "Sketched plate",
		units: "mm",
		media: "gesture",
		pipelineNote: `Hand sketch · ${roundNice(length)} × ${roundNice(width)} mm outline · ${holes.length} interior cut${holes.length === 1 ? "" : "s"}.`,
		confidence: holes.length ? .62 : .5,
		notes: "Thickness is not in the drawing. Default 4 mm until you confirm.",
		sourceLabel: "Hand sketch",
		features,
		questions: [{
			id: uid("q"),
			prompt: "How thick is this part?",
			why: "A sketch has no Z. Everything else waits on this.",
			options: [
				{
					label: "3 mm",
					reply: "3 mm thick",
					patch: { params: { height: 3 } }
				},
				{
					label: "4 mm",
					reply: "4 mm thick",
					patch: { params: { height: 4 } }
				},
				{
					label: "8 mm",
					reply: "8 mm thick",
					patch: { params: { height: 8 } }
				},
				{
					label: "12 mm",
					reply: "12 mm thick",
					patch: { params: { height: 12 } }
				}
			]
		}]
	};
}
function roundNice(n) {
	if (n < 2) return Math.round(n * 10) / 10;
	if (n < 20) return Math.round(n * 2) / 2;
	return Math.round(n);
}
function stampLine(occ, w, h, x0, y0, x1, y1) {
	const steps = Math.max(1, Math.abs(x1 - x0), Math.abs(y1 - y0));
	for (let i = 0; i <= steps; i++) {
		const x = Math.round(x0 + (x1 - x0) * i / steps);
		const y = Math.round(y0 + (y1 - y0) * i / steps);
		if (x >= 0 && y >= 0 && x < w && y < h) occ[y * w + x] = 1;
	}
}
function dilate(occ, w, h) {
	const copy = occ.slice();
	for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
		if (copy[y * w + x]) continue;
		if (copy[y * w + x - 1] || copy[y * w + x + 1] || copy[(y - 1) * w + x] || copy[(y + 1) * w + x]) occ[y * w + x] = 1;
	}
}
function findHoles(occ, w, h, length, width) {
	const seen = new Uint8Array(w * h);
	const stack = [0];
	seen[0] = 1;
	while (stack.length) {
		const i = stack.pop();
		if (occ[i]) continue;
		const x = i % w;
		const y = i / w | 0;
		const nbs = [
			x > 0 ? i - 1 : -1,
			x + 1 < w ? i + 1 : -1,
			y > 0 ? i - w : -1,
			y + 1 < h ? i + w : -1
		];
		for (const n of nbs) if (n >= 0 && !seen[n] && !occ[n]) {
			seen[n] = 1;
			stack.push(n);
		}
	}
	const holes = [];
	for (let i = 0; i < occ.length; i++) {
		if (occ[i] || seen[i]) continue;
		const cells = [];
		const q = [i];
		seen[i] = 1;
		while (q.length) {
			const j = q.pop();
			cells.push(j);
			const x = j % w;
			const y = j / w | 0;
			const nbs = [
				x > 0 ? j - 1 : -1,
				x + 1 < w ? j + 1 : -1,
				y > 0 ? j - w : -1,
				y + 1 < h ? j + w : -1
			];
			for (const n of nbs) if (n >= 0 && !seen[n] && !occ[n]) {
				seen[n] = 1;
				q.push(n);
			}
		}
		if (cells.length < 8 || cells.length > w * h / 3) continue;
		let sx = 0, sy = 0;
		for (const c of cells) {
			sx += c % w;
			sy += c / w | 0;
		}
		const cx = sx / cells.length;
		const cy = sy / cells.length;
		const area = cells.length;
		const rCell = Math.sqrt(area / Math.PI);
		holes.push({
			x: (cx / w - .5) * length,
			z: (cy / h - .5) * width,
			r: roundNice(Math.max(1.2, rCell * (length / w)))
		});
	}
	return holes.slice(0, 8);
}
function isCircular(occ, w, h) {
	let count = 0;
	let cx = 0, cy = 0;
	for (let i = 0; i < occ.length; i++) {
		if (!occ[i]) continue;
		count++;
		cx += i % w;
		cy += i / w | 0;
	}
	if (count < 20) return false;
	cx /= count;
	cy /= count;
	const rs = [];
	for (let i = 0; i < occ.length; i++) {
		if (!occ[i]) continue;
		const x = i % w;
		const y = i / w | 0;
		rs.push(Math.hypot(x - cx, y - cy));
	}
	rs.sort((a, b) => a - b);
	const outer = rs.slice(Math.floor(rs.length * .7));
	const mean = outer.reduce((a, b) => a + b, 0) / outer.length;
	const variance = outer.reduce((s, v) => s + (v - mean) ** 2, 0) / outer.length;
	return mean > 0 && Math.sqrt(variance) / mean < .18;
}
function detectL(occ, w, h) {
	const q = (x0, y0, x1, y1) => {
		let filled = 0;
		let total = 0;
		for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
			total++;
			if (occ[y * w + x]) filled++;
		}
		return filled / (total || 1);
	};
	const mx = w / 2 | 0;
	const my = h / 2 | 0;
	const tl = q(0, 0, mx, my);
	const tr = q(mx, 0, w, my);
	const bl = q(0, my, mx, h);
	const br = q(mx, my, w, h);
	const vals = {
		tl,
		tr,
		bl,
		br
	};
	if (Math.max(tl, tr, bl, br) < .08 || Math.min(tl, tr, bl, br) > .28) return null;
	const empty = Object.keys(vals).reduce((a, k) => vals[k] < vals[a] ? k : a);
	if (Object.keys(vals).filter((k) => k !== empty).every((k) => vals[k] > .08) && vals[empty] < .12) return empty;
	return null;
}
function lToBoxes(corner, length, width, height) {
	const t = Math.max(4, Math.min(length, width) * .28);
	const hFlange = {
		id: uid("f"),
		kind: "box",
		name: "Base flange",
		op: "add",
		params: {
			length,
			width: t,
			height,
			fillet: .5
		},
		position: {
			x: 0,
			y: height / 2,
			z: 0
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		}
	};
	const vFlange = {
		id: uid("f"),
		kind: "box",
		name: "Upright flange",
		op: "add",
		params: {
			length: t,
			width,
			height,
			fillet: .5
		},
		position: {
			x: 0,
			y: height / 2,
			z: 0
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		}
	};
	if (corner === "tr" || corner === "br") {
		vFlange.position.x = -length / 2 + t / 2;
		hFlange.position.z = corner === "tr" ? width / 2 - t / 2 : -width / 2 + t / 2;
	} else {
		vFlange.position.x = length / 2 - t / 2;
		hFlange.position.z = corner === "tl" ? width / 2 - t / 2 : -width / 2 + t / 2;
	}
	return {
		a: hFlange,
		b: vFlange
	};
}
async function fileToCanvas(file) {
	const url = URL.createObjectURL(file);
	try {
		const img = await loadImage(url);
		const scale = Math.min(1, 1024 / Math.max(img.width, img.height));
		const canvas = document.createElement("canvas");
		canvas.width = Math.max(1, Math.round(img.width * scale));
		canvas.height = Math.max(1, Math.round(img.height * scale));
		canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
		return canvas;
	} finally {
		URL.revokeObjectURL(url);
	}
}
function canvasToJpeg(canvas, quality = .78) {
	return canvas.toDataURL("image/jpeg", quality);
}
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("image load failed"));
		img.src = src;
	});
}
var DEG = Math.PI / 180;
var CUT_OVERSHOOT = .45;
function num(params, key, fallback) {
	const v = params[key];
	return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}
function applyAxis(geo, axis) {
	if (!axis || axis === "y") return geo;
	if (axis === "x") geo.rotateZ(-Math.PI / 2);
	if (axis === "z") geo.rotateX(Math.PI / 2);
	return geo;
}
function wedgeGeometry(length, width, height) {
	const shape = new Shape();
	shape.moveTo(0, 0);
	shape.lineTo(width, 0);
	shape.lineTo(0, height);
	shape.closePath();
	const geo = new ExtrudeGeometry(shape, {
		depth: length,
		bevelEnabled: false,
		curveSegments: 1
	});
	geo.translate(-width / 2, 0, -length / 2);
	geo.rotateY(-Math.PI / 2);
	geo.computeVertexNormals();
	return geo;
}
function extrudeGeometry(feature) {
	const profile = feature.profile ?? [];
	const height = num(feature.params, "height", 8);
	if (profile.length < 3) return new BoxGeometry(20, height, 20);
	const shape = new Shape();
	shape.moveTo(profile[0].x, -profile[0].z);
	for (let i = 1; i < profile.length; i++) shape.lineTo(profile[i].x, -profile[i].z);
	shape.closePath();
	const geo = new ExtrudeGeometry(shape, {
		depth: height,
		bevelEnabled: false,
		curveSegments: 8
	});
	geo.rotateX(-Math.PI / 2);
	geo.computeVertexNormals();
	return geo;
}
function featureGeometry(feature) {
	const d = KIND_DEFAULTS[feature.kind];
	const p = feature.params;
	switch (feature.kind) {
		case "box": {
			const length = num(p, "length", d.length);
			const width = num(p, "width", d.width);
			const height = num(p, "height", d.height);
			const fillet = Math.min(num(p, "fillet", 0), Math.min(length, width, height) / 2 - .05);
			if (fillet > .2) return new RoundedBoxGeometry(length, height, width, Math.max(2, Math.ceil(fillet)), fillet);
			return new BoxGeometry(length, height, width);
		}
		case "cylinder": {
			const r = num(p, "radius", d.radius);
			const h = num(p, "height", d.height);
			return applyAxis(new CylinderGeometry(r, r, h, 48), feature.axis);
		}
		case "sphere": {
			const r = num(p, "radius", d.radius);
			return new SphereGeometry(r, 32, 24);
		}
		case "cone": {
			const rb = num(p, "radiusBottom", d.radiusBottom);
			const rt = num(p, "radiusTop", d.radiusTop);
			const h = num(p, "height", d.height);
			return applyAxis(new CylinderGeometry(rt, rb, h, 40), feature.axis);
		}
		case "wedge": return wedgeGeometry(num(p, "length", d.length), num(p, "width", d.width), num(p, "height", d.height));
		case "extrude": return extrudeGeometry(feature);
		case "hole": {
			const r = num(p, "radius", d.radius);
			const depth = num(p, "depth", d.depth) + CUT_OVERSHOOT;
			return applyAxis(new CylinderGeometry(r, r, depth, 36), feature.axis);
		}
		case "slot": {
			const length = num(p, "length", d.length);
			const width = num(p, "width", d.width);
			const depth = num(p, "depth", d.depth) + CUT_OVERSHOOT;
			const radius = Math.min(width / 2, length / 2);
			const shape = new Shape();
			const w = length / 2 - radius;
			width / 2;
			if (w <= 0) return applyAxis(new CylinderGeometry(width / 2, width / 2, depth, 28), feature.axis);
			shape.absarc(-w, 0, radius, Math.PI / 2, Math.PI * 3 / 2, false);
			shape.absarc(w, 0, radius, Math.PI * 3 / 2, Math.PI / 2, false);
			const geo = new ExtrudeGeometry(shape, {
				depth,
				bevelEnabled: false,
				curveSegments: 16
			});
			geo.translate(0, 0, -depth / 2);
			geo.rotateX(-Math.PI / 2);
			return applyAxis(geo, feature.axis);
		}
		case "pocket": {
			const length = num(p, "length", d.length);
			const width = num(p, "width", d.width);
			const depth = num(p, "depth", d.depth) + CUT_OVERSHOOT;
			return applyAxis(new BoxGeometry(length, depth, width), feature.axis);
		}
		default: return new BoxGeometry(10, 10, 10);
	}
}
function featureMatrix(feature) {
	const m = new Matrix4();
	const pos = feature.position;
	const rot = feature.rotation;
	const e = new Euler(rot.x * DEG, rot.y * DEG, rot.z * DEG, "XYZ");
	m.makeRotationFromEuler(e);
	m.setPosition(pos.x, pos.y, pos.z);
	return m;
}
async function buildSolid(features) {
	const visible = features.filter((f) => !f.hidden);
	const adds = visible.filter((f) => f.op === "add");
	const subs = visible.filter((f) => f.op === "subtract");
	if (adds.length === 0) return null;
	try {
		const { Brush, Evaluator, ADDITION, SUBTRACTION } = await import("../_libs/three-bvh-csg+three-mesh-bvh.mjs").then((n) => n.t);
		const evaluator = new Evaluator();
		evaluator.useGroups = false;
		const dummy = new MeshStandardMaterial();
		const toBrush = (f) => {
			const geo = featureGeometry(f);
			const brush = new Brush(geo, dummy);
			brush.position.set(f.position.x, f.position.y, f.position.z);
			brush.rotation.set(f.rotation.x * DEG, f.rotation.y * DEG, f.rotation.z * DEG);
			brush.updateMatrixWorld();
			return brush;
		};
		let acc = toBrush(adds[0]);
		for (let i = 1; i < adds.length; i++) acc = evaluator.evaluate(acc, toBrush(adds[i]), ADDITION);
		for (const s of subs) acc = evaluator.evaluate(acc, toBrush(s), SUBTRACTION);
		const geometry = acc.geometry.clone();
		geometry.computeVertexNormals();
		geometry.computeBoundingBox();
		dummy.dispose();
		return {
			geometry,
			usedCsg: true
		};
	} catch {
		const group = [];
		for (const f of adds) {
			const geo = featureGeometry(f);
			geo.applyMatrix4(featureMatrix(f));
			group.push(geo);
		}
		const geometry = group[0];
		geometry.computeVertexNormals();
		return {
			geometry,
			usedCsg: false
		};
	}
}
function measureDoc(doc) {
	const box = new Box3();
	const tmp = new Box3();
	const empty = {
		min: {
			x: 0,
			y: 0,
			z: 0
		},
		max: {
			x: 0,
			y: 0,
			z: 0
		},
		size: {
			x: 0,
			y: 0,
			z: 0
		}
	};
	let any = false;
	for (const f of doc.features) {
		if (f.hidden || f.op === "subtract") continue;
		const geo = featureGeometry(f);
		geo.applyMatrix4(featureMatrix(f));
		geo.computeBoundingBox();
		if (!geo.boundingBox) continue;
		tmp.copy(geo.boundingBox);
		if (!any) {
			box.copy(tmp);
			any = true;
		} else box.union(tmp);
		geo.dispose();
	}
	if (!any) return empty;
	const size = new Vector3();
	box.getSize(size);
	return {
		min: {
			x: box.min.x,
			y: box.min.y,
			z: box.min.z
		},
		max: {
			x: box.max.x,
			y: box.max.y,
			z: box.max.z
		},
		size: {
			x: size.x,
			y: size.y,
			z: size.z
		}
	};
}
function layoutParts(docs, gap = 16) {
	if (docs.length <= 1) return docs.map((d) => ({
		id: d.id,
		offset: {
			x: 0,
			y: 0,
			z: 0
		},
		size: measureDoc(d).size
	}));
	let x = 0;
	const raw = docs.map((doc) => {
		const m = measureDoc(doc);
		const w = Math.max(m.size.x, 1);
		const offset = {
			x: x - m.min.x,
			y: -m.min.y,
			z: -(m.min.z + m.max.z) / 2
		};
		x += w + gap;
		return {
			id: doc.id,
			offset,
			size: m.size
		};
	});
	const shift = (x - gap) / 2;
	return raw.map((r) => ({
		...r,
		offset: {
			...r.offset,
			x: r.offset.x - shift
		}
	}));
}
function scaleDoc(doc, factor) {
	const scaleVec = (v) => ({
		x: v.x * factor,
		y: v.y * factor,
		z: v.z * factor
	});
	return {
		...doc,
		features: doc.features.map((f) => ({
			...f,
			params: Object.fromEntries(Object.entries(f.params).map(([k, v]) => [k, v * factor])),
			position: scaleVec(f.position),
			profile: f.profile?.map((p) => ({
				x: p.x * factor,
				z: p.z * factor
			}))
		}))
	};
}
var MATERIALS = [
	{
		id: "pla",
		name: "PLA",
		hotend: 200,
		bed: 60,
		density: 1.24,
		fan: 255,
		retract: .8,
		speed: 60
	},
	{
		id: "petg",
		name: "PETG",
		hotend: 240,
		bed: 80,
		density: 1.27,
		fan: 128,
		retract: 1.2,
		speed: 50
	},
	{
		id: "abs",
		name: "ABS",
		hotend: 250,
		bed: 100,
		density: 1.04,
		fan: 40,
		retract: .8,
		speed: 50
	},
	{
		id: "tpu",
		name: "TPU",
		hotend: 220,
		bed: 50,
		density: 1.21,
		fan: 80,
		retract: .4,
		speed: 28
	}
];
var PRINTERS = [
	{
		id: "ender3",
		name: "Ender 3 / Creality",
		brand: "Creality",
		firmware: "marlin",
		bedX: 220,
		bedY: 220,
		bedZ: 250,
		nozzle: .4,
		filament: 1.75,
		note: "Most common bed. SD card or OctoPrint on Mac and Windows."
	},
	{
		id: "prusa-mk3",
		name: "Prusa MK3S / MK3.5",
		brand: "Prusa",
		firmware: "marlin",
		bedX: 250,
		bedY: 210,
		bedZ: 210,
		nozzle: .4,
		filament: 1.75,
		note: "Prusa firmware is Marlin-based. USB or SD on macOS and Windows."
	},
	{
		id: "prusa-mk4",
		name: "Prusa MK4 / MK4S",
		brand: "Prusa",
		firmware: "marlin",
		bedX: 250,
		bedY: 210,
		bedZ: 220,
		nozzle: .4,
		filament: 1.75,
		note: "Input shaping Marlin. Same G-code path as MK3."
	},
	{
		id: "bambu-p1",
		name: "Bambu P1 / X1",
		brand: "Bambu",
		firmware: "klipper",
		bedX: 256,
		bedY: 256,
		bedZ: 256,
		nozzle: .4,
		filament: 1.75,
		note: "Prefer 3MF into Bambu Studio (Mac & Windows). G-code is Klipper-flavoured."
	},
	{
		id: "k1",
		name: "Creality K1 / K1 Max",
		brand: "Creality",
		firmware: "klipper",
		bedX: 220,
		bedY: 220,
		bedZ: 250,
		nozzle: .4,
		filament: 1.75,
		note: "Klipper. Fluidd / Creality Print on Mac and Windows."
	},
	{
		id: "voron-250",
		name: "Voron 2.4 250",
		brand: "Voron",
		firmware: "klipper",
		bedX: 250,
		bedY: 250,
		bedZ: 250,
		nozzle: .4,
		filament: 1.75,
		note: "Mainsail or Fluidd from any desktop OS."
	},
	{
		id: "elegoo-neptune",
		name: "Elegoo Neptune 3/4",
		brand: "Elegoo",
		firmware: "marlin",
		bedX: 220,
		bedY: 220,
		bedZ: 280,
		nozzle: .4,
		filament: 1.75,
		note: "Marlin. SD or Elegoo slicer on Mac and Windows."
	},
	{
		id: "anycubic-kobra",
		name: "Anycubic Kobra",
		brand: "Anycubic",
		firmware: "marlin",
		bedX: 220,
		bedY: 220,
		bedZ: 250,
		nozzle: .4,
		filament: 1.75,
		note: "Marlin. SD card on either OS."
	},
	{
		id: "generic-300",
		name: "Generic 300 mm",
		brand: "Generic",
		firmware: "marlin",
		bedX: 300,
		bedY: 300,
		bedZ: 300,
		nozzle: .4,
		filament: 1.75,
		note: "Larger bed, Marlin/Klipper-safe start. Use for custom machines."
	}
];
function printerById(id) {
	return PRINTERS.find((p) => p.id === id) ?? PRINTERS[0];
}
function materialById(id) {
	return MATERIALS.find((m) => m.id === id) ?? MATERIALS[0];
}
var DEFAULT_SLICER = {
	printerId: "ender3",
	material: "pla",
	layerHeight: .2,
	walls: 2,
	infill: 20,
	brim: false,
	kit: true
};
function startGcode(printer, mat, hotend, bed) {
	const lines = [
		`; Graphite Universal Slicer`,
		`;FLAVOR:${printer.firmware === "klipper" ? "Klipper" : "Marlin"}`,
		`; Printer: ${printer.name}`,
		`; Material: ${mat.name}`,
		`; Compatible: macOS, Windows, Linux — SD, USB, OctoPrint, Fluidd, Mainsail`,
		`; No native slicer required. 3MF also opens in Cura, PrusaSlicer, Bambu Studio.`,
		"G90",
		"G21",
		"M83",
		"M107",
		`M140 S${bed}`,
		`M104 S${hotend}`
	];
	if (printer.firmware === "klipper") lines.push("G28", `M190 S${bed}`, `M109 S${hotend}`, "G92 E0");
	else lines.push("G28", `M190 S${bed}`, `M109 S${hotend}`, "G92 E0");
	const y2 = Math.min(printer.bedY - 10, 180);
	lines.push("G1 Z2 F3000", `G1 X5 Y10 Z0.3 F6000`, `G1 X5 Y${y2} Z0.3 F1500 E18`, `G1 X7 Y${y2} Z0.3 F6000`, `G1 X7 Y10 Z0.3 F1500 E36`, "G92 E0", "G1 E-0.6 F2100", "G1 Z1 F3000");
	return lines;
}
function endGcode(printer) {
	return [
		"M107",
		"G1 E-2 F2100",
		"G91",
		"G1 Z8 F600",
		"G90",
		`G1 X${Math.max(0, printer.bedX - 10)} Y${Math.max(0, printer.bedY - 10)} F6000`,
		"M104 S0",
		"M140 S0",
		"M84",
		"M30"
	];
}
var emptyPipeline = [
	{
		id: "route",
		label: "Media router",
		status: "pending"
	},
	{
		id: "trace",
		label: "Trace edges",
		status: "pending"
	},
	{
		id: "features",
		label: "Classify features",
		status: "pending"
	},
	{
		id: "param",
		label: "Parametric model",
		status: "pending"
	}
];
function writeDoc(parts, next) {
	return parts.map((p) => p.id === next.id ? next : p);
}
var useApp = create((set, get) => ({
	phase: "intake",
	doc: null,
	parts: [],
	activeId: null,
	thumbs: {},
	chats: {},
	selectedId: null,
	messages: [],
	pipeline: emptyPipeline,
	busy: false,
	error: null,
	captureMode: null,
	sourceThumb: null,
	mobileTab: "capture",
	kitView: true,
	slicerOpen: false,
	slicerSettings: DEFAULT_SLICER,
	sliceResult: null,
	sliceLayer: 0,
	slicerProgress: -1,
	navTab: "project",
	navOpen: true,
	inspectorOpen: false,
	commandOpen: false,
	searchQuery: "",
	reportOpen: false,
	reportTab: "output",
	setPhase: (phase) => set({ phase }),
	setBusy: (busy) => set({ busy }),
	setError: (error) => set({ error }),
	setCaptureMode: (captureMode) => set({ captureMode }),
	setMobileTab: (mobileTab) => set({ mobileTab }),
	setKitView: (kitView) => set({ kitView }),
	setSlicerOpen: (slicerOpen) => set({
		slicerOpen,
		mobileTab: slicerOpen ? "slice" : get().mobileTab === "slice" ? "talk" : get().mobileTab
	}),
	patchSlicer: (p) => set({
		slicerSettings: {
			...get().slicerSettings,
			...p
		},
		sliceResult: null,
		slicerProgress: -1
	}),
	setSliceResult: (sliceResult) => set({
		sliceResult,
		sliceLayer: sliceResult ? Math.max(0, sliceResult.layers.length - 1) : 0,
		slicerProgress: sliceResult ? 1 : -1,
		reportOpen: sliceResult ? true : get().reportOpen,
		reportTab: sliceResult ? "output" : get().reportTab
	}),
	setSliceLayer: (sliceLayer) => set({ sliceLayer }),
	setSlicerProgress: (slicerProgress) => set({ slicerProgress }),
	setNavTab: (navTab) => set({
		navTab,
		navOpen: true
	}),
	toggleActivity: (tab) => {
		const s = get();
		if (s.navOpen && s.navTab === tab) {
			set({ navOpen: false });
			return;
		}
		set({
			navTab: tab,
			navOpen: true
		});
	},
	setNavOpen: (navOpen) => set({ navOpen }),
	setInspectorOpen: (inspectorOpen) => set({ inspectorOpen }),
	setCommandOpen: (commandOpen) => set({ commandOpen }),
	setSearchQuery: (searchQuery) => set({ searchQuery }),
	setReportOpen: (reportOpen) => set({ reportOpen }),
	setReportTab: (reportTab) => set({ reportTab }),
	setPipeline: (pipeline) => set({ pipeline }),
	patchPipeline: (id, patch) => set({ pipeline: get().pipeline.map((s) => s.id === id ? {
		...s,
		...patch
	} : s) }),
	loadDoc: (doc, opts) => {
		const state = get();
		const exists = state.parts.some((p) => p.id === doc.id);
		const chats = { ...state.chats };
		if (state.activeId && state.activeId !== doc.id) chats[state.activeId] = state.messages;
		let messages = exists ? state.activeId === doc.id ? state.messages : chats[doc.id] ?? [] : [];
		if (opts?.message) messages = [...messages, {
			id: uid("m"),
			role: "assistant",
			text: opts.message,
			questions: doc.questions.filter((q) => !q.answered)
		}];
		chats[doc.id] = messages;
		const thumbs = { ...state.thumbs };
		if (opts?.thumb !== void 0) thumbs[doc.id] = opts.thumb;
		const parts = exists ? writeDoc(state.parts, doc) : [...state.parts, doc];
		set({
			doc,
			parts,
			activeId: doc.id,
			thumbs,
			chats,
			messages,
			phase: "refine",
			selectedId: doc.features[0]?.id ?? null,
			sourceThumb: thumbs[doc.id] ?? null,
			error: null,
			busy: false,
			inspectorOpen: true,
			pipeline: state.pipeline.map((s) => ({
				...s,
				status: "done"
			})),
			mobileTab: "talk",
			kitView: parts.length > 1 ? true : state.kitView,
			sliceResult: null,
			slicerProgress: -1
		});
	},
	setActive: (id) => {
		const state = get();
		const part = state.parts.find((p) => p.id === id);
		if (!part || state.activeId === id) return;
		const chats = { ...state.chats };
		if (state.activeId) chats[state.activeId] = state.messages;
		set({
			chats,
			activeId: id,
			doc: part,
			messages: chats[id] ?? [],
			sourceThumb: state.thumbs[id] ?? null,
			selectedId: part.features[0]?.id ?? null,
			mobileTab: "model",
			sliceResult: null
		});
	},
	removePart: (id) => {
		const state = get();
		const parts = state.parts.filter((p) => p.id !== id);
		if (!parts.length) {
			get().reset();
			return;
		}
		const chats = { ...state.chats };
		if (state.activeId) chats[state.activeId] = state.messages;
		delete chats[id];
		const thumbs = { ...state.thumbs };
		delete thumbs[id];
		const nextId = (state.activeId === id ? parts[0] : state.doc)?.id ?? parts[0].id;
		const part = parts.find((p) => p.id === nextId) ?? parts[0];
		set({
			parts,
			chats,
			thumbs,
			doc: part,
			activeId: part.id,
			messages: chats[part.id] ?? [],
			sourceThumb: thumbs[part.id] ?? null,
			selectedId: part.features[0]?.id ?? null,
			sliceResult: null
		});
	},
	select: (selectedId) => set({ selectedId }),
	updateParam: (featureId, key, value) => {
		const doc = get().doc;
		if (!doc) return;
		const next = {
			...doc,
			features: doc.features.map((f) => f.id === featureId ? {
				...f,
				params: {
					...f.params,
					[key]: value
				}
			} : f)
		};
		set({
			doc: next,
			parts: writeDoc(get().parts, next),
			sliceResult: null
		});
	},
	applyQuestionPatch: (patch, reply, questionId) => {
		const doc = get().doc;
		if (!doc) return;
		const thickness = !patch.featureId ? patch.params?.height : void 0;
		const rest = thickness !== void 0 ? {
			...patch,
			params: Object.fromEntries(Object.entries(patch.params ?? {}).filter(([k]) => k !== "height"))
		} : patch;
		let next = Object.keys(rest.params ?? {}).length || rest.featureId || rest.deleteFeature || rest.addFeatures || rest.units ? applyPatch(doc, rest) : {
			...doc,
			features: doc.features.map((f) => ({
				...f,
				params: { ...f.params }
			}))
		};
		if (thickness !== void 0) next = applyThickness(next, thickness);
		next = {
			...next,
			questions: next.questions.map((q) => q.id === questionId ? {
				...q,
				answered: reply
			} : q),
			confidence: Math.min(1, next.confidence + .12)
		};
		const messages = [
			...get().messages.map((m) => ({
				...m,
				questions: m.questions?.map((q) => q.id === questionId ? {
					...q,
					answered: reply
				} : q)
			})),
			{
				id: uid("m"),
				role: "user",
				text: reply
			},
			{
				id: uid("m"),
				role: "assistant",
				text: "Locked in. Anything else off?",
				questions: next.questions.filter((q) => !q.answered)
			}
		];
		const chats = {
			...get().chats,
			[next.id]: messages
		};
		set({
			doc: next,
			parts: writeDoc(get().parts, next),
			messages,
			chats,
			sliceResult: null
		});
	},
	setUnits: (u) => {
		const doc = get().doc;
		if (!doc) return;
		if (doc.units === u) {
			const next = {
				...doc,
				units: u
			};
			set({
				doc: next,
				parts: writeDoc(get().parts, next),
				sliceResult: null
			});
			return;
		}
		const scaled = {
			...scaleDoc(doc, u === "in" ? 1 / 25.4 : 25.4),
			units: u
		};
		set({
			doc: scaled,
			parts: writeDoc(get().parts, scaled),
			sliceResult: null
		});
	},
	addMessage: (m) => {
		const messages = [...get().messages, {
			id: m.id ?? uid("m"),
			...m
		}];
		const id = get().activeId;
		set({
			messages,
			chats: id ? {
				...get().chats,
				[id]: messages
			} : get().chats
		});
	},
	addFeature: (kind) => {
		const doc = get().doc;
		if (!doc) return;
		const subtract = kind === "hole" || kind === "slot" || kind === "pocket";
		const f = {
			id: uid("f"),
			kind,
			name: kind.charAt(0).toUpperCase() + kind.slice(1),
			op: subtract ? "subtract" : "add",
			params: { ...KIND_DEFAULTS[kind] },
			position: {
				x: 0,
				y: subtract ? 5 : 10,
				z: 0
			},
			rotation: {
				x: 0,
				y: 0,
				z: 0
			},
			axis: "y"
		};
		const next = {
			...doc,
			features: [...doc.features, f]
		};
		set({
			doc: next,
			parts: writeDoc(get().parts, next),
			selectedId: f.id,
			sliceResult: null
		});
	},
	removeFeature: (id) => {
		const doc = get().doc;
		if (!doc) return;
		const features = doc.features.filter((f) => f.id !== id);
		const next = {
			...doc,
			features
		};
		set({
			doc: next,
			parts: writeDoc(get().parts, next),
			selectedId: get().selectedId === id ? features[0]?.id ?? null : get().selectedId,
			sliceResult: null
		});
	},
	toggleHidden: (id) => {
		const doc = get().doc;
		if (!doc) return;
		const next = {
			...doc,
			features: doc.features.map((f) => f.id === id ? {
				...f,
				hidden: !f.hidden
			} : f)
		};
		set({
			doc: next,
			parts: writeDoc(get().parts, next),
			sliceResult: null
		});
	},
	reset: () => set({
		phase: "intake",
		doc: null,
		parts: [],
		activeId: null,
		thumbs: {},
		chats: {},
		selectedId: null,
		messages: [],
		pipeline: emptyPipeline,
		busy: false,
		error: null,
		captureMode: null,
		sourceThumb: null,
		mobileTab: "capture",
		kitView: true,
		slicerOpen: false,
		sliceResult: null,
		sliceLayer: 0,
		slicerProgress: -1,
		navTab: "project",
		navOpen: true,
		inspectorOpen: false,
		commandOpen: false,
		searchQuery: "",
		reportOpen: false,
		reportTab: "output"
	})
}));
var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function baseSteps() {
	return [
		{
			id: "route",
			label: "Media router",
			status: "pending"
		},
		{
			id: "trace",
			label: "Trace edges",
			status: "pending"
		},
		{
			id: "features",
			label: "Classify features",
			status: "pending"
		},
		{
			id: "param",
			label: "Parametric model",
			status: "pending"
		}
	];
}
async function runSteps(details, work) {
	const { setPhase, setBusy, setPipeline, patchPipeline, setError, loadDoc } = useApp.getState();
	setError(null);
	setBusy(true);
	setPhase("recognize");
	setPipeline(baseSteps());
	const order = [
		"route",
		"trace",
		"features",
		"param"
	];
	try {
		for (const id of order) {
			patchPipeline(id, {
				status: "active",
				detail: details[id]
			});
			if (id !== "param") await sleep(id === "route" ? 420 : 280);
			if (id === "param") {
				const result = await work();
				patchPipeline(id, {
					status: "done",
					detail: `${result.doc.features.length} features · ${Math.round(result.doc.confidence * 100)}%`
				});
				loadDoc(result.doc, {
					thumb: result.thumb,
					message: result.message
				});
				return;
			}
			patchPipeline(id, {
				status: "done",
				detail: details[id]
			});
		}
	} catch (err) {
		setBusy(false);
		setPhase("intake");
		setError(err instanceof Error ? err.message : "Could not read that input");
	}
}
async function ingestTemplate(id) {
	const t = TEMPLATES[id];
	const doc = t.build();
	const existing = useApp.getState().parts.length;
	await runSteps({
		route: existing ? `Adding ${t.mediaLabel} as part ${existing + 1}` : `${t.mediaLabel} detected`,
		trace: "Sample sketch, using calibrated template",
		features: `${doc.features.length} features from the drawing`,
		param: doc.name
	}, async () => ({
		doc,
		thumb: t.image,
		message: existing > 0 ? `${doc.name} added beside the other part${existing === 1 ? "" : "s"}. Confirm this one, or switch in the tree.` : `${doc.notes} ${doc.questions.length} questions still open — a sketch is a guess until you confirm it.`
	}));
}
async function ingestKit(ids = ["bracket", "bushing"]) {
	const built = ids.map((id) => {
		const t = TEMPLATES[id];
		return {
			t,
			doc: t.build()
		};
	});
	const first = built[0];
	if (!first) return;
	const names = built.map((b) => b.doc.name).join(" + ");
	await runSteps({
		route: built.map((b) => b.t.mediaLabel).join(" + "),
		trace: `${built.length} calibrated sketches`,
		features: `${built.reduce((n, b) => n + b.doc.features.length, 0)} features across ${built.length} parts`,
		param: names
	}, async () => ({
		doc: first.doc,
		thumb: first.t.image,
		message: `${first.doc.notes} ${built.length} parts on the bed. Confirm this one, then switch to the next.`
	}));
	for (const extra of built.slice(1)) useApp.getState().loadDoc(extra.doc, {
		thumb: extra.t.image,
		message: `${extra.doc.name} added. Two parts — print (STL) and mill (G-code) for each, or export the kit.`
	});
}
async function ingestImage(file, sourceLabel = "Uploaded sketch", note) {
	const canvas = await fileToCanvas(file);
	const guess = classifyCanvas(canvas);
	const jpeg = canvasToJpeg(canvas);
	const caption = note?.trim();
	await runSteps({
		route: guess.detail,
		trace: guess.media === "napkin" ? "Correcting perspective, inferring proportion" : "Tracing high-contrast edges",
		features: caption ? `Sketch + note: “${caption.slice(0, 48)}”` : "Holes, fillets, pockets",
		param: "Building the solid"
	}, async () => {
		const result = await interpretSketch({ data: {
			mode: "interpret",
			image: jpeg,
			text: caption,
			mediaHint: guess.media,
			pipelineNote: caption ? `${guess.detail}. User note: ${caption}` : guess.detail
		} });
		if (!result.ok) {
			const fallback = parseIntent(caption || "40x40x6 plate with 4 holes");
			if (fallback && (result.unavailable || caption)) {
				fallback.notes = result.unavailable ? "AI is offline. Parsed the note onto a first-pass solid." : fallback.notes;
				fallback.media = guess.media;
				fallback.sourceLabel = sourceLabel;
				return {
					doc: fallback,
					thumb: jpeg,
					message: result.unavailable ? "Vision is unavailable. I used the written dimensions on a generic plate — confirm them." : `Couldn't read the photo (${result.error}). Used the note instead.`
				};
			}
			throw new Error(result.error);
		}
		result.doc.sourceLabel = sourceLabel;
		result.doc.media = guess.media;
		return {
			doc: result.doc,
			thumb: jpeg,
			message: result.assistantMessage
		};
	});
}
async function ingestStrokes(strokes, w, h, note, jpeg) {
	const caption = note?.trim();
	if ((!strokes.length || strokes.flat().length < 8) && caption) {
		await ingestText(caption, "describe");
		return;
	}
	const local = applySpokenDims(recognizeStrokes(strokes, w, h), caption ?? "");
	await runSteps({
		route: caption ? "Hand sketch + description" : "Live hand sketch (gesture pad)",
		trace: `${strokes.length} stroke${strokes.length === 1 ? "" : "s"}${caption ? " · dimensions from the note" : ""}`,
		features: local.pipelineNote,
		param: local.name
	}, async () => ({
		doc: local,
		thumb: jpeg ?? null,
		message: caption ? `Shape from the sketch, numbers from “${caption}”. Confirm anything I still guessed.` : `${local.notes} Confirm thickness before you trust the solid.`
	}));
}
async function ingestText(text, media = "describe") {
	await runSteps({
		route: media === "voice" ? "Speech-to-intent" : "Text-to-intent",
		trace: "No raster — parsing dimensions from language",
		features: "Matching primitives to the description",
		param: "Drafting the solid"
	}, async () => {
		const result = await interpretSketch({ data: {
			mode: "interpret",
			text,
			mediaHint: media,
			pipelineNote: text.slice(0, 240)
		} });
		if (result.ok) {
			result.doc.media = media;
			result.doc.sourceLabel = media === "voice" ? "Spoken description" : "Written description";
			return {
				doc: result.doc,
				thumb: null,
				message: result.assistantMessage
			};
		}
		const local = parseIntent(text);
		if (local) {
			local.media = media;
			return {
				doc: local,
				thumb: null,
				message: result.unavailable ? "AI is offline, so I parsed the numbers locally. Confirm them." : `Couldn't reach the model (${result.error}). Parsed a first pass locally.`
			};
		}
		throw new Error(result.error);
	});
}
async function refineChat(text) {
	const { doc, messages, addMessage, loadDoc, setBusy, setError } = useApp.getState();
	if (!text.trim()) return;
	addMessage({
		role: "user",
		text
	});
	if (!doc) {
		await ingestText(text, "describe");
		return;
	}
	setBusy(true);
	setError(null);
	const result = await interpretSketch({ data: {
		mode: "refine",
		text,
		current: doc,
		history: messages.slice(-6).map((m) => ({
			role: m.role,
			text: m.text
		}))
	} });
	setBusy(false);
	if (!result.ok) {
		const lower = text.toLowerCase();
		if (/\b(\d+(?:\.\d+)?)\s*mm\b/.test(lower) && /thick/.test(lower)) {
			const n = Number(lower.match(/(\d+(?:\.\d+)?)\s*mm/)?.[1]);
			if (n) {
				const { applyQuestionPatch } = useApp.getState();
				applyQuestionPatch({ params: { height: n } }, text, uid("q"));
				return;
			}
		}
		setError(result.error);
		addMessage({
			role: "assistant",
			text: result.unavailable ? "AI is offline. Use the sliders on the left, or pick a question chip." : `Couldn't apply that (${result.error}). Try a question chip or a slider.`
		});
		return;
	}
	loadDoc(result.doc, { message: result.assistantMessage });
}
function KitCard() {
	const busy = useApp((s) => s.busy);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		disabled: busy,
		onClick: () => void ingestKit(["bracket", "bushing"]),
		className: "rise-in group flex w-full overflow-hidden rounded-md bg-surface text-left shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)] disabled:opacity-50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex h-24 w-[44%] shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/samples/bracket.jpg",
				alt: "",
				className: "h-full w-1/2 object-cover outline outline-1 -outline-offset-1 outline-fg/10"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/samples/bushing.jpg",
				alt: "",
				className: "h-full w-1/2 object-cover outline outline-1 -outline-offset-1 outline-fg/10"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-3 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium text-fg",
				children: "L-bracket + spacer bushing"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted",
				children: "Two sketches · both stay on the bed · slice on Mac or PC"
			})]
		})]
	});
}
function SampleGrid({ compact = false }) {
	const busy = useApp((s) => s.busy);
	const samples = listTemplates();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4"),
		children: samples.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			disabled: busy,
			onClick: () => void ingestTemplate(s.id),
			className: "rise-in group overflow-hidden rounded-md bg-surface text-left shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)] disabled:opacity-50",
			style: { animationDelay: `${i * 40}ms` },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: s.image,
				alt: "",
				className: "aspect-[4/3] w-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex flex-col gap-0.5 px-3 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium text-fg",
					children: s.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: s.blurb
				})]
			})]
		}, s.id))
	});
}
function CaptureBar() {
	const inputRef = (0, import_react.useRef)(null);
	const setCaptureMode = useApp((s) => s.setCaptureMode);
	const busy = useApp((s) => s.busy);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				accept: "image/*",
				className: "hidden",
				onChange: (e) => {
					const file = e.target.files?.[0];
					if (file) ingestImage(file, file.name);
					e.target.value = "";
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				size: "sm",
				variant: "outline",
				disabled: busy,
				onClick: () => inputRef.current?.click(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {}), " Photo"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				size: "sm",
				variant: "outline",
				disabled: busy,
				onClick: () => setCaptureMode("camera"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {}), " Camera"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				size: "sm",
				variant: "outline",
				disabled: busy,
				onClick: () => setCaptureMode("draw"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, {}), " Draw"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				size: "sm",
				variant: "outline",
				disabled: busy,
				onClick: () => setCaptureMode("voice"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {}), " Voice"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				size: "sm",
				variant: "outline",
				disabled: busy,
				onClick: () => setCaptureMode("describe"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, {}), " Describe"]
			})
		]
	});
}
function CaptureOverlay() {
	const mode = useApp((s) => s.captureMode);
	const setCaptureMode = useApp((s) => s.setCaptureMode);
	if (!mode || mode === "photo") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-20 flex items-center justify-center bg-bg/85 p-3 md:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex h-full max-h-[720px] w-full max-w-3xl flex-col rounded-lg bg-surface p-3 shadow-[var(--shadow-border)] md:p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-faint",
						children: mode === "draw" || mode === "gesture" ? "Sketch + dimensions" : mode === "camera" ? "Live camera" : mode === "voice" ? "Voice" : "Describe"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "icon-sm",
						variant: "ghost",
						onClick: () => setCaptureMode(null),
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
					})]
				}),
				mode === "draw" || mode === "gesture" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SketchPad, {}) : null,
				mode === "camera" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraPad, {}) : null,
				mode === "voice" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoicePad, {}) : null,
				mode === "describe" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DescribePad, {}) : null
			]
		})
	});
}
function SketchPad() {
	const canvasRef = (0, import_react.useRef)(null);
	const strokes = (0, import_react.useRef)([]);
	const current = (0, import_react.useRef)(null);
	const [n, setN] = (0, import_react.useState)(0);
	const [note, setNote] = (0, import_react.useState)("80 × 50 × 10 mm, four M3 holes");
	const [listening, setListening] = (0, import_react.useState)(false);
	const recRef = (0, import_react.useRef)(null);
	const busy = useApp((s) => s.busy);
	const setCaptureMode = useApp((s) => s.setCaptureMode);
	(0, import_react.useEffect)(() => {
		const c = canvasRef.current;
		if (!c) return;
		const resize = () => {
			const r = c.getBoundingClientRect();
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			c.width = Math.max(1, Math.floor(r.width * dpr));
			c.height = Math.max(1, Math.floor(r.height * dpr));
			redraw();
		};
		resize();
		window.addEventListener("resize", resize);
		return () => window.removeEventListener("resize", resize);
	}, []);
	function redraw() {
		const c = canvasRef.current;
		if (!c) return;
		const ctx = c.getContext("2d");
		if (!ctx) return;
		ctx.clearRect(0, 0, c.width, c.height);
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.strokeStyle = "#e8eaed";
		ctx.lineWidth = Math.max(2, c.width / 280);
		const all = current.current ? [...strokes.current, current.current] : strokes.current;
		for (const s of all) {
			if (s.length < 2) continue;
			ctx.beginPath();
			ctx.moveTo(s[0].x, s[0].y);
			for (let i = 1; i < s.length; i++) ctx.lineTo(s[i].x, s[i].y);
			ctx.stroke();
		}
	}
	function pt(e) {
		const c = canvasRef.current;
		const r = c.getBoundingClientRect();
		const sx = c.width / r.width;
		const sy = c.height / r.height;
		return {
			x: (e.clientX - r.left) * sx,
			y: (e.clientY - r.top) * sy
		};
	}
	function listen() {
		if (listening) {
			recRef.current?.stop();
			setListening(false);
			return;
		}
		const w = window;
		const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
		if (!Ctor) {
			useApp.getState().setError("Voice isn’t supported here. Type the dimensions instead.");
			return;
		}
		const rec = new Ctor();
		rec.lang = "en-US";
		rec.onresult = (ev) => {
			const t = ev.results[0]?.[0]?.transcript ?? "";
			if (t) setNote((prev) => prev && prev !== "80 × 50 × 10 mm, four M3 holes" ? `${prev} ${t}` : t);
		};
		rec.onend = () => setListening(false);
		recRef.current = rec;
		rec.start();
		setListening(true);
	}
	function build() {
		const c = canvasRef.current;
		if (!c) return;
		const jpeg = n > 0 ? c.toDataURL("image/jpeg", .72) : void 0;
		ingestStrokes(strokes.current, c.width, c.height, note.trim() || void 0, jpeg);
		setCaptureMode(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "sketch-grid min-h-0 flex-1 touch-none rounded-md",
			onPointerDown: (e) => {
				e.target.setPointerCapture(e.pointerId);
				current.current = [pt(e)];
			},
			onPointerMove: (e) => {
				if (!current.current) return;
				current.current.push(pt(e));
				redraw();
			},
			onPointerUp: () => {
				if (current.current && current.current.length > 1) {
					strokes.current.push(current.current);
					setN(strokes.current.length);
				}
				current.current = null;
				redraw();
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-xs text-muted",
			children: "Draw the outline. Add dimensions in the note — Graphite uses both."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: note,
				onChange: (e) => setNote(e.target.value),
				placeholder: "80 × 50 × 10 mm, four M3 holes",
				className: "h-11 min-w-0 flex-1 rounded-sm bg-bg px-3 text-sm text-fg placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "icon",
				variant: listening ? "default" : "outline",
				onClick: listen,
				"aria-label": listening ? "Stop listening" : "Speak dimensions",
				children: listening ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-[11px] text-muted",
				children: [n, " strokes"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: "ghost",
					onClick: () => {
						strokes.current = [];
						current.current = null;
						setN(0);
						redraw();
					},
					children: "Clear"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					disabled: busy || n === 0 && !note.trim(),
					onClick: build,
					children: "Build model"
				})]
			})]
		})
	] });
}
function CameraPad() {
	const videoRef = (0, import_react.useRef)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	const setCaptureMode = useApp((s) => s.setCaptureMode);
	const busy = useApp((s) => s.busy);
	(0, import_react.useEffect)(() => {
		let stream = null;
		navigator.mediaDevices?.getUserMedia({
			video: { facingMode: "environment" },
			audio: false
		}).then((s) => {
			stream = s;
			if (videoRef.current) videoRef.current.srcObject = s;
		}).catch(() => setErr("Camera is blocked. Drop a photo instead."));
		return () => stream?.getTracks().forEach((t) => t.stop());
	}, []);
	function snap() {
		const video = videoRef.current;
		if (!video) return;
		const c = document.createElement("canvas");
		c.width = video.videoWidth || 1024;
		c.height = video.videoHeight || 768;
		c.getContext("2d")?.drawImage(video, 0, 0);
		c.toBlob((blob) => {
			if (blob) {
				ingestImage(blob, "Camera still");
				setCaptureMode(null);
			}
		}, "image/jpeg", .82);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-0 flex-1 overflow-hidden rounded-md bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			ref: videoRef,
			autoPlay: true,
			playsInline: true,
			muted: true,
			className: "h-full w-full object-cover"
		}), err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted",
			children: err
		}) : null]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-3 flex justify-end",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			size: "sm",
			disabled: busy || Boolean(err),
			onClick: snap,
			children: "Capture still"
		})
	})] });
}
function VoicePad() {
	const [heard, setHeard] = (0, import_react.useState)("");
	const [listening, setListening] = (0, import_react.useState)(false);
	const recRef = (0, import_react.useRef)(null);
	const setCaptureMode = useApp((s) => s.setCaptureMode);
	const busy = useApp((s) => s.busy);
	function start() {
		const w = window;
		const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
		if (!Ctor) {
			setHeard("");
			useApp.getState().setError("Voice isn’t supported here. Type the description instead.");
			return;
		}
		const rec = new Ctor();
		rec.lang = "en-US";
		rec.onresult = (ev) => {
			const t = ev.results[0]?.[0]?.transcript ?? "";
			setHeard(t);
		};
		rec.onend = () => setListening(false);
		recRef.current = rec;
		rec.start();
		setListening(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col justify-between gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: "Speak the part like a shop drawing: “eighty by fifty by ten plate, four M3 holes, three millimetre stock.”"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "min-h-16 text-lg text-fg",
				children: heard || (listening ? "Listening…" : "Waiting.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: "outline",
					onClick: listening ? () => recRef.current?.stop() : start,
					children: listening ? "Stop" : "Listen"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					disabled: busy || !heard,
					onClick: () => {
						ingestText(heard, "voice");
						setCaptureMode(null);
					},
					children: "Build model"
				})]
			})
		]
	});
}
function DescribePad() {
	const [text, setText] = (0, import_react.useState)("80 × 50 × 10 mm plate with four M3 holes");
	const setCaptureMode = useApp((s) => s.setCaptureMode);
	const busy = useApp((s) => s.busy);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			value: text,
			onChange: (e) => setText(e.target.value),
			className: "min-h-32 flex-1 resize-none rounded-md bg-bg px-3 py-3 text-sm text-fg shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "sm",
				disabled: busy || !text.trim(),
				onClick: () => {
					ingestText(text.trim(), "describe");
					setCaptureMode(null);
				},
				children: "Build model"
			})
		})]
	});
}
function getSpeech() {
	const w = window;
	return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}
function ChatPanel() {
	const messages = useApp((s) => s.messages);
	const busy = useApp((s) => s.busy);
	const doc = useApp((s) => s.doc);
	const applyQuestionPatch = useApp((s) => s.applyQuestionPatch);
	const [text, setText] = (0, import_react.useState)("");
	const [listening, setListening] = (0, import_react.useState)(false);
	const recRef = (0, import_react.useRef)(null);
	const scroller = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		scroller.current?.scrollTo({
			top: scroller.current.scrollHeight,
			behavior: "smooth"
		});
	}, [messages, busy]);
	function send(value) {
		const v = (value ?? text).trim();
		if (!v || busy) return;
		setText("");
		refineChat(v);
	}
	function toggleMic() {
		if (listening) {
			recRef.current?.stop();
			setListening(false);
			return;
		}
		const Ctor = getSpeech();
		if (!Ctor) {
			useApp.getState().setError("Voice isn’t supported in this browser — type the part instead.");
			return;
		}
		const rec = new Ctor();
		rec.lang = "en-US";
		rec.continuous = false;
		rec.interimResults = false;
		rec.onresult = (ev) => {
			const said = ev.results[0]?.[0]?.transcript ?? "";
			if (said) send(said);
		};
		rec.onend = () => setListening(false);
		rec.onerror = () => setListening(false);
		recRef.current = rec;
		rec.start();
		setListening(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 pt-4 pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.16em] text-faint",
					children: "Refinement"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: doc ? `Never assume. ${doc.name} — ask until it’s right.` : "Never assume. Ask until it’s right."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: scroller,
				className: "min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-2",
				children: [
					messages.length === 0 && !doc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Describe a part, or drop a sketch. Example: “80 × 50 × 10 plate with four M3 holes.”"
					}) : null,
					messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("flex", m.role === "user" ? "justify-end" : "justify-start"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("max-w-[92%] rounded-md px-3 py-2 text-sm leading-relaxed", m.role === "user" ? "bg-accent text-accent-fg" : "bg-surface-subtle text-fg"),
							children: [m.text, m.questions && m.questions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-col gap-3",
								children: m.questions.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: q.prompt
									}),
									q.why ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-xs text-muted",
										children: q.why
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 flex flex-wrap gap-1.5",
										children: q.options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: Boolean(q.answered) || busy,
											onClick: () => {
												if (opt.patch) applyQuestionPatch(opt.patch, opt.reply, q.id);
												else refineChat(opt.reply);
											},
											className: "h-9 rounded-full px-3 text-xs text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)] disabled:opacity-40",
											children: opt.label
										}, opt.label))
									})
								] }, q.id))
							}) : null]
						})
					}, m.id)),
					busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "shimmer rounded-sm px-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted",
						children: "Reading the sketch"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex items-end gap-2 border-t border-border p-3",
				onSubmit: (e) => {
					e.preventDefault();
					send();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "icon",
						variant: listening ? "default" : "outline",
						onClick: toggleMic,
						"aria-label": listening ? "Stop listening" : "Speak a description",
						children: listening ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: text,
						onChange: (e) => setText(e.target.value),
						placeholder: doc ? "Make the hole 8 mm…" : "Describe a part…",
						className: "h-11 min-w-0 flex-1 rounded-sm bg-surface-subtle px-3 text-sm text-fg placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "icon",
						disabled: busy || !text.trim(),
						"aria-label": "Send",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, {})
					})
				]
			})
		]
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSub = Sub2;
var DropdownMenuRadioGroup = RadioGroup2;
function DropdownMenuContent({ className, sideOffset = 4, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		sideOffset,
		className: cn("z-50 min-w-48 overflow-hidden rounded-md bg-surface py-1 text-fg shadow-[var(--shadow-border)]", className),
		...props
	}) });
}
function DropdownMenuSubContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
		className: cn("z-50 min-w-48 overflow-hidden rounded-md bg-surface py-1 text-fg shadow-[var(--shadow-border)]", className),
		...props
	});
}
function DropdownMenuSubTrigger({ className, children, inset, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
		className: cn("flex h-9 cursor-pointer items-center gap-2 px-3 text-sm text-fg outline-none select-none", "data-[highlighted]:bg-surface-subtle data-[state=open]:bg-surface-subtle", inset && "pl-8", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto size-3.5 text-faint" })]
	});
}
function DropdownMenuItem({ className, inset, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		className: cn("relative flex h-9 cursor-pointer items-center gap-2 px-3 text-sm text-fg outline-none select-none", "data-[highlighted]:bg-surface-subtle data-[disabled]:pointer-events-none data-[disabled]:opacity-40", inset && "pl-8", className),
		...props
	});
}
function DropdownMenuCheckboxItem({ className, children, checked, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
		className: cn("relative flex h-9 cursor-pointer items-center pr-3 pl-8 text-sm text-fg outline-none select-none", "data-[highlighted]:bg-surface-subtle data-[disabled]:pointer-events-none data-[disabled]:opacity-40", className),
		checked,
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute left-2.5 flex size-4 items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) })
		}), children]
	});
}
function DropdownMenuRadioItem({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
		className: cn("relative flex h-9 cursor-pointer items-center pr-3 pl-8 text-sm text-fg outline-none select-none", "data-[highlighted]:bg-surface-subtle data-[disabled]:pointer-events-none data-[disabled]:opacity-40", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute left-2.5 flex size-4 items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) })
		}), children]
	});
}
function DropdownMenuSeparator({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
		className: cn("my-1 h-px bg-border", className),
		...props
	});
}
function MenuShortcut({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "ml-auto pl-6 font-mono text-[10px] tracking-wide text-faint",
		children
	});
}
function collectPrintTriangles(geometry) {
	const pos = geometry.getAttribute("position");
	const idx = geometry.getIndex();
	const tris = [];
	const v = (i) => {
		const x = pos.getX(i);
		const y = pos.getY(i);
		return [
			x,
			pos.getZ(i),
			y
		];
	};
	const push = (a, b, c) => {
		const A = v(a);
		const B = v(b);
		const C = v(c);
		const e1 = [
			B[0] - A[0],
			B[1] - A[1],
			B[2] - A[2]
		];
		const e2 = [
			C[0] - A[0],
			C[1] - A[1],
			C[2] - A[2]
		];
		let nx = e1[1] * e2[2] - e1[2] * e2[1];
		let ny = e1[2] * e2[0] - e1[0] * e2[2];
		let nz = e1[0] * e2[1] - e1[1] * e2[0];
		const len = Math.hypot(nx, ny, nz) || 1;
		nx /= len;
		ny /= len;
		nz /= len;
		tris.push(nx, ny, nz, ...A, ...B, ...C);
	};
	if (idx) for (let i = 0; i < idx.count; i += 3) push(idx.getX(i), idx.getX(i + 1), idx.getX(i + 2));
	else for (let i = 0; i < pos.count; i += 3) push(i, i + 1, i + 2);
	return new Float32Array(tris);
}
function geometryToStl(geometry, name) {
	const packed = collectPrintTriangles(geometry);
	const count = packed.length / 12;
	const buffer = /* @__PURE__ */ new ArrayBuffer(84 + count * 50);
	const view = new DataView(buffer);
	const header = `Graphite ${name}`.slice(0, 80);
	for (let i = 0; i < 80; i++) view.setUint8(i, header.charCodeAt(i) || 0);
	view.setUint32(80, count, true);
	let o = 84;
	for (let t = 0; t < count; t++) {
		const b = t * 12;
		for (let k = 0; k < 12; k++) {
			view.setFloat32(o, packed[b + k], true);
			o += 4;
		}
		view.setUint16(o, 0, true);
		o += 2;
	}
	return new Blob([buffer], { type: "model/stl" });
}
function fallbackGeometry(doc) {
	const geos = [];
	for (const f of doc.features) {
		if (f.hidden || f.op === "subtract") continue;
		const g = featureGeometry(f);
		g.applyMatrix4(featureMatrix(f));
		geos.push(g);
	}
	if (geos.length === 0) return new BoxGeometry(10, 10, 10);
	if (geos.length === 1) return geos[0];
	return geos[0];
}
function documentToStep(doc) {
	const mm = doc.units === "mm";
	const lines = [];
	let n = 1;
	const id = () => n++;
	const ids = {};
	const emit = (s) => {
		const i = id();
		lines.push(`#${i} = ${s};`);
		return i;
	};
	ids.app = emit("APPLICATION_CONTEXT('technical_data')");
	ids.origin = emit("CARTESIAN_POINT('origin',(0.0,0.0,0.0))");
	ids.dirZ = emit("DIRECTION('z',(0.0,0.0,1.0))");
	ids.dirX = emit("DIRECTION('x',(1.0,0.0,0.0))");
	ids.axis = emit(`AXIS2_PLACEMENT_3D('wcs',#${ids.origin},#${ids.dirZ},#${ids.dirX})`);
	for (const f of doc.features) {
		if (f.hidden) continue;
		const p = f.params;
		const x = f.position.x;
		const y = f.position.z;
		const z = f.position.y;
		const pt = emit(`CARTESIAN_POINT('${f.name}',(${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}))`);
		const place = emit(`AXIS2_PLACEMENT_3D('${f.name}_ax',#${pt},#${ids.dirZ},#${ids.dirX})`);
		if (f.kind === "box" || f.kind === "pocket") emit(`BLOCK('${f.name}',#${place},${(p.length ?? 10).toFixed(3)},${(p.width ?? 10).toFixed(3)},${(p.height ?? p.depth ?? 10).toFixed(3)})`);
		else if (f.kind === "cylinder" || f.kind === "hole") emit(`RIGHT_CIRCULAR_CYLINDER('${f.name}',#${place},${(p.height ?? p.depth ?? 10).toFixed(3)},${(p.radius ?? 5).toFixed(3)})`);
		else if (f.kind === "sphere") emit(`SPHERE('${f.name}',#${place},${(p.radius ?? 5).toFixed(3)})`);
		else emit(`BLOCK('${f.name}',#${place},${(p.length ?? 20).toFixed(3)},${(p.width ?? 20).toFixed(3)},${(p.height ?? 10).toFixed(3)})`);
	}
	const body = [
		"ISO-10303-21;",
		"HEADER;",
		"FILE_DESCRIPTION(('Graphite parametric solid'),'2;1');",
		`FILE_NAME('${doc.name.replace(/'/g, "")}.step','${(/* @__PURE__ */ new Date()).toISOString()}',('Graphite'),('Graphite'),'Graphite CAD','Graphite','');`,
		"FILE_SCHEMA(('AUTOMOTIVE_DESIGN'));",
		"ENDSEC;",
		"DATA;",
		...lines,
		"ENDSEC;",
		"END-ISO-10303-21;",
		`/* units: ${mm ? "millimetres" : "inches"} */`,
		""
	].join("\n");
	return new Blob([body], { type: "model/step" });
}
function documentToGcode(doc) {
	const m = measureDoc(doc);
	const unit = doc.units === "mm" ? "G21" : "G20";
	const safe = (m.max.y + 8).toFixed(3);
	const depth = Math.min(m.size.y || 2, 2).toFixed(3);
	const holes = doc.features.filter((f) => f.kind === "hole" && !f.hidden);
	const lines = [
		`; Graphite mill — ${doc.name}`,
		`; Stock ${m.size.x.toFixed(2)} × ${m.size.z.toFixed(2)} × ${m.size.y.toFixed(2)} ${doc.units}`,
		"G90 G94 G17",
		unit,
		"G0 Z" + safe,
		`G0 X${m.min.x.toFixed(3)} Y${m.min.z.toFixed(3)}`,
		"M3 S8000",
		`; Outer rectangle, ${depth}${doc.units} pass`,
		`G1 Z${(m.max.y - Number(depth)).toFixed(3)} F180`,
		`G1 X${m.max.x.toFixed(3)} F600`,
		`G1 Y${m.max.z.toFixed(3)}`,
		`G1 X${m.min.x.toFixed(3)}`,
		`G1 Y${m.min.z.toFixed(3)}`,
		"G0 Z" + safe
	];
	for (const h of holes) {
		const r = h.params.radius ?? 2.5;
		lines.push(`; Drill ${h.name} Ø${(r * 2).toFixed(2)}`, `G0 X${h.position.x.toFixed(3)} Y${h.position.z.toFixed(3)}`, `G81 Z${(h.position.y - (h.params.depth ?? 5)).toFixed(3)} R${safe} F120`, "G80");
	}
	lines.push("G0 Z" + safe, "M5", "M30", "");
	return new Blob([lines.join("\n")], { type: "text/plain" });
}
function printVerts(geometry) {
	const pos = geometry.getAttribute("position");
	const idx = geometry.getIndex();
	const map = /* @__PURE__ */ new Map();
	const verts = [];
	const tris = [];
	let minZ = Infinity;
	const weld = (i) => {
		const x = pos.getX(i);
		const y = pos.getZ(i);
		const z = pos.getY(i);
		if (z < minZ) minZ = z;
		const k = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
		const existing = map.get(k);
		if (existing !== void 0) return existing;
		const n = map.size;
		map.set(k, n);
		verts.push(x, y, z);
		return n;
	};
	const push = (a, b, c) => {
		tris.push(weld(a), weld(b), weld(c));
	};
	if (idx) for (let i = 0; i < idx.count; i += 3) push(idx.getX(i), idx.getX(i + 1), idx.getX(i + 2));
	else for (let i = 0; i < pos.count; i += 3) push(i, i + 1, i + 2);
	if (Number.isFinite(minZ) && Math.abs(minZ) > 1e-6) for (let i = 2; i < verts.length; i += 3) verts[i] -= minZ;
	return {
		verts,
		tris
	};
}
async function geometryTo3mf(geometry, name) {
	const { verts, tris } = printVerts(geometry);
	const safe = name.replace(/[<>&'"]/g, "");
	const vxml = [];
	for (let i = 0; i < verts.length; i += 3) vxml.push(`        <vertex x="${verts[i].toFixed(4)}" y="${verts[i + 1].toFixed(4)}" z="${verts[i + 2].toFixed(4)}" />`);
	const txml = [];
	for (let i = 0; i < tris.length; i += 3) txml.push(`        <triangle v1="${tris[i]}" v2="${tris[i + 1]}" v3="${tris[i + 2]}" />`);
	const model = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">`,
		`  <metadata name="Title">${safe}</metadata>`,
		`  <metadata name="Application">Graphite Universal Slicer</metadata>`,
		`  <resources>`,
		`    <object id="1" name="${safe}" type="model">`,
		`      <mesh>`,
		`        <vertices>`,
		...vxml,
		`        </vertices>`,
		`        <triangles>`,
		...txml,
		`        </triangles>`,
		`      </mesh>`,
		`    </object>`,
		`  </resources>`,
		`  <build>`,
		`    <item objectid="1" />`,
		`  </build>`,
		`</model>`,
		``
	].join("\n");
	const types = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`,
		`  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>`,
		`  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>`,
		`</Types>`,
		``
	].join("\n");
	const rels = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`,
		`  <Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>`,
		`</Relationships>`,
		``
	].join("\n");
	const zip = await zipBlobs([
		{
			name: "[Content_Types].xml",
			blob: new Blob([types], { type: "application/xml" })
		},
		{
			name: "_rels/.rels",
			blob: new Blob([rels], { type: "application/xml" })
		},
		{
			name: "3D/3dmodel.model",
			blob: new Blob([model], { type: "application/vnd.ms-package.3dmanufacturing-3dmodel+xml" })
		}
	]);
	return new Blob([zip], { type: "model/3mf" });
}
function slicerReadme(partName) {
	const body = [
		`Graphite Universal Slicer`,
		`Part: ${partName}`,
		``,
		`Works on macOS, Windows, and Linux. No .dmg or .exe.`,
		``,
		`PRINT NOW`,
		`  Copy the .gcode file to an SD card, USB stick, OctoPrint, Fluidd, or Mainsail.`,
		`  Firmware flavours: Marlin, Klipper, RepRap. Same file on Mac or PC.`,
		``,
		`OPEN IN A DESKTOP SLICER`,
		`  The .3mf opens in:`,
		`  • UltiMaker Cura (macOS & Windows)`,
		`  • PrusaSlicer / SuperSlicer (macOS & Windows)`,
		`  • Bambu Studio / OrcaSlicer (macOS & Windows)`,
		`  • IdeaMaker`,
		`  Use this if you want to tweak supports or a machine profile.`,
		``,
		`MESH`,
		`  The .stl is a raw solid for any CAD tool or slicer.`,
		``
	].join("\n");
	return new Blob([body], { type: "text/plain" });
}
var EXPORT_ITEMS = [
	["slice", "Slice — FDM G-code"],
	["3mf", "3MF — Cura / Prusa / Bambu"],
	["stl", "STL — mesh"],
	["mill", "G-code — mill"],
	["step", "STEP — CAD"],
	["pack", "CAD pack (zip)"]
];
async function meshOf(target) {
	const geo = (await buildSolid(target.features))?.geometry ?? fallbackGeometry(target);
	if (target.units === "in") geo.scale(25.4, 25.4, 25.4);
	return geo;
}
async function filesFor(target, kinds) {
	const slug = slugify(target.name);
	const out = [];
	for (const kind of kinds) if (kind === "stl") {
		const geo = await meshOf(target);
		out.push({
			name: `${slug}.stl`,
			blob: geometryToStl(geo, target.name)
		});
	} else if (kind === "step") out.push({
		name: `${slug}.step`,
		blob: documentToStep(target)
	});
	else if (kind === "3mf") {
		const geo = await meshOf(target);
		out.push({
			name: `${slug}.3mf`,
			blob: await geometryTo3mf(geo, target.name)
		});
	} else out.push({
		name: `${slug}.nc`,
		blob: documentToGcode(target)
	});
	return out;
}
async function runExport(kind) {
	const { doc, parts, setSlicerOpen } = useApp.getState();
	if (kind === "slice") {
		setSlicerOpen(true);
		return;
	}
	if (!doc) return;
	if (kind === "kit") {
		const files = [];
		for (const p of parts) {
			const pack = await filesFor(p, ["stl", "3mf"]);
			files.push(...pack);
		}
		downloadBlob("graphite-kit.zip", await zipBlobs(files));
		return;
	}
	if (kind === "pack") {
		const files = await filesFor(doc, [
			"stl",
			"3mf",
			"step"
		]);
		downloadBlob(`${slugify(doc.name)}-cad-pack.zip`, await zipBlobs(files));
		return;
	}
	const [file] = await filesFor(doc, [kind]);
	if (file) downloadBlob(file.name, file.blob);
}
function sliceSourceKey(docs, settings) {
	return JSON.stringify({
		kit: settings.kit,
		units: docs.map((d) => d.units),
		ids: docs.map((d) => d.id),
		s: settings,
		f: docs.map((d) => d.features.map((x) => [
			x.id,
			x.kind,
			x.op,
			x.hidden,
			x.params,
			x.position,
			x.rotation,
			x.axis
		]))
	});
}
function collectPrintTris(geo, ox, oy, oz, scale) {
	const pos = geo.getAttribute("position");
	const idx = geo.getIndex();
	const out = [];
	const push = (i) => {
		const x = (pos.getX(i) + ox) * scale;
		const y = (pos.getY(i) + oy) * scale;
		const z = (pos.getZ(i) + oz) * scale;
		out.push(x, z, y);
	};
	if (idx) for (let i = 0; i < idx.count; i++) push(idx.getX(i));
	else for (let i = 0; i < pos.count; i++) push(i);
	return out;
}
function bbox(tris) {
	let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
	for (let i = 0; i < tris.length; i += 3) {
		const x = tris[i];
		const y = tris[i + 1];
		const z = tris[i + 2];
		if (x < minX) minX = x;
		if (y < minY) minY = y;
		if (z < minZ) minZ = z;
		if (x > maxX) maxX = x;
		if (y > maxY) maxY = y;
		if (z > maxZ) maxZ = z;
	}
	return {
		minX,
		minY,
		minZ,
		maxX,
		maxY,
		maxZ
	};
}
function dropToBed(tris, minZ) {
	if (Math.abs(minZ) < 1e-6) return;
	for (let i = 2; i < tris.length; i += 3) tris[i] -= minZ;
}
function intersectTri(tris, i, z, eps) {
	const ax = tris[i], ay = tris[i + 1], az = tris[i + 2];
	const bx = tris[i + 3], by = tris[i + 4], bz = tris[i + 5];
	const cx = tris[i + 6], cy = tris[i + 7], cz = tris[i + 8];
	if (az > z + eps && bz > z + eps && cz > z + eps || az < z - eps && bz < z - eps && cz < z - eps) return null;
	if (Math.abs(az - z) < eps && Math.abs(bz - z) < eps && Math.abs(cz - z) < eps) return null;
	const pts = [];
	const edge = (x0, y0, z0, x1, y1, z1) => {
		const d0 = z0 - z;
		const d1 = z1 - z;
		if (Math.abs(d0) < eps && Math.abs(d1) < eps) return;
		if (Math.abs(d0) < eps) {
			pts.push(x0, y0);
			return;
		}
		if (d0 * d1 < 0) {
			const t = d0 / (d0 - d1);
			pts.push(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t);
		}
	};
	edge(ax, ay, az, bx, by, bz);
	edge(bx, by, bz, cx, cy, cz);
	edge(cx, cy, cz, ax, ay, az);
	if (pts.length < 4) return null;
	if (pts.length > 4) return [
		pts[0],
		pts[1],
		pts[2],
		pts[3]
	];
	const dx = pts[2] - pts[0];
	const dy = pts[3] - pts[1];
	if (dx * dx + dy * dy < 1e-10) return null;
	return [
		pts[0],
		pts[1],
		pts[2],
		pts[3]
	];
}
function qkey(x, y, step = .03) {
	return `${Math.round(x / step)}:${Math.round(y / step)}`;
}
function stitch(segs) {
	const n = segs.length / 4;
	if (n === 0) return [];
	const adj = /* @__PURE__ */ new Map();
	const add = (k, i) => {
		const a = adj.get(k);
		if (a) a.push(i);
		else adj.set(k, [i]);
	};
	for (let i = 0; i < n; i++) {
		add(qkey(segs[i * 4], segs[i * 4 + 1]), i);
		add(qkey(segs[i * 4 + 2], segs[i * 4 + 3]), i);
	}
	const used = new Uint8Array(n);
	const loops = [];
	for (let i = 0; i < n; i++) {
		if (used[i]) continue;
		used[i] = 1;
		const pts = [{
			x: segs[i * 4],
			y: segs[i * 4 + 1]
		}, {
			x: segs[i * 4 + 2],
			y: segs[i * 4 + 3]
		}];
		let hx = segs[i * 4 + 2];
		let hy = segs[i * 4 + 3];
		let guard = 0;
		while (guard++ < n + 2) {
			const cands = adj.get(qkey(hx, hy));
			if (!cands) break;
			let next = -1;
			let nx = 0;
			let ny = 0;
			for (const ci of cands) {
				if (used[ci]) continue;
				used[ci] = 1;
				next = ci;
				const ax = segs[ci * 4], ay = segs[ci * 4 + 1], bx = segs[ci * 4 + 2], by = segs[ci * 4 + 3];
				if (qkey(ax, ay) === qkey(hx, hy)) {
					nx = bx;
					ny = by;
				} else {
					nx = ax;
					ny = ay;
				}
				break;
			}
			if (next < 0) break;
			hx = nx;
			hy = ny;
			pts.push({
				x: nx,
				y: ny
			});
			if (qkey(hx, hy) === qkey(pts[0].x, pts[0].y)) break;
		}
		const cleaned = dedupe(pts);
		if (cleaned.length >= 3) loops.push(cleaned);
	}
	return loops;
}
function dedupe(pts) {
	const out = [];
	const minD = .04;
	for (const p of pts) {
		const last = out[out.length - 1];
		if (!last || (p.x - last.x) ** 2 + (p.y - last.y) ** 2 > minD * minD) out.push(p);
	}
	if (out.length > 2) {
		const a = out[0];
		const b = out[out.length - 1];
		if ((a.x - b.x) ** 2 + (a.y - b.y) ** 2 < minD * minD) out.pop();
	}
	return out;
}
function area(pts) {
	let a = 0;
	for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) a += pts[j].x * pts[i].y - pts[i].x * pts[j].y;
	return a / 2;
}
function reverse(pts) {
	const c = pts.slice();
	c.reverse();
	return c;
}
function pointInPoly(pt, poly) {
	let inside = false;
	for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
		const ai = poly[i];
		const bj = poly[j];
		if (ai.y > pt.y !== bj.y > pt.y) {
			const x = (bj.x - ai.x) * (pt.y - ai.y) / (bj.y - ai.y || 1e-12) + ai.x;
			if (pt.x < x) inside = !inside;
		}
	}
	return inside;
}
function forceWinding(loops) {
	return loops.map((loop, i) => {
		const p = loop[0];
		let depth = 0;
		for (let j = 0; j < loops.length; j++) {
			if (i === j) continue;
			if (pointInPoly(p, loops[j])) depth++;
		}
		const a = area(loop);
		const wantCCW = depth % 2 === 0;
		if (wantCCW && a < 0) return reverse(loop);
		if (!wantCCW && a > 0) return reverse(loop);
		return loop;
	});
}
function offsetLoop(pts, dist) {
	const n = pts.length;
	if (n < 3) return null;
	const out = [];
	for (let i = 0; i < n; i++) {
		const p0 = pts[(i - 1 + n) % n];
		const p1 = pts[i];
		const p2 = pts[(i + 1) % n];
		let e1x = p1.x - p0.x, e1y = p1.y - p0.y;
		let e2x = p2.x - p1.x, e2y = p2.y - p1.y;
		const l1 = Math.hypot(e1x, e1y) || 1;
		const l2 = Math.hypot(e2x, e2y) || 1;
		e1x /= l1;
		e1y /= l1;
		e2x /= l2;
		e2y /= l2;
		const n1x = -e1y, n1y = e1x;
		const n2x = -e2y, n2y = e2x;
		let nx = n1x + n2x, ny = n1y + n2y;
		const nl = Math.hypot(nx, ny);
		if (nl < 1e-6) {
			out.push({
				x: p1.x + n1x * dist,
				y: p1.y + n1y * dist
			});
			continue;
		}
		nx /= nl;
		ny /= nl;
		const d = nx * n1x + ny * n1y;
		let miter = dist / Math.max(.25, d);
		if (Math.abs(miter) > Math.abs(dist) * 4) miter = dist * 4 * Math.sign(miter || 1);
		out.push({
			x: p1.x + nx * miter,
			y: p1.y + ny * miter
		});
	}
	const a0 = area(pts);
	const a1 = area(out);
	if (a0 === 0 || a1 === 0) return null;
	if (Math.sign(a0) !== Math.sign(a1)) return null;
	if (Math.abs(a1) < .2) return null;
	return out;
}
function clipLines(y, x0, x1, loops) {
	const xs = [];
	for (const loop of loops) for (let i = 0, j = loop.length - 1; i < loop.length; j = i++) {
		const a = loop[j];
		const b = loop[i];
		if (a.y > y === b.y > y) continue;
		const t = (y - a.y) / (b.y - a.y || 1e-12);
		xs.push(a.x + (b.x - a.x) * t);
	}
	xs.sort((p, q) => p - q);
	const uniq = [];
	for (const x of xs) if (!uniq.length || Math.abs(x - uniq[uniq.length - 1]) > .03) uniq.push(x);
	const segs = [];
	for (let i = 0; i + 1 < uniq.length; i += 2) {
		const a = Math.max(x0, uniq[i]);
		const b = Math.min(x1, uniq[i + 1]);
		if (b - a > .2) segs.push([{
			x: a,
			y
		}, {
			x: b,
			y
		}]);
	}
	return segs;
}
function clipLinesV(x, y0, y1, loops) {
	const ys = [];
	for (const loop of loops) for (let i = 0, j = loop.length - 1; i < loop.length; j = i++) {
		const a = loop[j];
		const b = loop[i];
		if (a.x > x === b.x > x) continue;
		const t = (x - a.x) / (b.x - a.x || 1e-12);
		ys.push(a.y + (b.y - a.y) * t);
	}
	ys.sort((p, q) => p - q);
	const uniq = [];
	for (const y of ys) if (!uniq.length || Math.abs(y - uniq[uniq.length - 1]) > .03) uniq.push(y);
	const segs = [];
	for (let i = 0; i + 1 < uniq.length; i += 2) {
		const a = Math.max(y0, uniq[i]);
		const b = Math.min(y1, uniq[i + 1]);
		if (b - a > .2) segs.push([{
			x,
			y: a
		}, {
			x,
			y: b
		}]);
	}
	return segs;
}
function infillFor(loops, bounds, spacing, vertical) {
	if (spacing < .3) spacing = .3;
	const pad = .2;
	const out = [];
	if (vertical) {
		const x0 = bounds.minX + pad;
		const x1 = bounds.maxX - pad;
		for (let x = x0; x <= x1 + 1e-6; x += spacing) out.push(...clipLinesV(x, bounds.minY, bounds.maxY, loops));
	} else {
		const y0 = bounds.minY + pad;
		const y1 = bounds.maxY - pad;
		for (let y = y0; y <= y1 + 1e-6; y += spacing) out.push(...clipLines(y, bounds.minX, bounds.maxX, loops));
	}
	return out;
}
function loopBounds(loops) {
	let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
	for (const loop of loops) for (const p of loop) {
		if (p.x < minX) minX = p.x;
		if (p.y < minY) minY = p.y;
		if (p.x > maxX) maxX = p.x;
		if (p.y > maxY) maxY = p.y;
	}
	return {
		minX,
		minY,
		maxX,
		maxY
	};
}
function rectLoop(b, pad) {
	return [
		{
			x: b.minX - pad,
			y: b.minY - pad
		},
		{
			x: b.maxX + pad,
			y: b.minY - pad
		},
		{
			x: b.maxX + pad,
			y: b.maxY + pad
		},
		{
			x: b.minX - pad,
			y: b.maxY + pad
		}
	];
}
async function meshTris(docs, kit, scale) {
	const targets = kit && docs.length > 1 ? docs : docs.slice(0, 1);
	const layouts = layoutParts(targets);
	const tris = [];
	for (const doc of targets) {
		const built = await buildSolid(doc.features);
		if (!built) continue;
		const off = layouts.find((l) => l.id === doc.id)?.offset ?? {
			x: 0,
			y: 0,
			z: 0
		};
		tris.push(...collectPrintTris(built.geometry, off.x, off.y, off.z, scale));
	}
	return tris;
}
function sliceLayer(tris, z, walls, lineW, infillPct, solid, brim, first, layerBounds) {
	const segs = [];
	for (let i = 0; i < tris.length; i += 9) {
		const hit = intersectTri(tris, i, z, 1e-4);
		if (hit) segs.push(...hit);
	}
	const loops = forceWinding(stitch(segs).filter((l) => Math.abs(area(l)) > .15));
	const perimeters = [];
	for (const loop of loops) for (let w = 0; w < walls; w++) {
		const off = offsetLoop(loop, lineW * .5 + w * lineW);
		if (off) perimeters.push(off);
	}
	const inner = loops.map((loop) => offsetLoop(loop, lineW * walls)).filter((x) => !!x);
	const clip = inner.length ? inner : loops;
	const b = clip.length ? loopBounds(clip) : layerBounds;
	const spacing = solid ? lineW * .95 : infillPct <= 0 ? 1e6 : lineW / (infillPct / 100);
	const vertical = Math.round(z / .2) % 2 === 1;
	const infill = spacing < 200 ? infillFor(clip, b, spacing, vertical) : [];
	const skirt = [];
	if (first) {
		const bb = loops.length ? loopBounds(loops) : layerBounds;
		skirt.push(rectLoop(bb, 4));
		if (brim) for (let k = 1; k <= 6; k++) for (const loop of loops) {
			if (area(loop) <= 0) continue;
			const off = offsetLoop(loop, -lineW * k);
			if (off) skirt.push(off);
		}
	}
	return {
		z,
		perimeters,
		infill,
		skirt
	};
}
function extrusion(len, lh, lw, filament) {
	return len * lh * lw / (Math.PI * (filament * .5) ** 2);
}
function emitGcode(layers, settings, bounds) {
	const printer = printerById(settings.printerId);
	const mat = materialById(settings.material);
	const lh = settings.layerHeight;
	const lw = printer.nozzle * 1.05;
	const cx = (bounds.minX + bounds.maxX) / 2;
	const cy = (bounds.minY + bounds.maxY) / 2;
	const ox = printer.bedX / 2 - cx;
	const oy = printer.bedY / 2 - cy;
	const tx = (p) => p.x + ox;
	const ty = (p) => p.y + oy;
	const sizeX = bounds.maxX - bounds.minX;
	const sizeY = bounds.maxY - bounds.minY;
	const fitsBed = sizeX <= printer.bedX - 8 && sizeY <= printer.bedY - 8 && bounds.maxZ <= printer.bedZ;
	const travelF = 9e3;
	const printF = mat.speed * 60;
	const firstF = Math.min(printF, 1500);
	const wallF = printF * .75;
	const infillF = printF * 1.05;
	const retract = mat.retract;
	const fan = mat.fan;
	const lines = [
		...startGcode(printer, mat, mat.hotend, mat.bed),
		`;LAYER_COUNT:${layers.length}`,
		`; layer height ${lh}`,
		`; line width ${lw.toFixed(3)}`,
		`; infill ${settings.infill}%  walls ${settings.walls}`,
		`; bed origin offset X${ox.toFixed(3)} Y${oy.toFixed(3)}`
	];
	let eAbs = 0;
	let px = 0;
	let py = 0;
	let pz = 0;
	let pathMm = 0;
	let travelMm = 0;
	let filamentMm = 0;
	let retracted = true;
	const moveTo = (x, y, z, print, feed, layerH) => {
		const dx = x - px;
		const dy = y - py;
		const dist = Math.hypot(dx, dy);
		if (print) {
			if (retracted) {
				lines.push(`G1 E${retract.toFixed(4)} F2100`);
				eAbs += retract;
				retracted = false;
			}
			const e = extrusion(dist, layerH, lw, printer.filament);
			eAbs += e;
			filamentMm += e;
			pathMm += dist;
			lines.push(`G1 X${x.toFixed(3)} Y${y.toFixed(3)} E${e.toFixed(5)} F${feed.toFixed(0)}`);
		} else {
			if (dist > 1.6 && !retracted) {
				lines.push(`G1 E${(-retract).toFixed(4)} F2100`);
				eAbs -= retract;
				retracted = true;
			}
			travelMm += dist;
			if (Math.abs(z - pz) > 1e-4) {
				lines.push(`G0 Z${z.toFixed(3)} F1200`);
				pz = z;
			}
			if (dist > .02) lines.push(`G0 X${x.toFixed(3)} Y${y.toFixed(3)} F${travelF}`);
		}
		px = x;
		py = y;
	};
	const trace = (path, closed, feed, layerH) => {
		if (path.length < 2) return;
		moveTo(tx(path[0]), ty(path[0]), pz, false, travelF, layerH);
		for (let i = 1; i < path.length; i++) moveTo(tx(path[i]), ty(path[i]), pz, true, feed, layerH);
		if (closed) moveTo(tx(path[0]), ty(path[0]), pz, true, feed, layerH);
	};
	for (let li = 0; li < layers.length; li++) {
		const L = layers[li];
		const first = li === 0;
		const feedWall = first ? firstF : wallF;
		const feedInfill = first ? firstF : infillF;
		const layerH = first ? lh * 1.08 : lh;
		lines.push(`;LAYER:${li}`);
		if (li === 3 && fan > 0) lines.push(`M106 S${fan}`);
		if (Math.abs(L.z - pz) > 1e-4) {
			lines.push(`G0 Z${L.z.toFixed(3)} F1200`);
			pz = L.z;
		}
		for (const s of L.skirt) trace(s, true, firstF, layerH);
		for (const p of L.perimeters) trace(p, true, feedWall, layerH);
		for (const p of L.infill) trace(p, false, feedInfill, layerH);
		if (eAbs > 80) {
			lines.push("G92 E0");
			eAbs = 0;
		}
	}
	lines.push(...endGcode(printer));
	const timeSec = 90 + pathMm / Math.max(mat.speed, 1) + travelMm / 150 + layers.length * .35;
	const filamentGrams = filamentMm * Math.PI * (printer.filament * .5) ** 2 / 1e3 * mat.density;
	return {
		gcode: [
			...[
				`;TIME:${Math.round(timeSec)}`,
				`;Filament used:${(filamentMm / 1e3).toFixed(3)}m`,
				`;Filament weight:${filamentGrams.toFixed(2)}g`,
				`;MINX:${(bounds.minX + ox).toFixed(3)}`,
				`;MINY:${(bounds.minY + oy).toFixed(3)}`,
				`;MINZ:0`,
				`;MAXX:${(bounds.maxX + ox).toFixed(3)}`,
				`;MAXY:${(bounds.maxY + oy).toFixed(3)}`,
				`;MAXZ:${bounds.maxZ.toFixed(3)}`
			],
			...lines,
			""
		].join("\n"),
		stats: {
			layers: layers.length,
			pathMm,
			travelMm,
			filamentMm,
			filamentGrams,
			timeSec,
			fitsBed,
			sizeX,
			sizeY,
			sizeZ: bounds.maxZ,
			originX: ox,
			originY: oy
		}
	};
}
var yieldNow = () => new Promise((r) => setTimeout(r, 0));
async function sliceDocuments(docs, settings = DEFAULT_SLICER, onProgress) {
	const printer = printerById(settings.printerId);
	const targets = settings.kit && docs.length > 1 ? docs : docs.slice(0, 1);
	if (!targets.length) throw new Error("Nothing to slice.");
	const scale = targets[0].units === "in" ? 25.4 : 1;
	onProgress?.(.05);
	const tris = await meshTris(docs, settings.kit, scale);
	if (tris.length < 9) throw new Error("The solid has no printable mesh.");
	dropToBed(tris, bbox(tris).minZ);
	const bb = bbox(tris);
	const lh = settings.layerHeight;
	const height = bb.maxZ - 0;
	const count = Math.max(1, Math.round(height / lh));
	const lineW = printer.nozzle * 1.05;
	const shells = Math.max(1, Math.min(6, Math.round(.8 / lh)));
	const layerBounds = {
		minX: bb.minX,
		minY: bb.minY,
		maxX: bb.maxX,
		maxY: bb.maxY
	};
	const layers = [];
	onProgress?.(.12);
	for (let i = 0; i < count; i++) {
		const z = Math.min(bb.maxZ - lh * .35, (i + 1) * lh);
		const solid = i < shells || i >= count - shells;
		layers.push(sliceLayer(tris, z, settings.walls, lineW, settings.infill, solid, settings.brim, i === 0, layerBounds));
		if (i % 5 === 0) {
			onProgress?.(.12 + .78 * i / count);
			await yieldNow();
		}
	}
	if (!layers.some((l) => l.perimeters.length)) throw new Error("Could not find printable outlines. Try a thicker part or a coarser layer height.");
	onProgress?.(.93);
	const { gcode, stats } = emitGcode(layers, settings, {
		minX: bb.minX,
		minY: bb.minY,
		maxX: bb.maxX,
		maxY: bb.maxY,
		maxZ: bb.maxZ
	});
	onProgress?.(1);
	return {
		layers,
		settings: { ...settings },
		printerId: settings.printerId,
		sourceKey: sliceSourceKey(docs, settings),
		stats,
		gcode
	};
}
function formatDuration(sec) {
	const s = Math.max(0, Math.round(sec));
	const h = Math.floor(s / 3600);
	const m = Math.floor(s % 3600 / 60);
	if (h > 0) return `${h}h ${m}m`;
	return `${m} min`;
}
async function runSlice() {
	const app = useApp.getState();
	const { doc, parts, slicerSettings } = app;
	const docs = slicerSettings.kit && parts.length > 1 ? parts : doc ? [doc] : [];
	if (!docs.length) {
		toast.error("Confirm a part first.");
		return;
	}
	app.setSlicerOpen(true);
	app.setInspectorOpen(true);
	app.setReportOpen(true);
	app.setReportTab("output");
	app.setSlicerProgress(0);
	try {
		const sliced = await sliceDocuments(docs, slicerSettings, app.setSlicerProgress);
		app.setSliceResult(sliced);
	} catch (err) {
		toast.error(err instanceof Error ? err.message : "Slice failed.");
		app.setSlicerProgress(-1);
	}
}
function CommandPalette() {
	const open = useApp((s) => s.commandOpen);
	const setOpen = useApp((s) => s.setCommandOpen);
	const parts = useApp((s) => s.parts);
	const doc = useApp((s) => s.doc);
	const setActive = useApp((s) => s.setActive);
	const select = useApp((s) => s.select);
	const setNavOpen = useApp((s) => s.setNavOpen);
	const setInspectorOpen = useApp((s) => s.setInspectorOpen);
	const setReportOpen = useApp((s) => s.setReportOpen);
	const setNavTab = useApp((s) => s.setNavTab);
	const toggleActivity = useApp((s) => s.toggleActivity);
	const reset = useApp((s) => s.reset);
	const samples = listTemplates();
	function go(fn) {
		setOpen(false);
		fn();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Dialog, {
		open,
		onOpenChange: setOpen,
		label: "Command Palette",
		overlayClassName: "command-overlay",
		contentClassName: "command-dialog",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, { placeholder: "Type a command or search…" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.List, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, { children: "No matching commands" }),
			parts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
				heading: "Parts",
				children: parts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
					value: `part ${p.name}`,
					onSelect: () => go(() => setActive(p.id)),
					children: p.name
				}, p.id))
			}) : null,
			doc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
				heading: "Features",
				children: doc.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
					value: `feature ${f.name} ${f.kind}`,
					onSelect: () => go(() => {
						select(f.id);
						setNavTab("project");
					}),
					children: [f.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-auto font-mono text-[10px] uppercase tracking-wide text-faint",
						children: f.kind
					})]
				}, f.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Group, {
				heading: "Samples",
				children: [samples.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
					value: `sample ${s.title} ${s.blurb}`,
					onSelect: () => go(() => void ingestTemplate(s.id)),
					children: s.title
				}, s.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
					value: "kit bracket bushing",
					onSelect: () => go(() => void ingestKit(["bracket", "bushing"])),
					children: "L-bracket + bushing"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Group, {
				heading: "View",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
						value: "view explorer sidebar",
						onSelect: () => go(() => toggleActivity("project")),
						children: "View: Explorer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
						value: "view search",
						onSelect: () => go(() => toggleActivity("search")),
						children: "View: Search"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
						value: "view problems issues",
						onSelect: () => go(() => toggleActivity("issues")),
						children: "View: Problems"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
						value: "view capture",
						onSelect: () => go(() => toggleActivity("capture")),
						children: "View: Capture"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
						value: "view run slice",
						onSelect: () => go(() => toggleActivity("run")),
						children: "View: Run and Slice"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
						value: "toggle primary side bar",
						onSelect: () => go(() => setNavOpen(!useApp.getState().navOpen)),
						children: "View: Toggle Primary Side Bar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
						value: "toggle secondary side bar inspector",
						onSelect: () => go(() => setInspectorOpen(!useApp.getState().inspectorOpen)),
						children: "View: Toggle Secondary Side Bar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
						value: "toggle panel report",
						onSelect: () => go(() => setReportOpen(!useApp.getState().reportOpen)),
						children: "View: Toggle Panel"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Group, {
				heading: "Actions",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
						value: "open sketch",
						onSelect: () => go(() => openSketchFile()),
						children: "Open Sketch…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
						disabled: !doc,
						value: "slice run product",
						onSelect: () => go(() => void runSlice()),
						children: "Start Slicing"
					}),
					EXPORT_ITEMS.filter(([k]) => k !== "slice").map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
						disabled: !doc,
						value: `export ${label}`,
						onSelect: () => go(() => void runExport(k)),
						children: ["Export ", label]
					}, k)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
						value: "new session reset welcome",
						onSelect: () => go(() => reset()),
						children: "New Session"
					})
				]
			})
		] })]
	});
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex w-full touch-none items-center select-none", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1 w-full grow overflow-hidden rounded-full bg-surface-subtle",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-accent" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-fg shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" })]
	});
}
var ADDABLE = [
	{
		kind: "box",
		label: "Box"
	},
	{
		kind: "cylinder",
		label: "Cyl"
	},
	{
		kind: "hole",
		label: "Hole"
	},
	{
		kind: "slot",
		label: "Slot"
	},
	{
		kind: "pocket",
		label: "Pocket"
	},
	{
		kind: "wedge",
		label: "Wedge"
	}
];
function FeaturePanel() {
	const doc = useApp((s) => s.doc);
	const parts = useApp((s) => s.parts);
	const activeId = useApp((s) => s.activeId);
	const setActive = useApp((s) => s.setActive);
	const removePart = useApp((s) => s.removePart);
	const selectedId = useApp((s) => s.selectedId);
	const select = useApp((s) => s.select);
	const updateParam = useApp((s) => s.updateParam);
	const addFeature = useApp((s) => s.addFeature);
	const removeFeature = useApp((s) => s.removeFeature);
	const toggleHidden = useApp((s) => s.toggleHidden);
	const [adding, setAdding] = (0, import_react.useState)(false);
	const unit = doc?.units ?? "mm";
	const selected = doc?.features.find((f) => f.id === selectedId);
	const meta = selected ? PARAM_META[selected.kind] : [];
	if (!doc) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col gap-3 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-[0.16em] text-faint",
			children: "Feature tree"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "A model will land here after the router classifies an input. Open a sample from the Explorer or Capture view."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 pt-4 pb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-faint",
						children: "Parts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 flex flex-col gap-1",
						children: parts.map((p) => {
							const active = p.id === activeId;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setActive(p.id),
									className: cn("flex h-10 min-w-0 flex-1 items-center rounded-none px-2 text-left text-sm md:h-8", active ? "bg-surface-subtle text-fg" : "text-muted hover:bg-surface-subtle/70 hover:text-fg"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: p.name
									})
								}), parts.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "icon-sm",
									variant: "ghost",
									"aria-label": `Remove ${p.name}`,
									onClick: () => removePart(p.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
								}) : null]
							}, p.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						variant: "outline",
						className: "mt-2 w-full",
						onClick: () => setAdding((v) => !v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), adding ? "Hide sketches" : "Add part"]
					}),
					adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 max-h-48 overflow-y-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleGrid, { compact: true })
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-4 pt-2 pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.16em] text-faint",
					children: "Feature tree"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-fg",
					children: doc.name
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] tabular-nums text-muted",
					children: doc.features.length
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1 px-4 pb-3",
				children: ADDABLE.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					variant: "outline",
					onClick: () => addFeature(a.kind),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), a.label]
				}, a.kind))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "min-h-0 flex-1 overflow-y-auto px-2 pb-2",
				children: doc.features.map((f) => {
					const Icon = f.op === "subtract" ? Minus : f.kind === "cylinder" ? Cylinder : Box;
					const active = f.id === selectedId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => select(f.id),
						className: cn("flex h-11 w-full items-center gap-2 rounded-none px-2 text-left text-sm md:h-8", active ? "bg-surface-subtle text-fg" : "text-muted hover:bg-surface-subtle/70 hover:text-fg", f.hidden && "opacity-40"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5 shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 flex-1 truncate",
								children: f.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] uppercase tracking-[0.12em] text-faint",
								children: f.kind
							})
						]
					}) }, f.id);
				})
			}),
			selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: selected.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "icon-sm",
							variant: "ghost",
							onClick: () => toggleHidden(selected.id),
							"aria-label": selected.hidden ? "Show feature" : "Hide feature",
							children: selected.hidden ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "icon-sm",
							variant: "ghost",
							onClick: () => removeFeature(selected.id),
							"aria-label": "Delete feature",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-4",
					children: meta.map((p) => {
						const value = selected.params[p.key] ?? 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mb-2 flex items-center justify-between text-xs text-muted",
								children: [p.label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono tabular-nums text-fg",
									children: [
										value.toFixed(value < 10 ? 2 : 1),
										" ",
										unit
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								min: p.min,
								max: p.max,
								step: p.step,
								value: [value],
								onValueChange: ([v]) => updateParam(selected.id, p.key, v ?? value)
							})]
						}, p.key);
					})
				})]
			}) : null
		]
	});
}
function collectIssues(parts) {
	return parts.flatMap((p) => p.questions.filter((q) => !q.answered).map((question) => ({
		partId: p.id,
		partName: p.name,
		question
	})));
}
function isMacClient() {
	if (typeof navigator === "undefined") return false;
	return /Mac|iPhone|iPad/.test(navigator.userAgent);
}
function useMac() {
	const [mac, setMac] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMac(isMacClient());
	}, []);
	return mac;
}
function MenuBtn({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, {
		modal: false,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
			className: "flex h-7 items-center rounded-none px-2 text-[13px] text-muted hover:bg-surface-subtle hover:text-fg data-[state=open]:bg-surface-subtle data-[state=open]:text-fg",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
			align: "start",
			className: "min-w-56 rounded-sm",
			children
		})]
	});
}
function TitleBar() {
	const doc = useApp((s) => s.doc);
	const parts = useApp((s) => s.parts);
	const units = doc?.units ?? "mm";
	const setUnits = useApp((s) => s.setUnits);
	const selectedId = useApp((s) => s.selectedId);
	const removeFeature = useApp((s) => s.removeFeature);
	const removePart = useApp((s) => s.removePart);
	const reset = useApp((s) => s.reset);
	const navOpen = useApp((s) => s.navOpen);
	const inspectorOpen = useApp((s) => s.inspectorOpen);
	const reportOpen = useApp((s) => s.reportOpen);
	const slicerOpen = useApp((s) => s.slicerOpen);
	const setNavOpen = useApp((s) => s.setNavOpen);
	const setInspectorOpen = useApp((s) => s.setInspectorOpen);
	const setReportOpen = useApp((s) => s.setReportOpen);
	const setSlicerOpen = useApp((s) => s.setSlicerOpen);
	const setCommandOpen = useApp((s) => s.setCommandOpen);
	const toggleActivity = useApp((s) => s.toggleActivity);
	const setReportTab = useApp((s) => s.setReportTab);
	const settings = useApp((s) => s.slicerSettings);
	const patchSlicer = useApp((s) => s.patchSlicer);
	const progress = useApp((s) => s.slicerProgress);
	const slicing = progress >= 0 && progress < 1;
	const mac = useMac();
	const mod = mac ? "⌘" : "Ctrl+";
	const samples = listTemplates();
	const title = doc ? `${doc.name} — Graphite` : "Welcome — Graphite";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "relative z-40 flex h-9 shrink-0 items-center gap-1 border-b border-border bg-title px-1 md:px-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: reset,
				className: "flex size-7 shrink-0 items-center justify-center md:hidden",
				"aria-label": "Graphite",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/favicon.svg",
					alt: "",
					className: "size-4"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/favicon.svg",
				alt: "",
				className: "ml-1 hidden size-4 shrink-0 md:block"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "hidden items-center md:flex",
				"aria-label": "Menu bar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuBtn, {
						label: "File",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onSelect: () => openSketchFile(),
								children: ["Open Sketch…", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuShortcut, { children: [mod, "O"] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onSelect: () => setCommandOpen(true),
								children: ["Open Quickly…", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuShortcut, { children: mac ? "⌘P" : "Ctrl+P" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSub, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubTrigger, { children: "Open Sample" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubContent, { children: [
								samples.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onSelect: () => void ingestTemplate(s.id),
									children: s.title
								}, s.id)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onSelect: () => void ingestKit(["bracket", "bushing"]),
									children: "L-bracket + bushing"
								})
							] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								disabled: !doc,
								onSelect: () => doc && removePart(doc.id),
								children: "Close Editor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onSelect: () => reset(),
								children: "Close All / New Session"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSub, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubTrigger, {
								disabled: !doc,
								children: "Export"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubContent, { children: [EXPORT_ITEMS.filter(([k]) => k !== "slice").map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								disabled: !doc,
								onSelect: () => void runExport(k),
								children: label
							}, k)), parts.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onSelect: () => void runExport("kit"),
								children: "All parts (zip)"
							}) : null] })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuBtn, {
						label: "Edit",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								disabled: !selectedId,
								onSelect: () => selectedId && removeFeature(selectedId),
								children: ["Delete Feature", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuShortcut, { children: "⌫" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuRadioGroup, {
								value: units,
								onValueChange: (v) => setUnits(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuRadioItem, {
									value: "mm",
									children: "Millimetres"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuRadioItem, {
									value: "in",
									children: "Inches"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuBtn, {
						label: "Selection",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							disabled: !doc,
							onSelect: () => doc && useApp.getState().select(doc.features[0]?.id ?? null),
							children: "Select First Feature"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onSelect: () => useApp.getState().select(null),
							children: "Deselect"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuBtn, {
						label: "View",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onSelect: () => setCommandOpen(true),
								children: ["Command Palette…", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuShortcut, { children: mac ? "⇧⌘P" : "Ctrl+Shift+P" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuCheckboxItem, {
								checked: navOpen,
								onCheckedChange: (v) => setNavOpen(Boolean(v)),
								children: ["Primary Side Bar", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuShortcut, { children: [mod, "B"] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuCheckboxItem, {
								checked: inspectorOpen,
								onCheckedChange: (v) => setInspectorOpen(Boolean(v)),
								children: ["Secondary Side Bar", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuShortcut, { children: mac ? "⌥⌘B" : "Ctrl+Alt+B" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuCheckboxItem, {
								checked: reportOpen,
								onCheckedChange: (v) => setReportOpen(Boolean(v)),
								children: ["Panel", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuShortcut, { children: [mod, "J"] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onSelect: () => toggleActivity("project"),
								children: "Explorer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onSelect: () => toggleActivity("search"),
								children: "Search"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onSelect: () => toggleActivity("issues"),
								children: "Problems"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onSelect: () => toggleActivity("capture"),
								children: "Capture"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onSelect: () => toggleActivity("run"),
								children: "Run and Slice"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuCheckboxItem, {
								checked: !slicerOpen,
								onCheckedChange: (v) => {
									setSlicerOpen(!v);
									if (v) setInspectorOpen(true);
								},
								children: "Talk"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuCheckboxItem, {
								checked: slicerOpen,
								onCheckedChange: (v) => {
									const on = Boolean(v);
									setSlicerOpen(on);
									if (on) setInspectorOpen(true);
								},
								children: "Inspect"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuBtn, {
						label: "Go",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onSelect: () => setCommandOpen(true),
							children: ["Go to File…", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuShortcut, { children: [mod, "P"] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onSelect: () => {
								setReportOpen(true);
								setReportTab("problems");
							},
							children: ["Go to Problems", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuShortcut, { children: mac ? "⇧⌘M" : "Ctrl+Shift+M" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuBtn, {
						label: "Run",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								disabled: !doc,
								onSelect: () => void runSlice(),
								children: ["Start Slicing", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuShortcut, { children: [mod, "R"] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSub, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubTrigger, { children: "Printer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubContent, {
								className: "max-h-72 overflow-y-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuRadioGroup, {
									value: settings.printerId,
									onValueChange: (v) => patchSlicer({ printerId: v }),
									children: PRINTERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuRadioItem, {
										value: p.id,
										children: p.name
									}, p.id))
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSub, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubTrigger, { children: "Material" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuRadioGroup, {
								value: settings.material,
								onValueChange: (v) => patchSlicer({ material: v }),
								children: MATERIALS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuRadioItem, {
									value: m.id,
									children: m.name
								}, m.id))
							}) })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuBtn, {
						label: "Terminal",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onSelect: () => {
								setReportOpen(true);
								setReportTab("gcode");
							},
							children: "G-code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onSelect: () => {
								setReportOpen(true);
								setReportTab("output");
							},
							children: "Slice Output"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MenuBtn, {
						label: "Help",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onSelect: () => reset(),
								children: "Welcome"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onSelect: () => setCommandOpen(true),
								children: ["Keyboard Shortcuts", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuShortcut, { children: mac ? "⇧⌘P" : "Ctrl+Shift+P" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								disabled: true,
								children: "A sketch is a guess until you confirm it."
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute inset-x-0 hidden truncate text-center text-[13px] text-muted md:block",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "min-w-0 flex-1 truncate text-[13px] text-muted md:hidden",
				children: doc?.name ?? "Graphite"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex items-center gap-0.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": slicing ? "Slicing" : "Start slicing",
						disabled: !doc || slicing,
						onClick: () => void runSlice(),
						className: "flex size-7 items-center justify-center text-muted hover:bg-surface-subtle hover:text-fg disabled:opacity-40",
						children: slicing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5 fill-current" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": navOpen ? "Hide primary side bar" : "Show primary side bar",
						"aria-pressed": navOpen,
						onClick: () => setNavOpen(!navOpen),
						className: cn("hidden size-7 items-center justify-center md:flex", navOpen ? "bg-surface-subtle text-fg" : "text-faint hover:text-fg hover:bg-surface-subtle"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeft, { className: "size-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": reportOpen ? "Hide panel" : "Show panel",
						"aria-pressed": reportOpen,
						onClick: () => setReportOpen(!reportOpen),
						className: cn("hidden size-7 items-center justify-center md:flex", reportOpen ? "bg-surface-subtle text-fg" : "text-faint hover:text-fg hover:bg-surface-subtle"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelBottom, { className: "size-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": inspectorOpen ? "Hide secondary side bar" : "Show secondary side bar",
						"aria-pressed": inspectorOpen,
						onClick: () => setInspectorOpen(!inspectorOpen),
						className: cn("hidden size-7 items-center justify-center md:flex", inspectorOpen ? "bg-surface-subtle text-fg" : "text-faint hover:text-fg hover:bg-surface-subtle"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelRight, { className: "size-3.5" })
					})
				]
			})
		]
	});
}
var ACTIVITIES = [
	{
		id: "project",
		label: "Explorer",
		shortcut: "⇧⌘E",
		icon: Files
	},
	{
		id: "search",
		label: "Search",
		shortcut: "⇧⌘F",
		icon: Search
	},
	{
		id: "issues",
		label: "Problems",
		shortcut: "⇧⌘M",
		icon: CircleAlert
	},
	{
		id: "capture",
		label: "Capture",
		shortcut: "",
		icon: PenLine
	},
	{
		id: "run",
		label: "Run and Slice",
		shortcut: "⌘R",
		icon: Play
	}
];
function ActivityBar() {
	const tab = useApp((s) => s.navTab);
	const open = useApp((s) => s.navOpen);
	const toggle = useApp((s) => s.toggleActivity);
	const setCommandOpen = useApp((s) => s.setCommandOpen);
	const issues = collectIssues(useApp((s) => s.parts));
	const settings = useApp((s) => s.slicerSettings);
	const patchSlicer = useApp((s) => s.patchSlicer);
	const units = useApp((s) => s.doc)?.units ?? "mm";
	const setUnits = useApp((s) => s.setUnits);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "hidden w-12 shrink-0 flex-col items-center border-r border-border bg-activity py-1 md:flex",
		"aria-label": "Activity bar",
		children: [
			ACTIVITIES.map((a) => {
				const Icon = a.icon;
				const active = open && tab === a.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					title: a.shortcut ? `${a.label} (${a.shortcut})` : a.label,
					"aria-label": a.label,
					"aria-pressed": active,
					onClick: () => toggle(a.id),
					className: cn("relative flex size-12 items-center justify-center text-faint hover:text-fg", active && "text-fg"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("absolute inset-y-2 left-0 w-0.5 rounded-none bg-fg", active ? "opacity-100" : "opacity-0"),
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-6",
							strokeWidth: active ? 1.75 : 1.5
						}),
						a.id === "issues" && issues.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute top-1.5 right-1.5 min-w-4 rounded-full bg-danger px-1 text-center font-mono text-[10px] leading-4 text-fg",
							children: issues.length > 9 ? "9+" : issues.length
						}) : null
					]
				}, a.id);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-auto" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, {
				modal: false,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					className: "flex size-12 items-center justify-center text-faint hover:text-fg data-[state=open]:text-fg",
					"aria-label": "Settings",
					title: "Settings",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, {
						className: "size-5",
						strokeWidth: 1.5
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					side: "right",
					align: "end",
					className: "min-w-52 rounded-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSub, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubTrigger, { children: "Printer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubContent, {
							className: "max-h-72 overflow-y-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuRadioGroup, {
								value: settings.printerId,
								onValueChange: (v) => patchSlicer({ printerId: v }),
								children: PRINTERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuRadioItem, {
									value: p.id,
									children: p.name
								}, p.id))
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSub, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubTrigger, { children: "Material" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuRadioGroup, {
							value: settings.material,
							onValueChange: (v) => patchSlicer({ material: v }),
							children: MATERIALS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuRadioItem, {
								value: m.id,
								children: m.name
							}, m.id))
						}) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuRadioGroup, {
							value: units,
							onValueChange: (v) => setUnits(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuRadioItem, {
								value: "mm",
								children: "Millimetres"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuRadioItem, {
								value: "in",
								children: "Inches"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onSelect: () => setCommandOpen(true),
							children: "Command Palette…"
						})
					]
				})]
			})
		]
	});
}
function EditorGroupHeader() {
	const doc = useApp((s) => s.doc);
	const parts = useApp((s) => s.parts);
	const selectedId = useApp((s) => s.selectedId);
	const setActive = useApp((s) => s.setActive);
	const select = useApp((s) => s.select);
	const removePart = useApp((s) => s.removePart);
	const selected = doc?.features.find((f) => f.id === selectedId);
	const progress = useApp((s) => s.slicerProgress);
	const slicing = progress >= 0 && progress < 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hidden shrink-0 flex-col md:flex",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-9 items-stretch overflow-x-auto border-b border-border bg-activity",
			children: [
				parts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center bg-bg px-3 text-[13px] text-fg shadow-[inset_0_1px_0_0_var(--color-accent)]",
					children: "Welcome"
				}) : parts.map((p) => {
					const active = p.id === doc?.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("group flex max-w-52 shrink-0 items-center border-r border-border", active ? "bg-bg text-fg shadow-[inset_0_1px_0_0_var(--color-accent)]" : "bg-transparent text-muted hover:bg-surface-subtle/60"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActive(p.id),
							className: "min-w-0 flex-1 truncate px-3 text-left text-[13px]",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": `Close ${p.name}`,
							onClick: (e) => {
								e.stopPropagation();
								removePart(p.id);
							},
							className: "mr-1 flex size-5 shrink-0 items-center justify-center text-faint opacity-0 hover:text-fg group-hover:opacity-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
						})]
					}, p.id);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-auto" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: !doc || slicing,
					onClick: () => void runSlice(),
					className: "mr-1 flex items-center gap-1.5 px-2 text-[12px] text-muted hover:bg-surface-subtle hover:text-fg disabled:opacity-40",
					children: [slicing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3 fill-current" }), "Slice"]
				})
			]
		}), doc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-6 items-center gap-1 overflow-hidden border-b border-border px-2 text-[11px] text-faint",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: "GRAPHITE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3 shrink-0" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "truncate text-muted hover:text-fg",
					onClick: () => setActive(doc.id),
					children: doc.name
				}),
				selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "truncate text-fg hover:text-fg",
					onClick: () => select(selected.id),
					children: selected.name
				})] }) : null
			]
		}) : null]
	});
}
function StatusBar() {
	const doc = useApp((s) => s.doc);
	const parts = useApp((s) => s.parts);
	const settings = useApp((s) => s.slicerSettings);
	const result = useApp((s) => s.sliceResult);
	const issues = collectIssues(parts);
	const printer = printerById(settings.printerId);
	const measure = doc ? measureDoc(doc) : null;
	const setReportOpen = useApp((s) => s.setReportOpen);
	const setReportTab = useApp((s) => s.setReportTab);
	const setNavTab = useApp((s) => s.setNavTab);
	const progress = useApp((s) => s.slicerProgress);
	const error = useApp((s) => s.error);
	const phase = useApp((s) => s.phase);
	const slicing = progress >= 0 && progress < 1;
	let left = "Ready";
	if (error) left = "Failed";
	else if (slicing) left = `Slicing ${Math.round(progress * 100)}%`;
	else if (phase === "recognize") left = "Reading sketch…";
	else if (result) left = "Build succeeded";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "hidden h-[22px] shrink-0 items-center gap-0 bg-status text-[11px] text-muted md:flex",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("flex h-full items-center px-2.5", error ? "bg-danger text-fg" : slicing ? "bg-surface-subtle text-fg" : "text-muted"),
				children: left
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex h-full items-center gap-1.5 px-2 hover:bg-surface-subtle hover:text-fg",
				onClick: () => {
					setReportOpen(true);
					setReportTab("problems");
					setNavTab("issues");
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: issues.length }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "0" })
				]
			}),
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex h-full items-center px-2 hover:bg-surface-subtle hover:text-fg",
				onClick: () => {
					setReportOpen(true);
					setReportTab("output");
				},
				children: [
					result.stats.layers,
					" layers · ",
					formatDuration(result.stats.timeSec)
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-auto" }),
			measure && doc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "px-2 tabular-nums",
				children: [
					measure.size.x.toFixed(1),
					" × ",
					measure.size.z.toFixed(1),
					" × ",
					measure.size.y.toFixed(1),
					" ",
					doc.units
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "px-2",
				children: "No part"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "px-2",
				children: [
					printer.name,
					" · ",
					settings.material.toUpperCase()
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "px-2 uppercase",
				children: doc?.units ?? "mm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "px-2",
				children: "UTF-8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "px-2 pr-3",
				children: "Graphite CAD"
			})
		]
	});
}
var HEIGHTS = [
	.12,
	.16,
	.2,
	.28
];
var STORAGE_KEY$1 = "graphite-slicer";
async function mergedPrintMesh(docs) {
	const layouts = layoutParts(docs);
	const positions = [];
	for (const d of docs) {
		const g = (await buildSolid(d.features))?.geometry ?? fallbackGeometry(d);
		const off = layouts.find((l) => l.id === d.id)?.offset ?? {
			x: 0,
			y: 0,
			z: 0
		};
		const pos = g.getAttribute("position");
		const idx = g.getIndex();
		const push = (i) => {
			positions.push(pos.getX(i) + off.x, pos.getY(i) + off.y, pos.getZ(i) + off.z);
		};
		if (idx) for (let i = 0; i < idx.count; i++) push(idx.getX(i));
		else for (let i = 0; i < pos.count; i++) push(i);
	}
	const geo = new BufferGeometry();
	geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
	if (docs[0]?.units === "in") geo.scale(25.4, 25.4, 25.4);
	return geo;
}
function drawLayer(canvas, paths, bounds) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	const dpr = Math.min(2, window.devicePixelRatio || 1);
	const w = canvas.clientWidth;
	const h = canvas.clientHeight;
	canvas.width = Math.max(1, Math.floor(w * dpr));
	canvas.height = Math.max(1, Math.floor(h * dpr));
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	ctx.clearRect(0, 0, w, h);
	ctx.fillStyle = "#121416";
	ctx.fillRect(0, 0, w, h);
	if (!paths || !bounds) {
		ctx.fillStyle = "#5c6168";
		ctx.font = "12px 'IBM Plex Sans', system-ui, sans-serif";
		ctx.textAlign = "center";
		ctx.fillText("Slice to preview layers", w / 2, h / 2);
		return;
	}
	const bw = Math.max(1, bounds.maxX - bounds.minX);
	const bh = Math.max(1, bounds.maxY - bounds.minY);
	const scale = Math.min((w - 28) / bw, (h - 28) / bh);
	const ox = (w - bw * scale) / 2 - bounds.minX * scale;
	const oy = (h - bh * scale) / 2 + bounds.maxY * scale;
	const map = (p) => ({
		x: p.x * scale + ox,
		y: -p.y * scale + oy
	});
	const stroke = (loops, color, width, closed) => {
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.lineJoin = "round";
		ctx.lineCap = "round";
		for (const loop of loops) {
			if (loop.length < 2) continue;
			ctx.beginPath();
			const a = map(loop[0]);
			ctx.moveTo(a.x, a.y);
			for (let i = 1; i < loop.length; i++) {
				const p = map(loop[i]);
				ctx.lineTo(p.x, p.y);
			}
			if (closed) ctx.closePath();
			ctx.stroke();
		}
	};
	stroke(paths.skirt, "rgb(236 238 240 / 0.28)", 1, true);
	stroke(paths.infill, "rgb(139 143 150 / 0.85)", .9, false);
	stroke(paths.perimeters, "#eceef0", 1.35, true);
}
function LayerScrubber() {
	const result = useApp((s) => s.sliceResult);
	const layer = useApp((s) => s.sliceLayer);
	const setLayer = useApp((s) => s.setSliceLayer);
	if (!useApp((s) => s.slicerOpen) || !result || result.layers.length < 2) return null;
	const L = result.layers[layer];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-auto absolute right-3 bottom-10 left-3 md:bottom-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 rounded-sm bg-surface/90 px-3 py-2 shadow-[var(--shadow-border)] backdrop-blur-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "w-16 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-muted",
					children: [
						layer + 1,
						"/",
						result.layers.length
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					min: 0,
					max: result.layers.length - 1,
					step: 1,
					value: [layer],
					onValueChange: (v) => setLayer(v[0] ?? 0)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "w-14 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted",
					children: [L ? L.z.toFixed(2) : "0", " mm"]
				})
			]
		})
	});
}
function SlicerPanel() {
	const doc = useApp((s) => s.doc);
	const parts = useApp((s) => s.parts);
	const settings = useApp((s) => s.slicerSettings);
	const patch = useApp((s) => s.patchSlicer);
	const result = useApp((s) => s.sliceResult);
	const layer = useApp((s) => s.sliceLayer);
	const progress = useApp((s) => s.slicerProgress);
	const close = useApp((s) => s.setSlicerOpen);
	const canvasRef = (0, import_react.useRef)(null);
	const hydrated = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		hydrated.current = true;
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated.current) return;
		try {
			localStorage.setItem(STORAGE_KEY$1, JSON.stringify(settings));
		} catch {}
	}, [settings]);
	const docs = settings.kit && parts.length > 1 ? parts : doc ? [doc] : [];
	const key = docs.length ? sliceSourceKey(docs, settings) : "";
	const fresh = result && result.sourceKey === key ? result : null;
	const printer = printerById(settings.printerId);
	const bounds = (0, import_react.useMemo)(() => {
		if (!fresh) return null;
		let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
		for (const L of fresh.layers) for (const group of [
			L.perimeters,
			L.infill,
			L.skirt
		]) for (const path of group) for (const p of path) {
			if (p.x < minX) minX = p.x;
			if (p.y < minY) minY = p.y;
			if (p.x > maxX) maxX = p.x;
			if (p.y > maxY) maxY = p.y;
		}
		if (!Number.isFinite(minX)) return null;
		return {
			minX,
			minY,
			maxX,
			maxY
		};
	}, [fresh]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		drawLayer(canvas, fresh?.layers[layer], bounds);
	}, [
		fresh,
		layer,
		bounds
	]);
	async function mesh() {
		return mergedPrintMesh(docs);
	}
	async function downloadGcode() {
		if (!fresh) return;
		const slug = slugify(docs.map((d) => d.name).join("-"));
		downloadBlob(`${slug}.gcode`, new Blob([fresh.gcode], { type: "text/plain" }));
	}
	async function download3mf() {
		try {
			const geo = await mesh();
			const slug = slugify(docs.map((d) => d.name).join("-"));
			downloadBlob(`${slug}.3mf`, await geometryTo3mf(geo, docs[0]?.name ?? "part"));
		} catch {
			toast.error("Could not write the 3MF.");
		}
	}
	async function downloadPack() {
		try {
			const geo = await mesh();
			const slug = slugify(docs.map((d) => d.name).join("-"));
			const name = docs[0]?.name ?? "part";
			const files = [
				{
					name: `${slug}.gcode`,
					blob: new Blob([fresh?.gcode ?? ""], { type: "text/plain" })
				},
				{
					name: `${slug}.3mf`,
					blob: await geometryTo3mf(geo, name)
				},
				{
					name: `${slug}.stl`,
					blob: geometryToStl(geo, name)
				},
				{
					name: "README.txt",
					blob: slicerReadme(name)
				}
			];
			downloadBlob(`${slug}-mac-windows.zip`, await zipBlobs(files));
		} catch {
			toast.error("Could not write the pack.");
		}
	}
	if (!doc) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col gap-3 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-[0.16em] text-faint",
			children: "Universal slicer"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Confirm a part first. The slicer runs in this browser on Mac and Windows — no Cura, no installer."
		})]
	});
	const slicing = progress >= 0 && progress < 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-2 px-4 pt-4 pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.16em] text-faint",
				children: "Universal slicer"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-relaxed text-muted",
				children: "Mac, Windows, Linux. One G-code. No native app."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "sm",
				variant: "ghost",
				onClick: () => close(false),
				children: "Close"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium uppercase tracking-[0.16em] text-faint",
							children: "Printer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: settings.printerId,
							onChange: (e) => patch({ printerId: e.target.value }),
							className: "mt-1.5 h-11 w-full rounded-sm bg-surface-subtle px-3 text-sm text-fg shadow-[var(--shadow-border)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
							children: PRINTERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: p.id,
								children: [
									p.name,
									" · ",
									p.bedX,
									"×",
									p.bedY
								]
							}, p.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-xs leading-relaxed text-faint",
							children: printer.note
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.16em] text-faint",
					children: "Material"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1.5 flex overflow-hidden rounded-sm shadow-[var(--shadow-border)]",
					children: MATERIALS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => patch({ material: m.id }),
						className: cn("h-10 flex-1 font-mono text-[10px] uppercase tracking-[0.14em]", settings.material === m.id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"),
						children: m.name
					}, m.id))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.16em] text-faint",
					children: "Layer height"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1.5 flex overflow-hidden rounded-sm shadow-[var(--shadow-border)]",
					children: HEIGHTS.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => patch({ layerHeight: h }),
						className: cn("h-10 flex-1 font-mono text-[10px] uppercase tracking-[0.14em]", settings.layerHeight === h ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"),
						children: h.toFixed(2)
					}, h))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-faint",
						children: "Walls"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1.5 flex overflow-hidden rounded-sm shadow-[var(--shadow-border)]",
						children: [
							1,
							2,
							3,
							4
						].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => patch({ walls: n }),
							className: cn("h-10 flex-1 font-mono text-[10px]", settings.walls === n ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"),
							children: n
						}, n))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.16em] text-faint",
							children: "Infill"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[11px] tabular-nums text-muted",
							children: [settings.infill, "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 px-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 0,
							max: 80,
							step: 5,
							value: [settings.infill],
							onValueChange: (v) => patch({ infill: v[0] ?? 20 })
						})
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => patch({ brim: !settings.brim }),
						className: cn("h-10 flex-1 rounded-sm font-mono text-[10px] uppercase tracking-[0.14em] shadow-[var(--shadow-border)]", settings.brim ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"),
						children: ["Brim ", settings.brim ? "on" : "off"]
					}), parts.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => patch({ kit: !settings.kit }),
						className: cn("h-10 flex-1 rounded-sm font-mono text-[10px] uppercase tracking-[0.14em] shadow-[var(--shadow-border)]", settings.kit ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"),
						children: settings.kit ? `All ${parts.length} parts` : "This part"
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					className: "h-44 w-full rounded-sm bg-surface-subtle shadow-[var(--shadow-border)]",
					"aria-label": "Layer preview"
				}),
				slicing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 overflow-hidden rounded-full bg-surface-subtle",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-accent transition-[width] duration-150",
						style: { width: `${Math.round(progress * 100)}%` }
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					className: "w-full",
					onClick: () => void runSlice(),
					disabled: slicing,
					children: [slicing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, {}), slicing ? `Slicing ${Math.round(progress * 100)}%` : "Slice for print"]
				}),
				fresh ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 rounded-sm bg-surface-subtle p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[11px] tabular-nums text-fg",
							children: [
								formatDuration(fresh.stats.timeSec),
								" · ",
								fresh.stats.filamentGrams.toFixed(1),
								" g · ",
								fresh.stats.layers,
								" ",
								"layers"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs leading-relaxed text-muted",
							children: [
								fresh.stats.sizeX.toFixed(0),
								" × ",
								fresh.stats.sizeY.toFixed(0),
								" × ",
								fresh.stats.sizeZ.toFixed(0),
								" mm on a",
								" ",
								printer.bedX,
								" × ",
								printer.bedY,
								" bed",
								fresh.stats.fitsBed ? "." : " — this part is larger than the selected bed."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5 pt-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									size: "sm",
									onClick: () => void downloadGcode(),
									disabled: slicing,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), " G-code — Mac & Windows"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: "outline",
									onClick: () => void download3mf(),
									disabled: slicing,
									children: "3MF — Cura / Prusa / Bambu"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: "ghost",
									onClick: () => void downloadPack(),
									disabled: slicing,
									children: "Zip pack (G-code + 3MF + STL)"
								})
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs leading-relaxed text-faint",
					children: "G-code drops onto an SD card, OctoPrint, or Fluidd from either OS. 3MF opens in Cura, PrusaSlicer, and Bambu Studio on macOS and Windows if you still want a desktop slicer."
				})
			]
		})]
	});
}
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-sm bg-surface-subtle px-3 text-sm text-fg shadow-[var(--shadow-border)]", "placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "disabled:cursor-not-allowed disabled:opacity-40", className),
		...props
	});
}
var TITLES = {
	project: "Explorer",
	issues: "Problems",
	search: "Search",
	capture: "Capture",
	run: "Run and Slice"
};
function Navigator() {
	const tab = useApp((s) => s.navTab);
	const issues = collectIssues(useApp((s) => s.parts));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-9 shrink-0 items-center px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium tracking-[0.08em] text-muted uppercase",
				children: TITLES[tab]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-auto text-faint",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 min-w-0 flex-1",
			children: tab === "issues" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IssueList, { issues }) : tab === "search" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchList, {}) : tab === "capture" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptureView, {}) : tab === "run" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlicerPanel, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturePanel, {})
		})]
	});
}
function CaptureView() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col gap-3 overflow-y-auto p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13px] leading-relaxed text-muted",
				children: "Photo, draw, or speak. Graphite never assumes — it asks until the model is right."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptureBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KitCard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleGrid, { compact: true })
		]
	});
}
function IssueList({ issues }) {
	const setActive = useApp((s) => s.setActive);
	const setSlicerOpen = useApp((s) => s.setSlicerOpen);
	const setMobileTab = useApp((s) => s.setMobileTab);
	const setInspectorOpen = useApp((s) => s.setInspectorOpen);
	if (!issues.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-full flex-col gap-2 px-4 py-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[13px] leading-relaxed text-muted",
			children: "No problems have been detected in the workspace. Confirm a sketch and Graphite will list anything it refuses to assume."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "min-h-0 flex-1 overflow-y-auto px-1 pb-3",
		children: issues.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => {
				setActive(item.partId);
				setSlicerOpen(false);
				setInspectorOpen(true);
				setMobileTab("talk");
			},
			className: "flex w-full flex-col items-start gap-0.5 rounded-none px-3 py-2 text-left hover:bg-surface-subtle",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-faint",
					children: item.partName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[13px] text-fg",
					children: item.question.prompt
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[12px] leading-relaxed text-muted",
					children: item.question.why
				})
			]
		}) }, item.question.id))
	});
}
function SearchList() {
	const query = useApp((s) => s.searchQuery);
	const setQuery = useApp((s) => s.setSearchQuery);
	const parts = useApp((s) => s.parts);
	const setActive = useApp((s) => s.setActive);
	const select = useApp((s) => s.select);
	const q = query.trim().toLowerCase();
	const hits = parts.flatMap((p) => {
		const partHit = !q || p.name.toLowerCase().includes(q);
		const features = p.features.filter((f) => !q || f.name.toLowerCase().includes(q) || f.kind.toLowerCase().includes(q));
		if (!partHit && !features.length) return [];
		return [{
			part: p,
			features: q && !partHit ? features : q ? features : p.features
		}];
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-3 pb-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: query,
				onChange: (e) => setQuery(e.target.value),
				placeholder: "Search",
				className: "h-8 rounded-none text-[13px]"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "min-h-0 flex-1 overflow-y-auto px-1 pb-3",
			children: hits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "px-3 py-3 text-[13px] text-muted",
				children: parts.length ? "No results found." : "Load a sketch first."
			}) : hits.map(({ part, features }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "mb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setActive(part.id),
					className: "flex h-7 w-full items-center rounded-none px-3 text-left text-[13px] text-fg hover:bg-surface-subtle",
					children: part.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setActive(part.id);
						select(f.id);
					},
					className: "flex h-7 w-full items-center gap-2 rounded-none px-3 pl-6 text-left text-[13px] text-muted hover:bg-surface-subtle hover:text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 flex-1 truncate",
						children: f.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] uppercase tracking-[0.12em] text-faint",
						children: f.kind
					})]
				}) }, f.id)) })]
			}, part.id))
		})]
	});
}
function PipelineOverlay() {
	const phase = useApp((s) => s.phase);
	const pipeline = useApp((s) => s.pipeline);
	if (phase !== "recognize") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-10 flex items-center justify-center bg-bg/70 p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "w-full max-w-sm space-y-3",
			children: pipeline.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-1 size-1.5 shrink-0 rounded-full", s.status === "done" && "bg-ok", s.status === "active" && "bg-fg", s.status === "pending" && "bg-faint") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("text-sm", s.status === "pending" ? "text-faint" : "text-fg"),
					children: s.label
				}), s.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] text-muted",
					children: s.detail
				}) : null] })]
			}, s.id))
		})
	});
}
function previewGcode(gcode) {
	const lines = gcode.split("\n");
	if (lines.length <= 140) return gcode;
	const omitted = lines.length - 100;
	return [
		...lines.slice(0, 80),
		`; … ${omitted} lines omitted — download for the full file`,
		...lines.slice(-20)
	].join("\n");
}
function ReportPane() {
	const open = useApp((s) => s.reportOpen);
	const tab = useApp((s) => s.reportTab);
	const setOpen = useApp((s) => s.setReportOpen);
	const setTab = useApp((s) => s.setReportTab);
	const result = useApp((s) => s.sliceResult);
	const settings = useApp((s) => s.slicerSettings);
	const doc = useApp((s) => s.doc);
	const parts = useApp((s) => s.parts);
	const progress = useApp((s) => s.slicerProgress);
	const pipeline = useApp((s) => s.pipeline);
	const issues = collectIssues(parts);
	const docs = settings.kit && parts.length > 1 ? parts : doc ? [doc] : [];
	const key = docs.length ? sliceSourceKey(docs, settings) : "";
	const fresh = result && result.sourceKey === key ? result : null;
	const printer = printerById(settings.printerId);
	const slicing = progress >= 0 && progress < 1;
	const setActive = useApp((s) => s.setActive);
	const setSlicerOpen = useApp((s) => s.setSlicerOpen);
	const setInspectorOpen = useApp((s) => s.setInspectorOpen);
	const gcodeView = (0, import_react.useMemo)(() => fresh ? previewGcode(fresh.gcode) : "", [fresh]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "hidden h-[220px] shrink-0 flex-col border-t border-border bg-surface md:flex",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-9 shrink-0 items-end gap-0 border-b border-border px-1",
			children: [
				[
					["problems", `PROBLEMS${issues.length ? ` ${issues.length}` : ""}`],
					["output", "OUTPUT"],
					["gcode", "G-CODE"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(id),
					className: cn("h-8 px-3 text-[11px] tracking-[0.08em] uppercase", tab === id ? "border-b border-fg text-fg" : "text-faint hover:text-fg"),
					children: label
				}, id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-auto" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Hide panel",
					onClick: () => setOpen(false),
					className: "mb-1 mr-1 flex size-7 items-center justify-center text-faint hover:text-fg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-auto",
			children: tab === "problems" ? issues.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "px-1 py-1",
				children: issues.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setActive(item.partId);
						setSlicerOpen(false);
						setInspectorOpen(true);
					},
					className: "flex w-full items-start gap-3 px-3 py-1.5 text-left text-[13px] hover:bg-surface-subtle",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 text-danger",
							children: "●"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: item.question.prompt
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 text-muted",
								children: item.question.why
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-[12px] text-faint",
							children: item.partName
						})
					]
				}) }, item.question.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-4 text-[13px] text-muted",
				children: "No problems have been detected in the workspace."
			}) : tab === "gcode" ? fresh ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-full flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "min-w-0 flex-1 truncate font-mono text-[11px] text-muted",
							children: [
								fresh.stats.layers,
								" layers · ",
								printer.firmware,
								" · ",
								printer.name
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "ghost",
							onClick: () => void navigator.clipboard.writeText(fresh.gcode),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), " Copy"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "ghost",
							onClick: () => downloadBlob(`${slugify(docs.map((d) => d.name).join("-") || "part")}.gcode`, new Blob([fresh.gcode], { type: "text/plain" })),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), " Save"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "min-h-0 flex-1 overflow-auto px-3 pb-3 font-mono text-[11px] leading-relaxed text-muted",
					children: gcodeView
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-4 text-[13px] text-muted",
				children: "Run Slice (⌘R) to emit G-code. The file is the same on Mac and Windows."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 p-4",
				children: [
					slicing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-[11px] uppercase tracking-[0.14em] text-muted",
						children: [
							"Slicing ",
							Math.round(progress * 100),
							"%"
						]
					}) : null,
					fresh ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[13px] text-fg",
							children: [
								"Build succeeded · ",
								formatDuration(fresh.stats.timeSec),
								" · ",
								fresh.stats.filamentGrams.toFixed(1),
								" g ·",
								" ",
								fresh.stats.layers,
								" layers"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[12px] leading-relaxed text-muted",
							children: [
								printer.name,
								" · ",
								settings.material.toUpperCase(),
								" · ",
								settings.layerHeight.toFixed(2),
								" mm ·",
								" ",
								fresh.stats.sizeX.toFixed(0),
								" × ",
								fresh.stats.sizeY.toFixed(0),
								" × ",
								fresh.stats.sizeZ.toFixed(0),
								" mm",
								fresh.stats.fitsBed ? ` on a ${printer.bedX} × ${printer.bedY} bed.` : ` — larger than the ${printer.bedX} × ${printer.bedY} bed.`
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[12px] text-faint",
							children: "G-code is Marlin/Klipper. Open on macOS or Windows, or drop the 3MF into Cura / PrusaSlicer / Bambu Studio."
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] text-muted",
						children: "No slice yet. Run → Start Slicing, or press ⌘R. Output lands in this panel."
					}),
					issues.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[12px] text-muted",
						children: [
							issues.length,
							" open question",
							issues.length === 1 ? "" : "s",
							" in Problems — Graphite will not assume them."
						]
					}) : null,
					doc?.pipelineNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12px] leading-relaxed text-faint",
						children: doc.pipelineNote
					}) : null,
					pipeline.some((s) => s.status === "done") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[0.14em] text-faint",
						children: pipeline.map((s) => s.label).join(" · ")
					}) : null
				]
			})
		})]
	});
}
function Solid({ features, selectedId, dim }) {
	const [geo, setGeo] = (0, import_react.useState)(null);
	const key = (0, import_react.useMemo)(() => JSON.stringify(features.map((f) => ({
		id: f.id,
		k: f.kind,
		o: f.op,
		p: f.params,
		pos: f.position,
		r: f.rotation,
		a: f.axis,
		h: f.hidden,
		pr: f.profile
	}))), [features]);
	(0, import_react.useEffect)(() => {
		let alive = true;
		const t = window.setTimeout(() => {
			buildSolid(features).then((built) => {
				if (!alive) return;
				setGeo(built?.geometry ?? null);
			});
		}, 50);
		return () => {
			alive = false;
			window.clearTimeout(t);
		};
	}, [key, features]);
	const selected = features.find((f) => f.id === selectedId && !f.hidden);
	const selGeo = (0, import_react.useMemo)(() => {
		if (!selected) return null;
		const g = featureGeometry(selected);
		g.applyMatrix4(featureMatrix(selected));
		return g;
	}, [selected]);
	(0, import_react.useEffect)(() => {
		return () => {
			selGeo?.dispose();
		};
	}, [selGeo]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		geo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			geometry: geo,
			castShadow: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: dim ? "#8a9098" : "#c2c7ce",
				metalness: .58,
				roughness: .4,
				transparent: dim,
				opacity: dim ? .22 : 1
			})
		}) : null,
		geo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("lineSegments", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("edgesGeometry", { args: [geo, 28] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineBasicMaterial", {
			color: "#e6e8eb",
			transparent: true,
			opacity: dim ? .28 : .55
		})] }) : null,
		selGeo && !dim ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("lineSegments", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("edgesGeometry", { args: [selGeo, 18] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineBasicMaterial", { color: "#f4f5f6" })] }) : null
	] });
}
function CameraRig({ view, size }) {
	const { camera, controls } = useThree();
	const max = Math.max(size.x, size.y, size.z, 24);
	const cy = size.y * .45;
	(0, import_react.useEffect)(() => {
		const dist = max * 1.7;
		const targets = {
			iso: [
				dist * .85,
				dist * .7,
				dist * .85
			],
			top: [
				.01,
				dist * 1.4,
				.01
			],
			front: [
				0,
				cy + dist * .15,
				dist * 1.35
			],
			right: [
				dist * 1.35,
				cy + dist * .15,
				0
			]
		};
		camera.position.set(...targets[view]);
		camera.lookAt(0, cy, 0);
		camera.updateProjectionMatrix();
		const c = controls;
		if (c?.target) {
			c.target.set(0, cy, 0);
			c.update?.();
		}
	}, [
		view,
		camera,
		controls,
		max,
		cy
	]);
	return null;
}
function pathsToGeo(layers, from, to, kind, close) {
	const positions = [];
	for (let i = from; i <= to; i++) {
		const L = layers[i];
		if (!L) continue;
		const z = L.z;
		const group = L[kind];
		for (const path of group) {
			for (let k = 1; k < path.length; k++) {
				const a = path[k - 1];
				const b = path[k];
				positions.push(a.x, z, a.y, b.x, z, b.y);
			}
			if (close && path.length > 2) {
				const a = path[path.length - 1];
				const b = path[0];
				positions.push(a.x, z, a.y, b.x, z, b.y);
			}
		}
	}
	const geo = new BufferGeometry();
	if (positions.length) geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
	return geo;
}
function SliceToolpaths() {
	const result = useApp((s) => s.sliceResult);
	const layer = useApp((s) => s.sliceLayer);
	const open = useApp((s) => s.slicerOpen);
	const past = (0, import_react.useMemo)(() => {
		if (!result || !open) return null;
		const end = layer - 1;
		if (end < 0) {
			const empty = () => new BufferGeometry();
			return {
				wall: empty(),
				fill: empty()
			};
		}
		return {
			wall: pathsToGeo(result.layers, 0, end, "perimeters", true),
			fill: pathsToGeo(result.layers, 0, end, "infill", false)
		};
	}, [
		result,
		layer,
		open
	]);
	const current = (0, import_react.useMemo)(() => {
		if (!result || !open) return null;
		return {
			wall: pathsToGeo(result.layers, layer, layer, "perimeters", true),
			fill: pathsToGeo(result.layers, layer, layer, "infill", false),
			skirt: pathsToGeo(result.layers, layer, layer, "skirt", true)
		};
	}, [
		result,
		layer,
		open
	]);
	(0, import_react.useEffect)(() => {
		return () => {
			past?.wall.dispose();
			past?.fill.dispose();
			current?.wall.dispose();
			current?.fill.dispose();
			current?.skirt.dispose();
		};
	}, [past, current]);
	if (!open || !result || !past || !current) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		past.wall.attributes.position ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineSegments", {
			geometry: past.wall,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineBasicMaterial", {
				color: "#5c6168",
				transparent: true,
				opacity: .45
			})
		}) : null,
		past.fill.attributes.position ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineSegments", {
			geometry: past.fill,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineBasicMaterial", {
				color: "#3d444c",
				transparent: true,
				opacity: .35
			})
		}) : null,
		current.skirt.attributes.position ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineSegments", {
			geometry: current.skirt,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineBasicMaterial", { color: "#8b8f96" })
		}) : null,
		current.fill.attributes.position ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineSegments", {
			geometry: current.fill,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineBasicMaterial", { color: "#8b8f96" })
		}) : null,
		current.wall.attributes.position ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineSegments", {
			geometry: current.wall,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineBasicMaterial", { color: "#eceef0" })
		}) : null
	] });
}
function PartGroup({ part, offset, active, selectedId, dim }) {
	const setActive = useApp((s) => s.setActive);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		position: [
			offset.x,
			offset.y,
			offset.z
		],
		onClick: (e) => {
			e.stopPropagation();
			setActive(part.id);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Solid, {
			features: part.features,
			selectedId: active ? selectedId : null,
			dim
		})
	});
}
function Scene({ view }) {
	const doc = useApp((s) => s.doc);
	const parts = useApp((s) => s.parts);
	const activeId = useApp((s) => s.activeId);
	const selectedId = useApp((s) => s.selectedId);
	const kitView = useApp((s) => s.kitView);
	const slicerOpen = useApp((s) => s.slicerOpen);
	const showKit = kitView && parts.length > 1;
	const visible = showKit ? parts : doc ? [doc] : [];
	const layouts = (0, import_react.useMemo)(() => layoutParts(showKit ? parts : doc ? [doc] : []), [
		showKit,
		parts,
		doc
	]);
	const kitSize = (0, import_react.useMemo)(() => {
		if (!visible.length) return {
			x: 80,
			y: 20,
			z: 80
		};
		if (!showKit && doc) return measureDoc(doc).size;
		let maxX = 0;
		let maxY = 0;
		let maxZ = 0;
		for (const l of layouts) {
			maxX = Math.max(maxX, Math.abs(l.offset.x) + l.size.x);
			maxY = Math.max(maxY, l.size.y);
			maxZ = Math.max(maxZ, l.size.z);
		}
		return {
			x: Math.max(maxX * 2, 40),
			y: maxY,
			z: Math.max(maxZ, 40)
		};
	}, [
		layouts,
		showKit,
		doc,
		visible.length
	]);
	const cell = doc?.units === "in" ? .25 : 5;
	const section = cell * 5;
	const gridExtent = Math.max(80, Math.max(kitSize.x, kitSize.z) * 2.2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
			attach: "background",
			args: ["#0b0c0e"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
			"#e4e7ea",
			"#1c1e22",
			.7
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .42 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				12,
				18,
				8
			],
			intensity: 1.25
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				-10,
				8,
				-12
			],
			intensity: .35
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid, {
			infiniteGrid: true,
			fadeDistance: gridExtent * 1.8,
			fadeStrength: 1.4,
			cellSize: cell,
			sectionSize: section,
			cellColor: "#3d444c",
			sectionColor: "#5c646e",
			position: [
				0,
				.01,
				0
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraRig, {
			view,
			size: kitSize
		}),
		visible.map((part) => {
			const layout = layouts.find((l) => l.id === part.id);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartGroup, {
				part,
				offset: layout?.offset ?? {
					x: 0,
					y: 0,
					z: 0
				},
				active: part.id === activeId,
				selectedId,
				dim: slicerOpen || part.id !== activeId
			}, part.id);
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliceToolpaths, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactShadows, {
			position: [
				0,
				0,
				0
			],
			opacity: .38,
			scale: Math.max(60, gridExtent),
			blur: 2.4,
			far: 24
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
			makeDefault: true,
			enableDamping: true,
			dampingFactor: .08,
			minPolarAngle: .08,
			maxPolarAngle: Math.PI * .49,
			minDistance: 8,
			maxDistance: 800
		})
	] });
}
function Viewport() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [view, setView] = (0, import_react.useState)("iso");
	const doc = useApp((s) => s.doc);
	const parts = useApp((s) => s.parts);
	const kitView = useApp((s) => s.kitView);
	const setKitView = useApp((s) => s.setKitView);
	const sourceThumb = useApp((s) => s.sourceThumb);
	const thumbs = useApp((s) => s.thumbs);
	const wrap = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => setMounted(true), []);
	const measure = doc ? measureDoc(doc) : null;
	const unit = doc?.units ?? "mm";
	const kit = parts.length > 1;
	const slicerOpen = useApp((s) => s.slicerOpen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrap,
		className: "relative h-full min-h-[200px] w-full bg-bg",
		children: [mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
			dpr: [1, 2],
			gl: {
				antialias: true,
				alpha: false
			},
			camera: {
				position: [
					90,
					70,
					90
				],
				fov: 35,
				near: .1,
				far: 4e3
			},
			className: "h-full w-full touch-none",
			onPointerMissed: () => useApp.getState().select(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, { view })
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-bg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-3 left-3 flex items-center gap-2",
					children: [
						sourceThumb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: sourceThumb,
							alt: "",
							className: "h-14 w-14 rounded-sm object-cover outline outline-1 -outline-offset-1 outline-fg/10"
						}) : null,
						kit ? parts.filter((p) => thumbs[p.id] && thumbs[p.id] !== sourceThumb).slice(0, 2).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: thumbs[p.id] ?? "",
							alt: "",
							className: "h-10 w-10 rounded-sm object-cover opacity-70 outline outline-1 -outline-offset-1 outline-fg/10"
						}, p.id)) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pointer-events-auto flex items-center gap-1.5",
							children: [kit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setKitView(!kitView),
								className: `h-9 rounded-sm px-2.5 font-mono text-[10px] uppercase tracking-[0.14em] shadow-[var(--shadow-border)] ${kitView ? "bg-accent text-accent-fg" : "bg-surface text-muted hover:text-fg"}`,
								children: "kit"
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex rounded-sm shadow-[var(--shadow-border)]",
								children: [
									"iso",
									"top",
									"front",
									"right"
								].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setView(v),
									className: `h-9 px-2.5 font-mono text-[10px] uppercase tracking-[0.14em] ${view === v ? "bg-accent text-accent-fg" : "bg-surface text-muted hover:text-fg"}`,
									children: v
								}, v))
							})]
						})
					]
				}),
				measure && doc && !slicerOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute right-3 bottom-3 font-mono text-[11px] tabular-nums text-muted",
					children: [
						kit ? `${parts.length} parts · ` : null,
						measure.size.x.toFixed(1),
						" × ",
						measure.size.z.toFixed(1),
						" × ",
						measure.size.y.toFixed(1),
						" ",
						unit,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-2 text-faint",
							children: "·"
						}),
						Math.round(doc.confidence * 100),
						"% confirmed"
					]
				}) : !slicerOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute right-3 bottom-3 font-mono text-[11px] uppercase tracking-[0.16em] text-faint",
					children: "Drop a sketch"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayerScrubber, {})
			]
		})]
	});
}
var TABS = [
	{
		id: "capture",
		label: "Capture"
	},
	{
		id: "model",
		label: "Model"
	},
	{
		id: "talk",
		label: "Talk"
	},
	{
		id: "slice",
		label: "Slice"
	}
];
var STORAGE_KEY = "graphite-slicer";
function isField(el) {
	if (!(el instanceof HTMLElement)) return false;
	const tag = el.tagName;
	return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}
function Workspace() {
	const doc = useApp((s) => s.doc);
	const parts = useApp((s) => s.parts);
	const phase = useApp((s) => s.phase);
	const error = useApp((s) => s.error);
	const captureMode = useApp((s) => s.captureMode);
	useApp((s) => s.slicerOpen);
	const setSlicerOpen = useApp((s) => s.setSlicerOpen);
	const settings = useApp((s) => s.slicerSettings);
	const patchSlicer = useApp((s) => s.patchSlicer);
	const mobileTab = useApp((s) => s.mobileTab);
	const setMobileTab = useApp((s) => s.setMobileTab);
	const navOpen = useApp((s) => s.navOpen);
	const inspectorOpen = useApp((s) => s.inspectorOpen);
	const fileRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (error) toast.error(error);
	}, [error]);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) patchSlicer(JSON.parse(raw));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
		} catch {}
	}, [settings]);
	const onDrop = (0, import_react.useCallback)((e) => {
		e.preventDefault();
		const file = e.dataTransfer.files?.[0];
		if (file && file.type.startsWith("image/")) ingestImage(file, file.name);
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const field = isField(e.target);
			const meta = e.metaKey || e.ctrlKey;
			const app = useApp.getState();
			if (e.key === "Escape") {
				if (app.commandOpen) {
					app.setCommandOpen(false);
					return;
				}
				app.select(null);
				app.setCaptureMode(null);
				return;
			}
			if (meta && e.shiftKey && e.key.toLowerCase() === "p") {
				e.preventDefault();
				app.setCommandOpen(true);
				return;
			}
			if (meta && e.shiftKey && e.key.toLowerCase() === "o") {
				e.preventDefault();
				app.setCommandOpen(true);
				return;
			}
			if (meta && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "p") {
				e.preventDefault();
				app.setCommandOpen(true);
				return;
			}
			if (meta && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "k") {
				e.preventDefault();
				app.setCommandOpen(!app.commandOpen);
				return;
			}
			if (app.commandOpen) return;
			if (meta && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "r") {
				e.preventDefault();
				runSlice();
				return;
			}
			if (meta && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "o") {
				e.preventDefault();
				document.getElementById("graphite-open")?.click();
				return;
			}
			if (meta && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "b") {
				e.preventDefault();
				app.setNavOpen(!app.navOpen);
				return;
			}
			if (meta && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "j") {
				e.preventDefault();
				app.setReportOpen(!app.reportOpen);
				return;
			}
			if (meta && e.altKey && e.key.toLowerCase() === "b") {
				e.preventDefault();
				app.setInspectorOpen(!app.inspectorOpen);
				return;
			}
			if (meta && e.key === "0" && e.altKey) {
				e.preventDefault();
				app.setInspectorOpen(!app.inspectorOpen);
				return;
			}
			if (meta && e.key === "0") {
				e.preventDefault();
				app.setNavOpen(!app.navOpen);
				return;
			}
			if (meta && e.shiftKey && e.key.toLowerCase() === "e") {
				e.preventDefault();
				app.toggleActivity("project");
				return;
			}
			if (meta && e.shiftKey && e.key.toLowerCase() === "f") {
				e.preventDefault();
				app.toggleActivity("search");
				return;
			}
			if (meta && e.shiftKey && e.key.toLowerCase() === "m") {
				e.preventDefault();
				app.setReportOpen(true);
				app.setReportTab("problems");
				app.setNavTab("issues");
				return;
			}
			if (meta && e.shiftKey && e.key.toLowerCase() === "y") {
				e.preventDefault();
				app.setReportOpen(!app.reportOpen);
				return;
			}
			if (meta && e.key === "`") {
				e.preventDefault();
				app.setReportOpen(true);
				app.setReportTab("gcode");
				return;
			}
			if (field) return;
			if ((e.key === "Delete" || e.key === "Backspace") && app.selectedId) app.removeFeature(app.selectedId);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	const empty = phase === "intake" && !doc && !captureMode && parts.length === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-bg text-fg",
		onDragOver: (e) => e.preventDefault(),
		onDrop,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityBar, {}),
					navOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "hidden w-[260px] shrink-0 flex-col border-r border-border md:flex",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigator, {})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
						className: "relative flex min-w-0 flex-1 flex-col",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorGroupHeader, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-[38vh] min-h-[220px] md:h-auto md:min-h-0 md:flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PipelineOverlay, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptureOverlay, {}),
									empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WelcomePage, {}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportPane, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-h-0 flex-1 flex-col border-t border-border md:hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
									className: "flex shrink-0 border-b border-border",
									children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setMobileTab(t.id);
											setSlicerOpen(t.id === "slice");
										},
										className: cn("h-12 flex-1 text-xs font-medium uppercase tracking-[0.14em]", mobileTab === t.id ? "text-fg" : "text-faint"),
										children: t.label
									}, t.id))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-h-0 flex-1 overflow-y-auto",
									children: [
										mobileTab === "capture" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-4 p-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptureBar, {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KitCard, {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleGrid, { compact: true })
											]
										}) : null,
										mobileTab === "model" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturePanel, {}) : null,
										mobileTab === "talk" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatPanel, {}) : null,
										mobileTab === "slice" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlicerPanel, {}) : null
									]
								})]
							})
						]
					}),
					inspectorOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "hidden w-[320px] shrink-0 flex-col border-l border-border bg-surface md:flex",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InspectorFrame, {})
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandPalette, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "graphite-open",
				ref: fileRef,
				type: "file",
				accept: "image/*",
				className: "hidden",
				onChange: (e) => {
					const file = e.target.files?.[0];
					if (file) ingestImage(file, file.name);
					e.target.value = "";
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "bottom-center"
			})
		]
	});
}
function WelcomePage() {
	const mac = useMac();
	const mod = mac ? "⌘" : "Ctrl+";
	const shift = mac ? "⇧⌘" : "Ctrl+Shift+";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-10 hidden overflow-y-auto bg-bg md:block",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10 md:px-10 md:py-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-3xl font-medium tracking-tight text-fg",
					children: "Graphite"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm leading-relaxed text-muted",
					children: "Sketch to CAD to G-code. A sketch is a guess until you confirm it."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-[11px] font-medium tracking-[0.12em] text-faint uppercase",
					children: "Start"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "flex flex-col text-[13px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WelcomeRow, {
							label: "Open Sketch…",
							hint: `${mod}O`,
							onClick: () => document.getElementById("graphite-open")?.click()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WelcomeRow, {
							label: "Command Palette…",
							hint: `${shift}P`,
							onClick: () => useApp.getState().setCommandOpen(true)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WelcomeRow, {
							label: "Show Explorer",
							hint: `${shift}E`,
							onClick: () => useApp.getState().toggleActivity("project")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WelcomeRow, {
							label: "Capture",
							hint: "",
							onClick: () => useApp.getState().toggleActivity("capture")
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-[11px] font-medium tracking-[0.12em] text-faint uppercase",
					children: "Walkthrough"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KitCard, {})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-[11px] font-medium tracking-[0.12em] text-faint uppercase",
					children: "Samples"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleGrid, {})
				})] })
			]
		})
	});
}
function WelcomeRow({ label, hint, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex h-8 w-full items-center gap-4 rounded-none text-left hover:bg-surface-subtle",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-fg",
			children: label
		}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "ml-auto font-mono text-[11px] text-faint",
			children: hint
		}) : null]
	}) });
}
function InspectorFrame() {
	const slicerOpen = useApp((s) => s.slicerOpen);
	const setSlicerOpen = useApp((s) => s.setSlicerOpen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-9 shrink-0 items-center px-2",
			children: [[false, "Talk"], [true, "Inspect"]].map(([on, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setSlicerOpen(on),
				className: cn("h-7 px-2.5 text-[11px] tracking-[0.04em] uppercase", slicerOpen === on ? "border-b border-fg text-fg" : "text-faint hover:text-fg"),
				children: label
			}, label))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 border-t border-border",
			children: slicerOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlicerPanel, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatPanel, {})
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workspace, {});
}
//#endregion
export { Home as component, routes_Dcb4sYPf_exports as t };
