using System.Collections.Generic;
using Newtonsoft.Json;

namespace Bugzkilla.Models
{
    public class Ticket
    {
        [JsonProperty(PropertyName = "id")]
        public string id { get; set; }
        [JsonProperty(PropertyName = "summary")]
        public string summary { get; set; }
        [JsonProperty(PropertyName = "priority")]
        public string priority { get; set; }
        [JsonProperty(PropertyName = "assigned_to_id")]
        public string assigned_to_id { get; set; }
        [JsonProperty(PropertyName = "description")]
        public string description { get; set; }
        [JsonProperty(PropertyName = "milestone_id")]
        public string milestone_id { get; set; }
        [JsonProperty(PropertyName = "number")]
        public string number { get; set; }
        [JsonProperty(PropertyName = "status")]
        public string status { get; set; }
        [JsonProperty(PropertyName = "tags")]
        public string[] tags { get; set; }
    }

    public class CreateTicket
    {
        [JsonProperty(PropertyName = "ticket")]
        public Ticket ticket { get; set; }
    }
}
