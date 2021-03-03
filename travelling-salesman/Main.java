import java.io.*;
import java.text.MessageFormat;
import java.util.Arrays;

public class Main {
    public static void main(String args[]) throws Exception {
        File file = new File("./first_part.txt");

        BufferedReader br = new BufferedReader(new FileReader(file));

        String st;
        int size = 0;
        int line = 0;
        double[][] points = new double[0][];
        while ((st = br.readLine()) != null) {
            if (line == 0) {
                System.out.println(MessageFormat.format("There are {0} vertices", st));
                size = Integer.parseInt(st);
                points = new double[size][2];
            } else {
                points[line-1] = Arrays.stream(st.split("\\s+")).mapToDouble(Double::parseDouble).toArray();
            }
            line++;
        }

        double[][] dist = new double[size][size];

        for (int i = 0; i < points.length; ++i) {
            for (int j = 0; j <= i; ++j) {
                if (i == j) {
                    dist[i][j] = 0;
                } else {
                    double a = points[i][0] - points[j][0];
                    double b = points[i][1] - points[j][1];
                    double val = Math.sqrt(a*a + b*b);
                    dist[i][j] = val;
                    dist[j][i] = val;
                }
            }
        }
//        for (int i = 0; i < points.length; ++i) {
//            System.out.println(Arrays.toString(dist[i]));
//        }
        double TSPlen = new TravelingSalesmanHeldKarp().minCost(dist);
        System.out.println(MessageFormat.format("Shortest TSP length: {0}", String.format("%.12f",TSPlen)));
        double dist11_12 = dist[11][12];
        System.out.println(MessageFormat.format("Distance 11-12: {0}",String.format("%.12f",dist11_12)));
    }
}

/*
x = [20833.3333,20900.0000,21300.0000,21600.0000,21600.0000,21600.0000,22183.3333,22583.3333,22683.3333
,23616.6667,23700.0000,23883.3333,24166.6667,25149.1667,26133.3333,26150.0000,26283.3333,26433.3333
,26550.0000,26733.3333,27026.1111,27096.1111,27153.6111,27166.6667,27233.3333]

y = [17100.0000,17066.6667,13016.6667,14150.0000,14966.6667,16500.0000,13133.3333,14300.0000,12716.6667
,15866.6667,15933.3333,14533.3333,13250.0000,12365.8333,14500.0000,10550.0000,12766.6667,13433.3333
,13850.0000,11683.3333,13051.9444,13415.8333,13203.3333,9833.3333,10450.0000]
* */