# ==========================================
# Python Object Oriented Programming (OOP)
# ==========================================


# =========================================================
# 1. CLASS AND OBJECTS
# =========================================================

# Creating a class named Bottle
class Bottle:

    # Constructor to initialize attributes
    def __init__(self, color, height):
        self.color = color
        self.height = height

    # Method to open the bottle
    def open(self):
        print(f"{self.color} bottle is opened.")

    # Method to close the bottle
    def close(self):
        print(f"{self.color} bottle is closed.")


print("\n========== BOTTLE CLASS EXAMPLE ==========")

# Creating multiple objects for Bottle class
bottle1 = Bottle("Red", 10)
bottle2 = Bottle("Blue", 12)
bottle3 = Bottle("Green", 15)

# Accessing attributes and methods
print(f"Bottle 1 -> Color: {bottle1.color}, Height: {bottle1.height}")
bottle1.open()
bottle1.close()

print()

print(f"Bottle 2 -> Color: {bottle2.color}, Height: {bottle2.height}")
bottle2.open()
bottle2.close()

print()

print(f"Bottle 3 -> Color: {bottle3.color}, Height: {bottle3.height}")
bottle3.open()
bottle3.close()


# =========================================================
# 2. CONSTRUCTOR USING __init__()
# =========================================================

# Creating Student class
class Student:

    # Constructor function
    def __init__(self, student_name, student_age, course):
        self.student_name = student_name
        self.student_age = student_age
        self.course = course

    # Method to display student details
    def display_details(self):
        print(f"Student Name : {self.student_name}")
        print(f"Student Age  : {self.student_age}")
        print(f"Course        : {self.course}")
        print("---------------------------------")


print("\n========== STUDENT CLASS EXAMPLE ==========")

# Creating student objects
student1 = Student("Arun", 20, "Python")
student2 = Student("Priya", 21, "Data Science")
student3 = Student("Kavin", 19, "Web Development")

# Printing student details
student1.display_details()
student2.display_details()
student3.display_details()


# =========================================================
# 3. ENCAPSULATION
# =========================================================

# Creating BankAccount class
class BankAccount:

    # Constructor
    def __init__(self, balance):
        # Private variable using double underscore
        self.__balance = balance

    # Method to deposit amount
    def deposit(self, amount):
        self.__balance += amount
        print(f"Deposited Amount : {amount}")

    # Method to withdraw amount
    def withdraw(self, amount):
        if amount <= self.__balance:
            self.__balance -= amount
            print(f"Withdrawn Amount : {amount}")
        else:
            print("Insufficient Balance")

    # Method to display balance
    def display_balance(self):
        print(f"Current Balance : {self.__balance}")


print("\n========== ENCAPSULATION EXAMPLE ==========")

# Creating object
account = BankAccount(5000)

# Using methods
account.display_balance()
account.deposit(2000)
account.withdraw(1500)
account.display_balance()

print()

# Trying to access private variable outside the class
print("Trying to access private variable directly:")

try:
    print(account.__balance)
except AttributeError as e:
    print("Error:", e)


# =========================================================
# 4. INHERITANCE
# =========================================================

# Parent class
class Animal:

    # Parent method
    def sound(self):
        print("Animals make sounds")


# Child class Dog inheriting Animal
class Dog(Animal):

    # Overriding method
    def sound(self):
        print("Dog barks")


# Child class Cat inheriting Animal
class Cat(Animal):

    # Overriding method
    def sound(self):
        print("Cat meows")


print("\n========== INHERITANCE EXAMPLE ==========")

# Creating child objects
dog = Dog()
cat = Cat()

# Calling inherited methods
dog.sound()
cat.sound()


# =========================================================
# 5. POLYMORPHISM
# =========================================================

# -----------------------------------------
# Method Overriding Example
# -----------------------------------------

# Parent class
class Vehicle:

    def start(self):
        print("Vehicle starts")


# Child class
class Bike(Vehicle):

    # Overriding parent method
    def start(self):
        print("Bike starts with self-start button")


print("\n========== POLYMORPHISM - METHOD OVERRIDING ==========")

vehicle = Vehicle()
bike = Bike()

vehicle.start()
bike.start()


# -----------------------------------------
# Duck Typing Example
# -----------------------------------------

class Sparrow:

    def fly(self):
        print("Sparrow is flying")


class Airplane:

    def fly(self):
        print("Airplane is flying")


# Function using duck typing
def start_flying(object_name):
    object_name.fly()


print("\n========== POLYMORPHISM - DUCK TYPING ==========")

bird = Sparrow()
plane = Airplane()

start_flying(bird)
start_flying(plane)


# =========================================================
# 6. ABSTRACTION
# =========================================================

# Abstraction means hiding internal details
# and showing only essential functionality.

class CoffeeMachine:

    # Public method
    def make_coffee(self):
        print("Making coffee...")
        self.__boil_water()
        self.__add_coffee()
        self.__serve_coffee()

    # Private methods (hidden implementation)
    def __boil_water(self):
        print("Boiling water")

    def __add_coffee(self):
        print("Adding coffee powder")

    def __serve_coffee(self):
        print("Coffee is ready to serve")


print("\n========== ABSTRACTION EXAMPLE ==========")

# Creating object
machine = CoffeeMachine()

# User only accesses essential functionality
machine.make_coffee()