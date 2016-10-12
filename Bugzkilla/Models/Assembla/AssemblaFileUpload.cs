using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bugzkilla.Models.Assembla
{
    public class AssemblaFileUpload
    {
        public string Token { get; set; }
        public string SpaceId { get; set; }
        public string TicketId { get; set; }
        public string FileName { get; set; }
        
    }
}
