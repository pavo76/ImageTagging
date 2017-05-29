using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ImageTagging.Models
{
    public class viewModelMultiImage
    {
        public List<ImageMulti> image { get; set; }
        public List<Tag> tags { get; set; }
    }
}