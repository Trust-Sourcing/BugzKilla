using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Entities.Models
{
    public class BugNeedToSolve
    {
        [JsonProperty(PropertyName = "myFile")]
        public string myFile { get; set; }
        [JsonProperty(PropertyName = "assignedTo")]
        public string assignedTo { get; set; }
        [JsonProperty(PropertyName = "description")]
        public string description { get; set; }
        [JsonProperty(PropertyName = "title")]
        public string title { get; set; }
        [JsonProperty(PropertyName = "priority")]
        public string priority { get; set; }
    }
}