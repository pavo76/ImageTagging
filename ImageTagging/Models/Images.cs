using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ImageTagging.Models
{
    
    public class Images
    {
        public int Id { get; set; }
        public string imgURL { get; set; }
        public string areaShape { get; set; }
        public string areaCoords { get; set; }
        public string tag { get; set; }
    }
}