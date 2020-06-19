/**
 *
 * Southern NH University
 * IT - 145 Foundations in Application Development
 * Instructor: Joe Parker
 * Student: Erik Larsen
 * Date: 08/15/18
 *
 * Description:
 * This program contains two methods of reading file data.    
 * Method fileToString places the information from the credential file in a 
 * 2d string array to store the information in the program.
 * Method filePrinter prints all information from a file
 */
package authenticationsystem;

/**
 *
 * @author erik.larsen_snhu
 */
import java.util.Scanner;
import java.io.FileInputStream;
import java.io.IOException;

public class FileReader {
    FileInputStream fileByteStream = null;
    Scanner scnr = null;
    private int colCount;
    private int rowCount;
    private String[][] credentials = new String[6][4];
    private String password1;
    private String password2;
    
    public String[][] fileToString() throws IOException{
        fileByteStream = new FileInputStream("src\\authenticationsystem\\resources\\credentials.txt");
        scnr = new Scanner(fileByteStream);
        
        //Add each column to an array at the point [row][column]
        //Row loop
        for(rowCount = 0; rowCount <= 5; rowCount++){
            colCount = 0;
            //col loop
            while(colCount < 4){
                password1 = scnr.next();
                
                //Concatenate passwords which contain a space to a single string
                if (password1.contains("\"")) {
                    password2 = scnr.next();
                    if (password2.contains("\"")){
                        password1 = password1 + " " + password2;
                        credentials[rowCount][colCount] = password1;
                        colCount++;
                    }
                    // If password does not contain a space  Second entry is entered separately
                    else {
                        credentials[rowCount][colCount] = password1;
                        credentials[rowCount][(colCount + 1)] = password2;
                        colCount = colCount + 2;
                    }
            }
                //for all non password entries just add to array without modification
                else {
                    credentials[rowCount][colCount] = password1;
                    colCount++;
                }
        }
        fileByteStream.close();
    }  
        return credentials;
}
    
    public void filePrinter(String fileName) throws IOException{
        fileByteStream = new FileInputStream(fileName);
        scnr = new Scanner(fileByteStream);
        //Print the information as long as there is more info in the file.
        while(scnr.hasNextLine()) {
            System.out.println(scnr.nextLine());
        }
        
    }
}
