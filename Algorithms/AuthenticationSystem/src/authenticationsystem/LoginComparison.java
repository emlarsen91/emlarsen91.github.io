/**
 *
 * Southern NH University
 * IT - 145 Foundations in Application Development
 * Instructor: Joe Parker
 * Student: Erik Larsen
 * Date: 08/15/18
 *
 * Description:
 * This program compares two string inputs with a 2d array containing user info.    
 * The username is compared with the username row and password with password row.
 * If the username and password match the role associated with the user is assigned.
 */
package authenticationsystem;

/**
 *
 * @author erik.larsen_snhu
 */
public class LoginComparison {
    private int midpoint;
    private String role;

    //Check the data with a binary search to ensure the username is present
    public String comparePasswords(String username, String password, 
            String[][]credentials, int lowIndex, int highIndex) {
        role = "";
        midpoint = ((lowIndex + highIndex) / 2);
        //If the midpoint is the username, compare the password ans return role if correct
    	if (credentials[midpoint][0].compareToIgnoreCase(username) == 0){
    		if (credentials[midpoint][1].contains(password)) {
    			role = credentials[midpoint][3];
    		}
    	}
    	//If the username is less than the midpoint, run again with new high and low points
    	else if (credentials[midpoint][0].compareToIgnoreCase(username) > 0){
    		comparePasswords(username, password, credentials, lowIndex, (midpoint - 1));
    	}
    	
    	//If username is greater, run recursively with the upper half
    	else if (credentials[midpoint][0].compareToIgnoreCase(username) < 0){
    		comparePasswords(username, password, credentials, (midpoint + 1), highIndex);
    	}
    	
        return role;
    }
}