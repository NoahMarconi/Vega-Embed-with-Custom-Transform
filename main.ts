import wrapper from "vega-embed/src/index";
import { label } from "vega-label";
import { Spec, View, Info } from "vega";

// add core transforms
(wrapper as any).vega.transforms["label"] = label;

const data = [
  {
    name: "table",
    values: [
      { category: "I", amount: 88 },
      { category: "J", amount: 95 },
      { category: "K", amount: 63 },
      { category: "L", amount: 91 },
      { category: "M", amount: 51 },
      { category: "N", amount: 23 },
      { category: "O", amount: 2 },
      { category: "P", amount: 47 },
    ],
  },
];

const spec: Spec = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  width: 700,
  height: 500,
  padding: 5,
  data: [],
  scales: [
    {
      name: "yscale",
      type: "band",
      domain: { data: "table", field: "category" },
      range: "height",
      padding: 0.05,
      round: true,
    },
    {
      name: "xscale",
      domain: { data: "table", field: "amount" },
      nice: true,
      range: "width",
    },
  ],
  axes: [
    { orient: "left", scale: "yscale" },
    { orient: "bottom", scale: "xscale" },
  ],
  marks: [
    {
      type: "rect",
      name: "hbar",
      from: { data: "table" },
      encode: {
        enter: {
          y: { scale: "yscale", field: "category" },
          height: { scale: "yscale", band: 1 },
          x: { scale: "xscale", field: "amount" },
          x2: { scale: "xscale", value: 0 },
        },
      },
    },
    {
      type: "text",
      from: { data: "hbar" },
      encode: {
        enter: {
          fontSize: { value: 25 },
          text: { field: "datum.amount" },
          fill: { value: "#294E65" },
        },
      },
      transform: [
        {
          type: "label",
          offset: [-15, 15],
          anchor: ["right"],
          size: [735, 547],
        },
      ],
    },
  ],
};

document.addEventListener("DOMContentLoaded", function (event) {
  const runtime = (wrapper as any).vega.parse(Object.assign(spec, { data }));
  const view = new View(runtime)
    .logLevel(Info)
    .renderer("svg")
    .initialize(document.querySelector("#view0"));

  view.runAsync();

  const embedView = (wrapper as any).embed("#view1", spec, {
    width: 735,
    height: 547,
    renderer: "svg",
    theme: "quartz",
    actions: false,
    defaultStyle: false,
    patch: [{ op: "replace", path: "/data", value: data }],
  });

  // assign view and vega to window so we can debug them
  window["wrapper"] = wrapper as any;
  window["vega"] = (wrapper as any).vega;
  window["view"] = view;
});
