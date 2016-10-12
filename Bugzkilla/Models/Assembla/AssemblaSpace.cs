using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace Bugzkilla.Models.Assembla
{
    public class AssemblaSpace
    {
        public string Id { get; set; }
        public string Name { get; set; }

        [JsonProperty(PropertyName = "wiki_name")]
        public string WikiName { get; set; }
    }
}
