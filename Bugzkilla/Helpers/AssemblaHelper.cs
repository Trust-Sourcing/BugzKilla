using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Bugzkilla.Models.Assembla;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Bugzkilla.Helpers
{
    public class AssemblaHelper
    {
        private readonly string _spaceUri = "v1/spaces/";

        public async Task<string> Token(string code)
        {
            HttpResponseMessage response;

            using (var client = new HttpClient())
            {
                var parturi = $"token?grant_type=authorization_code&code={code}";
                client.BaseAddress = new Uri("http://" + ConfigurationSettingsAccessor.AssemblaApplicationIdentifier + ":" + ConfigurationSettingsAccessor.AssemblaApplicationSecret + "@api.assembla.com/");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.GetEncoding("ISO-8859-1").
                    GetBytes(ConfigurationSettingsAccessor.AssemblaApplicationIdentifier + ":" + ConfigurationSettingsAccessor.AssemblaApplicationSecret)));

                response = await client.PostAsync("https://api.assembla.com/" + parturi, new StringContent(""));
            }

            if (!response.IsSuccessStatusCode) return string.Empty;

            var responseJson = JObject.Parse(response.Content.ReadAsStringAsync().Result);

            return responseJson["access_token"].ToString();
        }

        public async Task<string> GetRequest(string partOfUri, string token)
        {
            var str = string.Empty;
            var uri = _spaceUri + partOfUri;

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://api.assembla.com/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", "Bearer " + token);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage response = await client.GetAsync(uri);
                if (response.IsSuccessStatusCode)
                    str = await response.Content.ReadAsStringAsync();

                return str;
            }
        }

        public async Task<string> PutRequest(string partOfUri, string token, dynamic putBody)
        {
            var str = string.Empty;
            var uri = _spaceUri + partOfUri;

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://api.assembla.com/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", "Bearer " + token);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var put = JsonConvert.SerializeObject(putBody);

                HttpResponseMessage response = await client.PutAsync(uri, new StringContent(put, Encoding.UTF8, "application/json"));
                if (response.IsSuccessStatusCode)
                    str = await response.Content.ReadAsStringAsync();

                return str;
            }
        }

        public async Task<string> PostRequest(string partOfUri, string token, dynamic postBody)
        {
            var str = string.Empty;
            var uri = _spaceUri + partOfUri;

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://api.assembla.com/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", "Bearer " + token);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var post = JsonConvert.SerializeObject(postBody);
                
                var response = await client.PostAsync(uri, new StringContent(post, Encoding.UTF8, "application/json"));

                if (response.IsSuccessStatusCode)
                    str = await response.Content.ReadAsStringAsync();

                return str;
            }
        }

        public async Task<HttpResponseMessage> UploadFile(AssemblaFileUpload fileUpload, string filepath)
        {

            var url = "v1/spaces/" + fileUpload.SpaceId + "/documents.json";
            var path = Path.Combine(filepath, fileUpload.FileName + ".png");

            var nvc = new[]
            {
                new KeyValuePair<string, string>("document[attachable_type]", "Ticket"),
                new KeyValuePair<string, string>("document[attachable_id]", fileUpload.TicketId)
            };

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://bigfiles.assembla.com/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", "Bearer " + fileUpload.Token);

                var content = new MultipartFormDataContent();
                var fileContent = new ByteArrayContent(File.ReadAllBytes(path));

                content.Add(fileContent, "document[file]", fileUpload.FileName + ".png");

                foreach (var keyValuePair in nvc)
                {
                    content.Add(new StringContent(keyValuePair.Value), keyValuePair.Key);
                }
                content.Add(new StringContent(fileUpload.FileName), "document[name]");
                
                HttpResponseMessage response = await client.PostAsync(url, content);
                if (response.IsSuccessStatusCode)
                    return new HttpResponseMessage(response.StatusCode);

                return new HttpResponseMessage(HttpStatusCode.OK);
            }
        }//HttpUploadFile

        public void UploadLocal(string myFile, string title, string filepath) //string
        {
            var message = string.Empty;
            
            if (string.IsNullOrEmpty(myFile)) return;

            var dataWithoutJpegMarker = myFile.Replace("data:image/png;base64,", string.Empty);
            var filebytes = Convert.FromBase64String(dataWithoutJpegMarker);
            var writePath = Path.Combine(filepath, title + ".png");


            if (filebytes.Length <= 0) return;
            try
            {
                using (var fs = new FileStream(writePath,FileMode.OpenOrCreate,FileAccess.Write,FileShare.None))
                {
                    fs.Write(filebytes, 0, filebytes.Length);
                }
                    
            }
            catch (Exception e)
            {
                message = "File upload failed! Please try again! Error: " + e.Message;
            }
            //   else
         //   message = "Null: ";
            
          //  return message;

        }

    }
}