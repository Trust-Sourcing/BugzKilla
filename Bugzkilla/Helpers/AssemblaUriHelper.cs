namespace Bugzkilla.Helpers
{
    public class AssemblaUriHelper
    {
        public static string TicketsUrl => "/tickets";
        public static string StatusUrl=> TicketsUrl + "/statuses";
        public static string TagsUrl => "/tags";
        public static string WikiUrl => "/wiki_pages/";
        public static string MilestonesUrl=> "/milestones";
        public static string UsersUrl => "/users";
        public static string TicketCommentsUrl => "/ticket_comments";

    }
}