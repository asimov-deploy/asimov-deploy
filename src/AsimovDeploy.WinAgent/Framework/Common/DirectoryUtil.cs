using System.IO;

namespace AsimovDeploy.WinAgent.Framework.Common
{
    public static class DirectoryUtil
    {
        public static void Clean(string directory)
        {
            var dir = new DirectoryInfo(directory);
            foreach (FileInfo file in dir.GetFiles())
                file.Delete();
            
            foreach (DirectoryInfo subDirectory in dir.GetDirectories()) subDirectory.Delete(true);
        }

        public static void CopyDirectory(string sourcePath, string destPath)
        {
            if (!Directory.Exists(destPath))
            {
                Directory.CreateDirectory(destPath);
            }

            foreach (string file in Directory.GetFiles(sourcePath))
            {
                string dest = Path.Combine(destPath, Path.GetFileName(file));
                File.Copy(file, dest, true);
            }

            foreach (string folder in Directory.GetDirectories(sourcePath))
            {
                string dest = Path.Combine(destPath, Path.GetFileName(folder));
                CopyDirectory(folder, dest);
            }
        }

    }
}