using Newtonsoft.Json;

namespace Bugzkilla.Models.Assembla
{
    public class Milestone
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        [JsonProperty(PropertyName = "description")]
        public string Description { get; set; }
        [JsonProperty(PropertyName = "title")]
        public string Title { get; set; }
    }
}
