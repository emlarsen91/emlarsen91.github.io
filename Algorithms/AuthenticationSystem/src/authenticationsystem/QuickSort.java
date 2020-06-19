package authenticationsystem;

public class QuickSort {
	
	/* Get an array and assign the pivot point to the last value
	 * After we find the value, we compare through the array and swap if needed
	 * 
	 */
	public String[][]quickSort (String[][] inputArray, int lowerIndex, int upperIndex) {
		String pivot = inputArray[lowerIndex + (upperIndex - lowerIndex) / 2][0];
		int i = lowerIndex;
		int j = upperIndex;
		
		while (i <= j) {
			//While the searching index is "Less than" the pivot keep incrementing
			//This means the item is on the correct side of the pivot
			while (inputArray[i][0].compareToIgnoreCase(pivot) < 0) {
				i++;
			}
			/* While the upper searching index is greater than the pivot, keep decreasing
			 * This means the j items are on the correct side of the pivot
			 */
			while (inputArray[j][0].compareToIgnoreCase(pivot) > 0) {
				j--;
			}
			
			// When we reach two items at the wrong side of the pivot we switch them
			if (i <= j) {
				/* For each item in the row, move it to the temp row
				 * Then move the j item into the i place
				 * Finally move the temp item into the j place swapping all items
				 */
				String temp;
				for (int tempCounter = 0; tempCounter < 4; tempCounter++) {
					temp = inputArray[i][tempCounter];
					inputArray[i][tempCounter] = inputArray[j][tempCounter];
					inputArray[j][tempCounter] = temp;
				}
				//Once swapped, move the counters and continue
				i++;
				j--;
			}
		}
		//If the j value or i value havent reached the end indexes we must call again
		if(lowerIndex < j) {
			quickSort(inputArray, lowerIndex, j);
		}
		if (upperIndex > i) {
			quickSort(inputArray, i, upperIndex);
		}
		return inputArray;
	}
}
