



const arrow_map = {

  setup(region_geojson, provider_summary_data, base_node){

    this.margin = {top: 50, right: 30, bottom: 30, left: 50},


    this.width = 750 - this.margin.left - this.margin.right,
    this.height = 300 - this.margin.top - this.margin.bottom;

    this.base_node = base_node

    this.svg = base_node.append('svg')
      .attr("viewBox", `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`)
      .classed("svg-content-responsive", true)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");

  },


  render(){
  },
}


const container = d3.select('#root')
  .classed('container', true)



Promise.all([
  d3.json("provider_summary.json"),
  d3.json("geojson/European_Electoral_Regions_(December_2018)_Boundaries_UK_BFC.geojson")
])
.then(([provider_summary_data, region_geojson]) =>{
  console.log(region_geojson);
  arrow_map.setup(region_geojson, provider_summary_data, container)
  arrow_map.render()
})

