def add_numbers(a, b):
    return a + b

def find_largest(num1, num2, num3):
    if num1 >= num2 and num1 >= num3:
        return num1
    elif num2 >= num1 and num2 >= num3:
        return num2
    else:
        return num3

def check_even_odd(number=0):
    if number % 2 == 0:
        return "Even"
    return "Odd"

def sum_multiple(*args):
    total = 0
    for num in args:
        total += num
    return total

def display_student_details(**kwargs):
    details_str = ""
    for key, value in kwargs.items():
        details_str += f"{key.capitalize()}: {value} | "
    return details_str.strip(" | ")

def calculate_square(n):
    return n * n

result_add = add_numbers(15, 25)
print("Addition (Positional):", result_add)

result_largest = find_largest(num1=45, num3=82, num2=19)
print("Largest Number (Keyword):", result_largest)

result_even_odd_default = check_even_odd()
result_even_odd_passed = check_even_odd(7)
print("Even/Odd (Default argument used):", result_even_odd_default)
print("Even/Odd (Argument passed):", result_even_odd_passed)

result_sum_multiple = sum_multiple(10, 20, 30, 40, 50)
print("Sum of multiple numbers (*args):", result_sum_multiple)

print("Student Details (**kwargs):")
student_info = display_student_details(name="Jeevitha", age=21, department="CSE")
print(student_info)

result_square = calculate_square(9)
print("Square of number:", result_square)
