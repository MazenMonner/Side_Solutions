using System;

namespace fibonacci
{
    class Program
    {
        static void Main(string[] args)
        {
            int x = 1;
            int y = 0;
            int z ;
            Console.Write("input the n :  ");
            int n = Convert.ToInt32(Console.ReadLine()); 
            for (int i = 0; i < n; i++)
            {
                z = x + y;
                x = y;
                y = z;
                Console.WriteLine(z);
            }


        }
    }
}
