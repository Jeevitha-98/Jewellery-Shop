import mysql.connector
from mysql.connector import Error
import sys

def connect_to_database():
    """Establishes and returns a connection to the MySQL database."""
    try:
        # UPDATE: Change "your_password_here" to your actual MySQL root password
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Jeevi98", 
            database="notes_db"
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"\n❌ Database Connection Error: {e}")
        print("Please check your MySQL server status and user credentials.")
        return None

def add_note():
    """CREATE Operation: Adds a new note to the database."""
    print("\n--- 📝 Add New Note ---")
    title = input("Enter Note Title: ").strip()
    if not title:
        print("❌ Error: Title cannot be empty.")
        return

    content = input("Enter Note Content: ").strip()
    if not content:
        print("❌ Error: Content cannot be empty.")
        return

    connection = connect_to_database()
    if connection is None:
        return

    try:
        cursor = connection.cursor()
        query = "INSERT INTO notes (title, content) VALUES (%s, %s)"
        cursor.execute(query, (title, content))
        connection.commit()
        print(f"\n✅ Success: Note added successfully! (ID: {cursor.lastrowid})")
    except Error as e:
        print(f"❌ Failed to insert record: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def view_all_notes():
    """READ Operation: Fetches and displays all notes from the database."""
    print("\n--- 📋 All Stored Notes ---")
    connection = connect_to_database()
    if connection is None:
        return

    try:
        cursor = connection.cursor()
        query = "SELECT note_id, title, content, updated_at FROM notes ORDER BY updated_at DESC"
        cursor.execute(query)
        records = cursor.fetchall()

        if not records:
            print("ℹ️ Your digital notebook is empty. Try adding a new note!")
            return

        for row in records:
            print("-" * 50)
            print(f"📌 [ID: {row[0]}] {row[1]}")
            print(f"🕒 Last Updated: {row[3]}")
            print(f"📝 Content:\n{row[2]}")
        print("-" * 50)

    except Error as e:
        print(f"❌ Failed to read data: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def update_note():
    """UPDATE Operation: Modifies an existing note's title and content."""
    print("\n--- 🔄 Update Existing Note ---")
    try:
        note_id = int(input("Enter the Note ID to update: "))
    except ValueError:
        print("❌ Invalid Input: Note ID must be an integer.")
        return

    connection = connect_to_database()
    if connection is None:
        return

    try:
        cursor = connection.cursor()
        cursor.execute("SELECT title, content FROM notes WHERE note_id = %s", (note_id,))
        record = cursor.fetchone()

        if not record:
            print(f"❌ Note with ID {note_id} not found.")
            return

        print(f"\nFound Current Note:")
        print(f"Current Title: {record[0]}")
        print(f"Current Content: {record[1]}\n")

        new_title = input("Enter New Title (Leave blank to keep current): ").strip()
        if not new_title:
            new_title = record[0]

        new_content = input("Enter New Content (Leave blank to keep current): ").strip()
        if not new_content:
            new_content = record[1]

        query = "UPDATE notes SET title = %s, content = %s WHERE note_id = %s"
        cursor.execute(query, (new_title, new_content, note_id))
        connection.commit()
        print(f"\n✅ Success: Note ID {note_id} has been modified successfully.")

    except Error as e:
        print(f"❌ Failed to update record: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def delete_note():
    """DELETE Operation: Permanently deletes a note by its unique identifier."""
    print("\n--- 🗑️ Delete a Note ---")
    try:
        note_id = int(input("Enter the Note ID to delete: "))
    except ValueError:
        print("❌ Invalid Input: Note ID must be an integer.")
        return

    connection = connect_to_database()
    if connection is None:
        return

    try:
        cursor = connection.cursor()
        cursor.execute("SELECT title FROM notes WHERE note_id = %s", (note_id,))
        record = cursor.fetchone()

        if not record:
            print(f"❌ Note with ID {note_id} does not exist.")
            return

        confirm = input(f"Are you sure you want to permanently delete '{record[0]}'? (yes/no): ").strip().lower()
        if confirm == 'yes':
            query = "DELETE FROM notes WHERE note_id = %s"
            cursor.execute(query, (note_id,))
            connection.commit()
            print(f"\n🗑️ Success: Note ID {note_id} removed permanently.")
        else:
            print("\n❌ Deletion canceled by user.")

    except Error as e:
        print(f"❌ Failed to delete record: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def display_menu():
    """Main terminal interface navigation handler."""
    while True:
        print("\n==================================")
        print("      📝 NOTES SAVER MENU        ")
        print("==================================")
        print("1. Add New Note ➕")
        print("2. View All Notes 📋")
        print("3. Update a Note 🔄")
        print("4. Delete a Note 🗑️")
        print("5. Exit Application ❌")
        print("==================================")
        
        choice = input("Select an option (1-5): ").strip()
        
        if choice == '1':
            add_note()
        elif choice == '2':
            view_all_notes()
        elif choice == '3':
            update_note()
        elif choice == '4':
            delete_note()
        elif choice == '5':
            print("\nThank you for using the Notes Saver Application. Goodbye! 👋")
            sys.exit()
        else:
            print("\n❌ Invalid choice! Please select a valid number between 1 and 5.")

if __name__ == "__main__":
    display_menu()
