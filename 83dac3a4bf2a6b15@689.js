// https://observablehq.com/@d3/dot-plot@689
import define1 from "./a33468b95d0b15b0@703.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["us-population-state-age.csv",new URL("./files/cacf3b872e296fd3cf25b9b8762dc0c3aa1863857ecba3f23e8da269c584a4cea9db2b5d390b103c7b386586a1104ce33e17eee81b5cc04ee86929f1ee599bfe",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Dot Plot

Percentage of population by age and state. Data: [American Community Survey](/@mbostock/working-with-the-census-api)`
)});
  main.variable(observer("viewof primary")).define("viewof primary", ["html","data"], function(html,data)
{
  const form = html`<form style="font: 12px var(--sans-serif); display: flex; align-items: center; min-height: 33px;"><label>Order by <select name=i>${Array.from(data.columns, key => html`
  <option>${document.createTextNode(key)}</option>`).reverse()}
</select></label></form>`;
  const timeout = setTimeout(() => {
    form.i.selectedIndex = 0;
    form.onchange();
  }, 2000);
  form.onchange = () => {
    clearTimeout(timeout);
    form.value = form.i.value;
    form.dispatchEvent(new CustomEvent("input"));
  };
  form.i.selectedIndex = form.i.options.length - 1;
  form.value = form.i.value;
  return form;
}
);
  main.variable(observer("primary")).define("primary", ["Generators", "viewof primary"], (G, _) => G.input(_));
  main.variable(observer()).define(["legend","color"], function(legend,color){return(
legend({title: "Age (years)", color, tickSize: 0})
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","xAxis","data","y","x","keys","color"], function(d3,width,height,xAxis,data,y,x,keys,color)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
      .call(xAxis);

  const g = svg.append("g")
      .attr("text-anchor", "end")
      .style("font", "10px sans-serif")
    .selectAll("g")
    .data(data)
    .join("g")
      .attr("transform", (d, i) => `translate(0,${y(d.name)})`);

  g.append("line")
      .attr("stroke", "#aaa")
      .attr("x1", d => x(d3.min(keys, k => d[k])))
      .attr("x2", d => x(d3.max(keys, k => d[k])));

  g.append("g")
    .selectAll("circle")
    .data(d => d3.cross(keys, [d]))
    .join("circle")
      .attr("cx", ([k, d]) => x(d[k]))
      .attr("fill", ([k]) => color(k))
      .attr("r", 3.5);

  g.append("text")
      .attr("dy", "0.35em")
      .attr("x", d => x(d3.min(keys, k => d[k])) - 6)
      .text((d, i) => d.name);

  return Object.assign(svg.node(), {
    update(names) {
      y.domain(names);

      g.transition()
          .delay((d, i) => i * 10)
          .attr("transform", d => `translate(0,${y(d.name)})`)
    }
  });
}
);
  main.variable(observer("update")).define("update", ["d3","data","primary","chart"], function(d3,data,primary,chart)
{
  const index = d3.range(data.length);
  const order = primary === "name" ? d3.ascending : d3.descending;
  index.sort((i, j) => order(data[i][primary], data[j][primary]));
  chart.update(d3.permute(data.map(d => d.name), index));
}
);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("us-population-state-age.csv").text(), (d, i, columns) => (d3.autoType(d), d.total = d3.sum(columns, c => d[c]), columns.slice(1).forEach(c => d[c] /= d.total), d))
)});
  main.variable(observer("keys")).define("keys", ["data"], function(data){return(
data.columns.slice(1)
)});
  main.variable(observer("x")).define("x", ["d3","data","keys","margin","width"], function(d3,data,keys,margin,width){return(
d3.scaleLinear()
    .domain([0, d3.max(data, d => d3.max(keys, k => d[k]))])
    .rangeRound([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","data","margin","height"], function(d3,data,margin,height){return(
d3.scalePoint()
    .domain(data.map(d => d.name).sort(d3.ascending))
    .rangeRound([margin.top, height - margin.bottom])
    .padding(1)
)});
  main.variable(observer("color")).define("color", ["d3","keys"], function(d3,keys){return(
d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeSpectral[keys.length])
    .unknown("#ccc")
)});
  main.variable(observer("xAxis")).define("xAxis", ["margin","d3","x","height"], function(margin,d3,x,height){return(
g => g
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x).ticks(null, "%"))
    .call(g => g.selectAll(".tick line").clone().attr("stroke-opacity", 0.1).attr("y2", height - margin.bottom))
    .call(g => g.selectAll(".domain").remove())
)});
  main.variable(observer("height")).define("height", ["data"], function(data){return(
data.length * 16
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 20, right: 10, bottom: 10, left: 10}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  const child1 = runtime.module(define1);
  main.import("legend", child1);
  return main;
}
