using Newtonsoft.Json;

namespace Bugzkilla.Models.Assembla
{
    public class Tags
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        [JsonProperty(PropertyName = "state")]
        public string State { get; set; }
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
    }
}