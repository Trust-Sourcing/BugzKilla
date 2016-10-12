using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Bugzkilla.Models.Assembla
{
    public class WikiPage
    {
        public string Id { get; set; }
        [JsonProperty(PropertyName = "page_name")]
        public string PageName { get; set; }

        public string Contents { get; set; }

    }
}
