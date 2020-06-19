/**
 *
 * Southern NH University
 * IT - 145 Foundations in Application Development
 * Instructor: Joe Parker
 * Student: Erik Larsen
 * Date: 08/15/18
 *
 * Description:
 * This program obtains a username and password from the user.    
 * This password is put through a MD5 hash.
 * MD5 hash password and username are compared to a credential file.
 * A successful match logs the patient in and assigns them a role.
 * This role will print information from an associated text file.
 *
 */
package authenticationsystem;

import java.io.IOException;
import java.util.Arrays;
import java.util.Scanner;
import java.security.MessageDigest;


/**
 *
 * @author erik.larsen_snhu
 */
public class AuthenticationSystem {

    /**
     * @param args the command line arguments
     * @throws java.io.IOException
     */

    
    
    public static void main(String[] args) throws IOException, Exception {
        FileReader fileTester = new FileReader();
        String[][] testString = new String[6][4];
        testString = fileTester.fileToString();
        LoginComparison compareLogins = new LoginComparison();
        // Initialize quicksort and sort the credentials file
        QuickSort quickSort = new QuickSort();
        String[][] sortedCredentials = quickSort.quickSort(testString, 0, 5);
        String username;
        String password;
        String original;
        String digested;
        String userRole = "";
        boolean login;
        int loginCounter = 0;
        Scanner scnr = new Scanner(System.in);
        String logoutPrompt = "";
        
        
        login = false;
        //Run program as long as the user hasn't been logged in.
        while(false == login) {
            //Allow for 3 Login Attempts
            for(loginCounter = 0; loginCounter < 3; loginCounter++){
                
                //Get Username input
                System.out.println("Enter username (type quit to quit): ");
                username = scnr.nextLine();
                
                //Allow a user to exit while attempting to log
                if("quit".equals(username)){
                    userRole = "quit";
                    break;
                }
                
                //Get password input
                System.out.println("Enter password: ");
                password = scnr.nextLine();
                
                //MD5 password conversion
                original = password;
                MessageDigest md = MessageDigest.getInstance("MD5");
                md.update(original.getBytes());
                byte[] digest = md.digest();
                StringBuffer sb = new StringBuffer();
                for(byte b : digest) {
                    sb.append(String.format("%02x", b & 0xff));
                }
                digested = sb.toString();
                
                //Check the user role 
                userRole = compareLogins.comparePasswords
                (username, digested, sortedCredentials, 0, 5);
                
                //Exit the for loop if the user has logged in
                if(!"".equals(userRole)){
                    break;
                }
                }
            //Set an unauthorized role for users who fail 3 login attempts
            if("".equals(userRole)){
            userRole = "Unauthorized";  
            }
            
        /*Based on the assigned role either log the user out
        or Print the file and allow them to continue on
        In this case the only option to continue is to log out due to the lack
        of additional functionality needed for this project*/
        switch(userRole){
            //Unauthorized users are booted from system
            case "Unauthorized":
                System.out.print("Unauthorized user!  Logging out.");
                login = true;
                break;
            //Zookeepers are shown the zookeeper file and given the option to
            //log out
            case "zookeeper":
                fileTester.filePrinter("src\\authenticationsystem\\resources\\zookeeper.txt");
                System.out.println("********");
                while(!"quit".equals(logoutPrompt)){
                    System.out.println("Type quit to exit program");
                    logoutPrompt = scnr.next();
                }
                login = true; 
                break;
            //admin printed admin file
            case "admin":
                fileTester.filePrinter("src\\authenticationsystem\\resources\\admin.txt");
                System.out.println("********");
                while(!"quit".equals(logoutPrompt)){
                    System.out.println("Type quit to exit program");
                    logoutPrompt = scnr.next();
                }
                login = true; 
                break;
            //vet printed vet file
            case "veterinarian":
                fileTester.filePrinter("src\\authenticationsystem\\resources\\veterinarian.txt");
                System.out.println("********");
                while(!"quit".equals(logoutPrompt)){
                    System.out.println("Type quit to exit program");
                    logoutPrompt = scnr.next();
                }
                login = true; 
                break;
            //since the user wanted to quit before login occurred they are logged out
            case "quit":
                System.out.println("Logging Out");
                login = true;
                break;
            //Default case for issues in credentials file with the role
            default:
                System.out.println("Error improper role.  Contact admin");
            }
        }
    }
}
    