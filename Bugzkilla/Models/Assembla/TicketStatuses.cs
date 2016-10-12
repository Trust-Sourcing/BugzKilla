using Newtonsoft.Json;

namespace Bugzkilla.Models.Assembla
{
    public class TicketStatuses
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        [JsonProperty(PropertyName = "state")]
        public string State { get; set; }
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
        [JsonProperty(PropertyName = "list_order")]
        public string List_order { get; set; }
        
    }
}