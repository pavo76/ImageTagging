using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ImageTagging.Models;

namespace ImageTagging.Controllers
{
    public class ImageMultisController : Controller
    {
        private ImageTaggingContext db = new ImageTaggingContext();

        // GET: ImageMultis
        public ActionResult Index()
        {
            viewModelMultiImage vmMultiImage = new viewModelMultiImage();
            vmMultiImage.image = db.ImageMultis.ToList();
            vmMultiImage.tags = db.Tags.ToList();
            return View(vmMultiImage);
        }

        // GET: ImageMultis/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            viewModelMultiImage vmMultiImage = new viewModelMultiImage();
            vmMultiImage.image = db.ImageMultis.Where(i => i.Id == id).ToList();
            vmMultiImage.tags = db.Tags.Where(tag => tag.ImageMultiId == id).ToList();
            return View(vmMultiImage);
        }

        // GET: ImageMultis/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ImageMultis/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,Name,URL")] ImageMulti imageMulti)
        {
            if (ModelState.IsValid)
            {
                db.ImageMultis.Add(imageMulti);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(imageMulti);
        }

        // GET: ImageMultis/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            viewModelMultiImage vmMultiImage = new viewModelMultiImage();
            vmMultiImage.image = db.ImageMultis.Where(i => i.Id == id).ToList();
            vmMultiImage.tags = db.Tags.Where(tag => tag.ImageMultiId == id).ToList();
            //model.Add(imageMulti);
            //model.Add(db.Tags.Where(tag => tag.ImageMultiId == id).ToList());
            return View(vmMultiImage);
        }

        // POST: ImageMultis/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(viewModelMultiImage vmMultiImage)
        {
            if (ModelState.IsValid)
            {
                db.Entry(vmMultiImage.image[0]).State = EntityState.Modified;
                db.Entry(vmMultiImage.tags[0]).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(vmMultiImage);
        }

        // GET: ImageMultis/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ImageMulti imageMulti = db.ImageMultis.Find(id);
            if (imageMulti == null)
            {
                return HttpNotFound();
            }
            return View(imageMulti);
        }

        // POST: ImageMultis/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            ImageMulti imageMulti = db.ImageMultis.Find(id);
            db.ImageMultis.Remove(imageMulti);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
