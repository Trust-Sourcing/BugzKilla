using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace Bugzkilla.Helpers
{
    public static class ConfigurationSettingsAccessor
    {
        public static string RecieverEmail => ConfigurationManager.AppSettings["RecieverEmail"] ?? string.Empty;
        public static string SenderEmail => ConfigurationManager.AppSettings["SenderEmail"] ?? string.Empty;
        public static string AssemblaApiKey => ConfigurationManager.AppSettings["AssemblaApiKey"] ?? string.Empty;
        public static string AssemblaApiSecret => ConfigurationManager.AppSettings["AssemblaApiSecret"] ?? string.Empty;
        public static string SenderEmailPassword => ConfigurationManager.AppSettings["SenderEmailPassword"] ?? string.Empty;
        public static string SnapSpaceID => ConfigurationManager.AppSettings["SnapSpaceID"] ?? string.Empty;
        public static string MyFirstSpaceID => ConfigurationManager.AppSettings["MyFirstSpaceID"] ?? string.Empty;
        public static string AssemblaApplicationIdentifier => ConfigurationManager.AppSettings["AssemblaApplicationIdentifier"] ?? string.Empty;
        public static string AssemblaApplicationSecret => ConfigurationManager.AppSettings["AssemblaApplicationSecret"] ?? string.Empty;
    }
}