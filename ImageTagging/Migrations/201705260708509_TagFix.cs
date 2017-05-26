namespace ImageTagging.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TagFix : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Tags", "ImageMultiId", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Tags", "ImageMultiId", c => c.String());
        }
    }
}
