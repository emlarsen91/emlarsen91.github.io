import math

# Item class that stores all necessary item information
class Item :
    # Name required for initialization, all other variables initialized to zero
    def __init__(self, name):
        self.name = name
        self.onHand = 0
        self.stock = 0
        self.needed = 0
    
    # Returns a string describing the item instead of the object pointer
    def __str__(self):
        return (f'Item {self.name} with {self.onHand} items on hand out of a stock of {self.stock}')

    # Function to set stock if called by user
    def getStock(self, stock):
        self.stock = stock
    
    # Function to set on hand when called by user
    def getOnHand(self, onHand):
        self.onHand = onHand
    
    # Calculate the needed items function
    def calculateNeeded(self):
        self.needed = self.stock - self.onHand

class Package(Item):
    def __init__(self, name, stock, onHand, packageSize):
        super().__init__(name)
        self.packageSize = packageSize
        self.onHand = onHand
        self.stock = stock
        self.packageSize = packageSize
        self.neededPackages = 0
    
    def __str__(self):
        return f'{super().__str__()} ({self.neededPackages} of this item needed)'
    
    def calculatePackages(self):
        self.neededPackages = math.ceil((self.stock - self.onHand) / self.packageSize)


# Prints our menu input prompt
def menuPrint():
    print('Do you want to enter a new item? Enter: (y/n)')

#Main Program  Menu loop that will request new items until user chooses to quit
itemList = []
usingProgram = True
while usingProgram == True:
    menuPrint()
    quitPrompt = input()
    if quitPrompt == 'y':
        #Get item name, does accept integer values as it is possible the user may want to use item codes
        print('Enter item name: ')
        nameInput = input()
        print('Is this item purchased in a package? Enter: (y/n)')
        packageInput = input()
        
        #Loop For non packaged items
        if packageInput == 'n':
            inputItem = Item(nameInput)
            
            #Get stock level, catch the error for non integer input and cycle until correct input
            while True:
                print('Enter stock level of item: ')
                try:
                    inputItem.stock = int(input())
                    break
                except ValueError:
                    print('Integer not input, please try again')

            #Get current level, catch error and cycle until correct input
            while True:
                print('Enter current level of item: ')
                try:
                    inputItem.onHand = int(input())
                    break
                except ValueError:
                    print('Integer not input, please try again')
        
            #Perform the needed calculation, add item to the list
            inputItem.calculateNeeded()
            itemList.append(inputItem)


        #Loop for packaged item
        if packageInput == 'y':
            
            #Get stock level, catch the error for non integer input and cycle until correct input
            while True:
                print('Enter stock level of item: ')
                try:
                    stockLevel = int(input())
                    break
                except ValueError:
                    print('Integer not input, please try again')

            #Get current level, catch error and cycle until correct input
            while True:
                print('Enter current level of item: ')
                try:
                    onHandLevel = int(input())
                    break
                except ValueError:
                    print('Integer not input, please try again')
                
            while True:
                print(f'Enter the size of each package of {nameInput}')
                try:
                    itemPackageSize = int(input())
                    break
                except ValueError:
                    print('Integer not input, please try again')
            
            inputItem = Package(nameInput, stockLevel, onHandLevel, itemPackageSize)
        
            #Perform the needed calculation, add item to the list
            inputItem.calculatePackages()
            itemList.append(inputItem)
    #Exit prompt, when n is entered, the user is done 
    elif quitPrompt == 'n':
        usingProgram = False

    else:
        print('Incorrect input, please try again')

#After all input is completed, print the list of needed items
for item in itemList:
    if isinstance(item, Package):
        print(f'{item.neededPackages} packages of {item.name}s needed')
    else:
        print(f'{item.needed} {item.name}s needed')

