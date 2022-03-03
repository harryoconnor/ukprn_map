
import { ProviderMap } from './modules/provider_map.js';


const map_root_node = d3.select('#map_container')
//d3.json("https://martinjc.github.io/UK-GeoJSON/json/eng/topo_eer.json")
//d3.json("provider_summary.json"),
//d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
//d3.json("geojson/European_Electoral_Regions_(December_2018)_Boundaries_UK_BFC.geojson")
//d3.json("topojson/EU-topo.json")
//const regions = topojson.feature(region_topojson, region_topojson.objects.data.geometries);
//d3.json("topojson/EU_topo2.json"),
Promise.all([
  d3.json("provider_summary.json"),
  d3.json("topojson/small_EU_topo.json"),
])
.then(([provider_summary_data, region_topojson]) =>{

  const regions_geojson = topojson.feature(region_topojson, region_topojson.objects["European_Electoral_Regions_(December_2018)_Boundaries_UK_BFC"]);
  console.log(provider_summary_data)
  const active_provider = provider_summary_data.providers[0]
  console.log(active_provider)
  const provider_map = new ProviderMap(map_root_node, regions_geojson, active_provider)
  provider_map.render()

  


})


console.log("main.js")
