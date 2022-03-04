

class ProviderMap {
  constructor(root_node, regions_geojson, active_provider) {
    this.regions_geojson = regions_geojson

    let active_year = 2019

    //setting up svg

    this.margin = {top: 10, right: 10, bottom: 10, left: 10}

    this.width = 750 - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;

    this.active_provider = active_provider

    this.svg = root_node.append('svg')
      .attr("viewBox", `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`)
      .classed("svg-content-responsive", true)

    this.svg.style("background", "rgb(238, 224, 224)");

    this.main_group = this.svg.append("g")
    this.main_group.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    

    let zoomed = ({transform}) =>{
      this.main_group.attr("transform", transform);
    }

    this.svg.call(d3.zoom().on('zoom', zoomed));


    //setting up  map

    this.projection = d3.geoMercator().scale(1000).center([2.4,54]).translate([this.width / 2, this.height / 2]);
    this.pathGenerator = d3.geoPath().projection(this.projection)

    const features = this.regions_geojson.features
    this.main_group.selectAll('path').data(features)
      .enter().append('path')
        .attr("fill", "#69b3a2")
        .attr("d", d3.geoPath()
        .projection(this.projection))
        //.style("stroke", "#fff")


    //drawing circle


  }
  render() {
    //render provider point circle
    this.active_provider.coords = [this.active_provider.longitude,this.active_provider.latitude]

    let circle_selection = this.main_group.selectAll("circle")
      .data([this.active_provider], d=>d.ukprn)
      
    circle_selection.enter()
		  .append("circle")
		    .attr("cx", d => {return this.projection(d.coords)[0]; })
		    .attr("cy", d => { return this.projection(d.coords)[1]; })
		    .attr("r", "1")
		    .attr("fill", "black")

    circle_selection.exit().remove()
    
    //render provider point circle
  }


  set_active_provider(provider){
    this.active_provider = provider
    this.render()
  }
};


export { ProviderMap};