﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace ImageTagging.Models
{
    public class ImageTaggingContext : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx
    
        public ImageTaggingContext() : base("name=ImageTaggingContext")
        {
        }

        public System.Data.Entity.DbSet<ImageTagging.Models.Images> Images { get; set; }

        public System.Data.Entity.DbSet<ImageTagging.Models.ImageMulti> ImageMultis { get; set; }

        public System.Data.Entity.DbSet<ImageTagging.Models.Tag> Tags { get; set; }
    }
}
