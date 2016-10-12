using System.Threading.Tasks;
using System.Web.Mvc;
using Bugzkilla.Helpers;

namespace Bugzkilla.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        
        public async Task<ActionResult> Token(string code)
        {
            var assemblaHelper = new AssemblaHelper();
            var token = await assemblaHelper.Token(code);

            Session.Add("Token", token);

            return RedirectToAction("Assembla");
        }

        [Authorize]
        public ActionResult Assembla()
        {
            var isLogged = !string.IsNullOrEmpty((string)Session["Token"]);

            return View(isLogged);
        }

        [Authorize]
        public ActionResult Tool()
        {
            return View();
        }

        [Authorize]
        public ActionResult ExternalTool()
        {
            return View();
        }
    }
}