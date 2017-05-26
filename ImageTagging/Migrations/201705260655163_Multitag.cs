namespace ImageTagging.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Multitag : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ImageMultis",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        URL = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.ImageMultis");
        }
    }
}
