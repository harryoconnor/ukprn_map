

class ProviderMap {

  constructor(root_node, regions_geojson) {

    this.test_data = regions_geojson
    this.root_node = root_node
    this.active_year = "2018/19"

    this.width = 750 
    this.height = 400 
    this.active_provider = null
    this.active_provider_data = null

    this.svg = null
    this.setup_svg()

    this.projection = d3.geoMercator().scale(1000).center([2.4,54]).translate([this.width / 2, this.height / 2]);
    this.pathGenerator = d3.geoPath().projection(this.projection)

    this.colorScale = d3.scaleLinear().domain([0, 100]).range(["#F7FBFF", "#08306B"]);

    this.regions=null
    this.setup_regions(regions_geojson)


    this.tool_tip = d3.select("body").append("div")
    .attr("class", "tooltip-donut")
    .style("opacity", 0);



  }

  setup_regions(regions_geojson){
    this.regions = []
    for (let feature of regions_geojson.features){
      let region = 
      {
        geojson_feature:feature, 
        active_data: {count_percentage:50},
        name : feature.properties.eer18nm
      }
      this.regions.push(region)
    }
  }

  setup_svg(){
    this.svg = this.root_node.append('svg')
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .classed("svg-content-responsive", true)

    this.svg.style("background", "rgb(238, 224, 224)");

    this.main_group = this.svg.append("g");

    let zoomed = ({transform}) =>{
      this.main_group.attr("transform", transform);
    }

    this.svg.call(d3.zoom().on('zoom', zoomed));

  }



  render() {
  
    this.render_map()
    if (this.active_provider != null){
      this.render_provider_circle()
    }
  }

  render_map(){
    let _this=this

    var tooltip = d3.select('body').append('div')
      .attr('class', 'hidden tooltip');

    let path_selection = this.main_group.selectAll('path').data(this.regions)

    path_selection
      .enter().append('path')
    .attr("stroke-width","0.05")
    .attr("stroke","black")
    .attr("fill", region=>{
      return this.colorScale(region.active_data.count_percentage)
    })
    .attr("d", d=>this.pathGenerator(d["geojson_feature"]))
    .on('mouseover', function (mouse_event,event_region){
      d3.select(this).transition()
      .duration('50')
      .attr('opacity', '.85');
      if (_this.active_provider != null){
        _this.tool_tip.transition()
        .duration(50)
        .style("opacity", 1);
          
        console.log(event_region)
        let name = "<li>" + event_region.name + "</li>"
        let count_percentage = "<li> Percentage:" + event_region.active_data.count_percentage.toFixed(1) + "%</li>"
        let student_count = "<li> Student count:" +String(event_region.active_data.total_count) + "</li>"
        let tool_tip_list = "<ul>" + name + count_percentage+student_count+"</ul>"
        _this.tool_tip.html(tool_tip_list)
        .style("left", (mouse_event.clientX+ 10) + "px")
        .style("top", (mouse_event.clientY - 15) + "px");
      }
    })
    .on('mousemove', function (mouse_event,event_region){
      _this.tool_tip
      .style("left", (mouse_event.clientX+ 10) + "px")
      .style("top", (mouse_event.clientY - 15) + "px");
    })
          
    .on('mouseout', function (event,event_region) {
      d3.select(this).transition()
        .duration('50')
        .attr('opacity', '1');
      _this.tool_tip.transition()
        .duration(50)
        .style("opacity", 0);
      })


    //updates data
    path_selection
      .attr("fill", region=>{
        return this.colorScale(region.active_data.count_percentage)})

  }

  render_provider_circle(){
    this.active_provider.coords = [this.active_provider.longitude,this.active_provider.latitude]

    let circle_selection = this.main_group.selectAll("circle")
      .data([this.active_provider], d=>d.ukprn)
      
    circle_selection.enter()
		  .append("circle")
		    .attr("cx", d => {return this.projection(d.coords)[0]; })
		    .attr("cy", d => { return this.projection(d.coords)[1]; })
		    .attr("r", "2")
		    .attr("fill", "yellow")


    circle_selection.exit().remove()
  }


  set_active_provider(provider){
    this.active_provider = provider

    const data_file = "arrow_map_data/data"+provider.ukprn+".json"
    d3.json(data_file).then( data=>{
      this.active_provider_data=data;
      this.set_region_data()
      this.render();
    })
  }

  set_region_data(){

    let years = this.active_provider_data.years

    let regions_data = years.filter(d=>d.year==this.active_year)[0].regions
 
    for (let region of this.regions){

      let region_data = regions_data.filter(d=>d.domicile_region==region.name)[0]
      console.log(region_data)
      region.active_data=region_data
    }
  }

};


export { ProviderMap};