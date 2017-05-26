using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ImageTagging.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string AreaShape { get; set; }
        public string AreaCoords { get; set; }
        public int ImageMultiId { get; set; }
    }
}