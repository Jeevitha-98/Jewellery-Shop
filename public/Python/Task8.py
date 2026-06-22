# -----------------------------------------
# Python – String Formatting & String Methods
# -----------------------------------------

# Create variables
first_name = "Jeevitha"
last_name = "Karunanithi"
city = "Coimbatore"

# f-string formatting
print(f"First Name: {first_name}")
print(f"Last Name: {last_name}")
print(f"City: {city}")

# String Methods
text = "python programming"

print("\n--- String Methods ---")
print("upper():", text.upper())
print("lower():", text.lower())
print("title():", text.title())
print("capitalize():", text.capitalize())

# Whitespace Handling
name = "   Python Language   "

print("\n--- Whitespace Handling ---")
print("Original:", name)
print("strip():", name.strip())
print("lstrip():", name.lstrip())
print("rstrip():", name.rstrip())

# String Splitting and Joining
sentence = "Python is easy to learn"

print("\n--- Split and Join ---")
words = sentence.split()
print("split():", words)

joined_text = "-".join(words)
print("join():", joined_text)

# find(), count(), startswith(), endswith()
message = "python programming python"

print("\n--- Search Methods ---")
print("find('programming'):", message.find("programming"))
print("count('python'):", message.count("python"))
print("startswith('python'):", message.startswith("python"))
print("endswith('python'):", message.endswith("python"))

# String Content Checking
value1 = "12345"
value2 = "Python"
value3 = "Python123"

print("\n--- String Checking Methods ---")
print("isdigit():", value1.isdigit())
print("isalpha():", value2.isalpha())
print("isalnum():", value3.isalnum())

# Escape Characters
print("\n--- Escape Characters ---")
print("Hello\nWorld")
print("Python\tProgramming")


# -----------------------------------------
# Python – Errors & Exception Handling
# -----------------------------------------

print("\n--- Syntax Error Example ---")
# print("Hello"   # Missing closing bracket -> Syntax Error

print("\n--- Runtime Error Example ---")
# x = 10 / 0   # ZeroDivisionError

print("\n--- Logical Error Example ---")
a = 10
b = 5
print("Addition instead of multiplication:", a + b)

# TypeError Example
print("\n--- TypeError Example ---")
try:
    result = "10" + 5
except TypeError as e:
    print("TypeError:", e)

# ValueError Example
print("\n--- ValueError Example ---")
try:
    number = int("abc")
except ValueError as e:
    print("ValueError:", e)

# ZeroDivisionError Example
print("\n--- ZeroDivisionError Example ---")
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print("ZeroDivisionError:", e)

# NameError Example
print("\n--- NameError Example ---")
try:
    print(value)
except NameError as e:
    print("NameError:", e)

# try, except, finally Example
print("\n--- try, except, finally ---")
try:
    num = 10 / 2
    print("Result:", num)
except Exception as e:
    print("Error:", e)
finally:
    print("Execution Completed")

# Division Program Handling Division by Zero
print("\n--- Division Program ---")

try:
    a = int(input("Enter first number: "))
    b = int(input("Enter second number: "))
    
    result = a / b
    
    print("Division Result:", result)

except ZeroDivisionError:
    print("Cannot divide by zero")

finally:
    print("Program Ended")

# User Input Handling Invalid Datatype
print("\n--- User Input Validation ---")

try:
    age = int(input("Enter your age: "))
    print("Your age is:", age)

except ValueError:
    print("Invalid input! Please enter numbers only.")

finally:
    print("Validation Completed")