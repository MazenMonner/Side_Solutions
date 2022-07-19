using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fore
{
    class Program
    {
        static void Main(string[] args)
        {
            double[] data = { 1,2,3,4,5,6,7,8,9,10,9,8,7 };
            int p = 4;
            double[] fore = new double[data.Length - p + 1];
            double sum ;
            double[] ae = new double [fore.Length];
            for(int i = 0; i<fore.Length; i++)
            {
                sum = 0;
                for(int j =i ; j < i+p ; j++)
                {
                    sum = sum + data[j];
                }
                fore[i] = sum / (double)p;
            }
            Console.WriteLine("period"+"\t"+"data"+'\t'+"forecast"+"\t" + "error");
            for(int i = 0; i < data.Length; i++)
            {
                
                if (i < p)
                {
                    Console.WriteLine(i+"\t"+data[i]);
                }
                else
                {
                    ae[i - p] = Math.Abs(data[i] - fore[i - p]) / data[i] * 100;
                    Console.WriteLine(i + "\t" + data[i] + "\t" + fore[i - p]+ "\t"+ae[i - p]);
                }   
            }
            Console.WriteLine(data.Length + "\t" + "\t" + fore[fore.Length-1]);
            Console.WriteLine();
            double c = 0;
            for(int i = 0; i < ae.Length;i++)
            {
                c = ae[i] + c;
            }
            Console.WriteLine("mape =" + c/ae.Length);
            Console.ReadKey();
        }
    }
}
