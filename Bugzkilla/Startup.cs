using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Bugzkilla.Startup))]
namespace Bugzkilla
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
