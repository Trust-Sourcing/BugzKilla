using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Mvc;
using Newtonsoft.Json;
using Bugzkilla.Helpers;
using Bugzkilla.Models;
using Bugzkilla.Models.Assembla;

namespace Bugzkilla.Controllers
{
    public class AssemblaController : Controller
    {

        private static readonly AssemblaHelper AssemblaHelper = new AssemblaHelper();

        [HttpGet]
        public async Task<JsonResult> GetSpaces()
        {
            var token = (string)Session["Token"];

            var requestedSpaces = await AssemblaHelper.GetRequest("", token);

            var model = JsonConvert.DeserializeObject<List<AssemblaSpace>>(requestedSpaces);

            if (model == null)
            {
                Session["current_space"] = null;
            }
            return Json(new { Spaces = model }, JsonRequestBehavior.AllowGet);

        }

        [HttpGet]
        public async Task<JsonResult> GetStatuses()
        {
            var spaceId = (string)Session["current_space"];
            if (string.IsNullOrEmpty(spaceId))
                return Json(new { response = "Choose space first" }, JsonRequestBehavior.AllowGet);

            var token = (string)Session["Token"];

            var uri = spaceId + AssemblaUriHelper.StatusUrl;

            var statuses = await AssemblaHelper.GetRequest(uri, token);
            var model = JsonConvert.DeserializeObject<List<TicketStatuses>>(statuses);

            return Json(new { ListOfStatuses = model }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public async Task<JsonResult> UpdateStatus(Ticket ticket)
        {
            var spaceId = (string)Session["current_space"];
            var token = (string)Session["Token"];
            var uri = spaceId + AssemblaUriHelper.TicketsUrl + "/" + ticket.number;
            var ticketModel = new { ticket = new { status = ticket.status } };

            var createdTicket = await AssemblaHelper.PutRequest(uri, token, ticketModel);
            var model = JsonConvert.DeserializeObject<Ticket>(createdTicket);

            return Json(new { ticket = model }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public async Task<JsonResult> AddCommentToTicket(string comment, string ticketNumber)
        {
            var spaceId = (string)Session["current_space"];
            var token = (string)Session["Token"];
            var uri = spaceId + AssemblaUriHelper.TicketsUrl + "/" + ticketNumber + AssemblaUriHelper.TicketCommentsUrl;

            var ticketModel = new { ticket_comment = new { comment = comment } };

            var response = await AssemblaHelper.PostRequest(uri, token, ticketModel);
            
            return Json(new { response = response }, JsonRequestBehavior.AllowGet);
        }



        [HttpGet]
        public async Task<JsonResult> GetTags()
        {
            var spaceId = (string)Session["current_space"];
            if (string.IsNullOrEmpty(spaceId))
                return Json(new { response = "Choose space first" }, JsonRequestBehavior.AllowGet);

            var token = (string)Session["Token"];

            var uri = spaceId + AssemblaUriHelper.TagsUrl;

            var tags = await AssemblaHelper.GetRequest(uri, token);
            var model = JsonConvert.DeserializeObject<List<Tags>>(tags);

            return Json(new { ListOfTags = model }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public HttpResponseMessage SetDefaultSpace(string space)
        {
            Session.Add("current_space", space);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        [HttpGet]
        public async Task<JsonResult> GetWiki(string wikiId)
        {
            var token = (string)Session["Token"];
            var spaceId = (string)Session["current_space"];
            var URI = spaceId + AssemblaUriHelper.WikiUrl + wikiId; //+ space.WikiName;

            var wikipages = await AssemblaHelper.GetRequest(URI, token);

            var model = JsonConvert.DeserializeObject<List<WikiPage>>(wikipages);

            return Json(new { wikiPages = model }, JsonRequestBehavior.AllowGet);

        }

        // GET: AssemblaGetTickets
        [HttpGet]
        public async Task<JsonResult> GetTickets()
        {
            var spaceId = (string)Session["current_space"];
            if (string.IsNullOrEmpty(spaceId))
                return Json(new { response = "Choose space first" });

            var token = (string)Session["Token"];

            var uri = spaceId + AssemblaUriHelper.TicketsUrl;

            var tikets = await AssemblaHelper.GetRequest(uri, token);
            var model = JsonConvert.DeserializeObject<List<Ticket>>(tikets);

            return Json(new { ListOfTickets = model }, JsonRequestBehavior.AllowGet);

        }

        // GET: AssemblaGetUsersFromSpace
        [HttpGet]
        public async Task<JsonResult> GetUsers()
        {
            var spaceId = (string)Session["current_space"];

            if (string.IsNullOrEmpty(spaceId))
                return Json(new { response = "Choose space first" });

            var token = (string)Session["Token"];
            var uri = spaceId + AssemblaUriHelper.UsersUrl;

            var users = await AssemblaHelper.GetRequest(uri, token);
            var model = JsonConvert.DeserializeObject<List<AssemblaUser>>(users);

            return Json(new { ListOfUsers = model }, JsonRequestBehavior.AllowGet);
        }

        //GET /v1/spaces/[space_id]/milestones
        [HttpGet]
        public async Task<JsonResult> GetMilestone()
        {
            var spaceId = (string)Session["current_space"];

            if (string.IsNullOrEmpty(spaceId))
                return Json(new { response = "Choose space first" });

            var token = (string)Session["Token"];
            var uri = spaceId + AssemblaUriHelper.MilestonesUrl;

            var milestones = await AssemblaHelper.GetRequest(uri, token);
            var model = JsonConvert.DeserializeObject<List<Milestone>>(milestones);

            return Json(new { ListOfMilestones = model }, JsonRequestBehavior.AllowGet);
        }

        // Post: AssemblaGetTickets   POST /v1/spaces/[space_id]/tickets
        [HttpPost]
        public async Task<JsonResult> CreateTicket(Ticket ticket)
        {
            var spaceId = (string)Session["current_space"];
            var token = (string)Session["Token"];
            var uri = spaceId + AssemblaUriHelper.TicketsUrl;
            var ticketModel = new CreateTicket
            {
                ticket = ticket
            };

            var createdTicket = await AssemblaHelper.PostRequest(uri, token, ticketModel);
            var model = JsonConvert.DeserializeObject<Ticket>(createdTicket);

            return Json(new { ticket = model }, JsonRequestBehavior.AllowGet);
        }

        //  PUT /v1/spaces/:space_id/tickets/:number
        [HttpPost]
        public async Task<JsonResult> UpdateTicket(Ticket ticket)
        {
            var spaceId = (string)Session["current_space"];
            var token = (string)Session["Token"];
            var uri = spaceId + AssemblaUriHelper.TicketsUrl + "/" + ticket.number;
            var ticketModel = new CreateTicket
            {
                ticket = ticket
            };

            var updatedTicket = await AssemblaHelper.PutRequest(uri, token, ticketModel);
            var model = JsonConvert.DeserializeObject<Ticket>(updatedTicket);

            return Json(new { ticket = model }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AttachFile(string ticketId, List<string> fileNames)
        {
            var spaceId = (string)Session["current_space"];
            var token = (string)Session["Token"];

            var tcs = new TaskCompletionSource<object>();
            Task task = tcs.Task;

            foreach (var fileName in fileNames)
            {
                var file = new AssemblaFileUpload
                {
                    FileName = fileName,
                    SpaceId = spaceId,
                    Token = token,
                    TicketId = ticketId
                };

                task = task.ContinueWith(t => AssemblaHelper.UploadFile(file, Server.MapPath("~/UploadedFiles/")));
            }
            tcs.SetResult(null);

            return Json(new { response = new HttpResponseMessage(HttpStatusCode.Created) }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UploadFile(List<string> listSrc)
        {
            var titles = new List<string>();
            foreach (var src in listSrc)
            {
                var title = DateTime.Now.ToString("yy-mm-dd-hh-mm-ss") + listSrc.IndexOf(src);
                titles.Add(title);
                AssemblaHelper.UploadLocal(src, title, Server.MapPath("~/UploadedFiles/"));
            }

            return Json(new { titles }, JsonRequestBehavior.AllowGet);
        }

    }
}
