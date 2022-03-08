
import { ProviderMap } from './modules/provider_map.js';


const map_root_node = d3.select('#map_container')

Promise.all([
  d3.json("provider_summary.json"),
  d3.json("topojson/small_EU_topo.json"),
])
.then(([provider_summary_data, region_topojson]) =>{

  //setup map
  const regions_geojson = topojson.feature(region_topojson, 
    region_topojson.objects["European_Electoral_Regions_(December_2018)_Boundaries_UK_BFC"]);
  
  const active_provider = provider_summary_data.providers[0]
  const provider_map = new ProviderMap(map_root_node, regions_geojson)
  provider_map.render()

  //provider_map.set_active_provider(provider_summary_data.providers[0]

  //setup provider datalist
  let provider_datalist = d3.select("#provider_datalist")
  provider_datalist.selectAll('option')
    .data(provider_summary_data.providers)
    .enter()
    .append('option')
    .attr('value', d=>d.name);

  let provider_input = d3.select("#provider_choice")
  provider_input.on("input", function() {
    console.log(this.value)
    let provider_name = this.value
    let provider_array = provider_summary_data.providers.filter(x => x.name == provider_name)
    if (provider_array.length != 0){
      let provider= provider_array[0]
      provider_map.set_active_provider(provider)
    }
  })
    

  


})
