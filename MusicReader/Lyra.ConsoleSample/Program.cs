﻿namespace Lyra.ConsoleSample
{
    using System;
    using System.IO;
    using WaveParser;

    class Program
    {
        static void Main(string[] args)
        {
            string[] filePrefixies = { "1", "2", "3", "4", "5", "6", "7", "8" };
            StreamWriter writer = new StreamWriter("result.csv", false);
            writer.WriteLine("freq1,freq2,freq3,freq4,freq5,note");
            writer.Close();
            foreach (string filePrefix in filePrefixies) {
                
                
                Audio audio = new Audio(filePrefix + ".wav");
                
                float[][] freqs = audio.GetNMaxAmpFreqs(5);
                writer = new StreamWriter("result.csv", true);
                for (int i = 0; i < freqs.Length; ++i)
                {
                    writer.WriteLine($"{freqs[i][0]},{freqs[i][1]},{freqs[i][2]},{freqs[i][3]},{freqs[i][4]},{filePrefix}");
                }

                writer.Close();
            }
        }
    }
}