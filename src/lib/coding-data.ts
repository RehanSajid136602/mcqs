// CAVEMAN: large data file. read only relevant topic/section. no full scan.
export interface CodeExample {
  title: string;
  code: string;
  explanation?: string;
  expectedOutput?: string;
}

export interface PracticeQuestion {
  id: number;
  title: string;
  question: string;
  code?: string;
  hint: string;
  solution: string;
  expectedOutput?: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface TopicData {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  colorBg: string;
  description: string;
  importance: string;
  syntax: string;
  examples: CodeExample[];
  questions: PracticeQuestion[];
}

export const CODING_TOPICS: TopicData[] = [
  {
    id: "lists",
    title: "Python Lists",
    subtitle: "Ordered, Mutable Collections",
    iconName: "lists",
    color: "text-blue-400",
    colorBg: "bg-blue-500/10",
    description: "Lists are ordered, mutable sequences that can store multiple items of any type. They are one of the most commonly used data structures in Python.",
    importance: "Lists are fundamental to Python programming. You'll use them for storing collections of data, iterating over items, and managing ordered data.",
    syntax: "# Creating a list\nmy_list = [1, 2, 3, 4, 5]\n\n# Mixed types\nmixed = [1, \"hello\", 3.14, True]\n\n# Nested lists\nnested = [[1, 2], [3, 4], [5, 6]]",
    examples: [
      {
        title: "Creating and Accessing Lists",
        code: 'fruits = ["apple", "banana", "cherry", "mango"]\n\n# Positive indexing (0-based)\nprint(fruits[0])   # apple\nprint(fruits[2])   # cherry\n\n# Negative indexing (from end)\nprint(fruits[-1])  # mango\nprint(fruits[-2])  # cherry\n\n# Slicing\nprint(fruits[1:3]) # [\'banana\', \'cherry\']\nprint(fruits[:2])  # [\'apple\', \'banana\']\nprint(fruits[2:])  # [\'cherry\', \'mango\']',
        explanation: "Lists use 0-based indexing. Negative indices count from the end, with -1 being the last element.",
        expectedOutput: "apple\ncherry\nmango\ncherry\n['banana', 'cherry']\n['apple', 'banana']\n['cherry', 'mango']",
      },
      {
        title: "Modifying Lists",
        code: "nums = [1, 2, 3]\n\n# Add elements\nnums.append(4)        # [1, 2, 3, 4]\nnums.insert(1, 1.5)   # [1, 1.5, 2, 3, 4]\nnums.extend([5, 6])   # [1, 1.5, 2, 3, 4, 5, 6]\n\n# Remove elements\nnums.pop()           # Removes & returns last\nnums.remove(1.5)      # Removes first occurrence\nnums.clear()          # Empty the list\n\nprint(nums)",
        explanation: "append() adds one item, insert() at specific index, extend() adds multiple items from iterable.",
        expectedOutput: "[]",
      },
      {
        title: "List Operations and Methods",
        code: "numbers = [3, 1, 4, 1, 5, 9, 2, 6]\n\n# Sorting\nnumbers.sort()        # In-place sort\nprint(sorted(numbers))  # New sorted list\n\n# Finding\nprint(numbers.index(5))  # 4\nprint(numbers.count(1))  # 2\nprint(5 in numbers)       # True\n\n# List functions\nprint(len(numbers))    # 8\nprint(sum(numbers))    # 31\nprint(min(numbers))    # 1\nprint(max(numbers))    # 9",
        explanation: "Lists have built-in methods for sorting, searching, and aggregating data.",
        expectedOutput: "[1, 1, 2, 3, 4, 5, 6, 9]\n[1, 1, 2, 3, 4, 5, 6, 9]\n4\n2\nTrue\n8\n31\n1\n9",
      },
      {
        title: "List Comprehension",
        code: "# Basic syntax: [expr for item in iterable]\n\n# Square numbers\nsquares = [x**2 for x in range(5)]\nprint(squares)\n\n# Even numbers only\nevens = [x for x in range(10) if x % 2 == 0]\nprint(evens)\n\n# Nested comprehension\nmatrix = [[i*j for j in range(3)] for i in range(3)]\nprint(matrix)",
        explanation: "List comprehension provides a concise way to create lists based on existing iterables.",
        expectedOutput: "[0, 1, 4, 9, 16]\n[0, 2, 4, 6, 8]\n[[0, 0, 0], [0, 1, 2], [0, 2, 4]]",
      },
    ],
    questions: [
      {
        id: 1,
        title: "Output Prediction",
        question: "Predict the output of this list slicing operation:",
        code: "L = ['physics', 'chemistry', 'biology', 'math', 'english']\nprint(L[1:4])",
        hint: "Slicing includes start index but excludes end index. Index 1 is 'chemistry', index 4 is excluded.",
        solution: "L = ['physics', 'chemistry', 'biology', 'math', 'english']\nprint(L[1:4])\n# Output: ['chemistry', 'biology', 'math']",
        expectedOutput: "['chemistry', 'biology', 'math']",
        difficulty: "easy",
      },
      {
        id: 2,
        title: "append() vs extend()",
        question: "What will be the final value of my_list?",
        code: "my_list = [1, 2, 3]\nmy_list.append([4, 5])\nmy_list.extend([6, 7])\nprint(my_list)",
        hint: "append() adds the entire object as one element. extend() unpacks and adds each element individually.",
        solution: "my_list = [1, 2, 3]\nmy_list.append([4, 5])   # [1, 2, 3, [4, 5]]\nmy_list.extend([6, 7])  # [1, 2, 3, [4, 5], 6, 7]\nprint(my_list)",
        expectedOutput: "[1, 2, 3, [4, 5], 6, 7]",
        difficulty: "easy",
      },
      {
        id: 3,
        title: "Filtering Lists",
        question: "Write code to get all marks greater than 75:",
        code: "marks = [82, 45, 90, 67, 88, 55, 91, 73]\n# Expected: [82, 90, 88, 91]",
        hint: "Use list comprehension with a condition: [item for item in iterable if condition]",
        solution: "# List comprehension\nmarks = [82, 45, 90, 67, 88, 55, 91, 73]\nresult = [m for m in marks if m > 75]\nprint(result)",
        expectedOutput: "[82, 90, 88, 91]",
        difficulty: "medium",
      },
      {
        id: 4,
        title: "Bug Fix: Remove Evens",
        question: "Fix this code to correctly remove all even numbers:",
        code: "numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nfor num in numbers:\n    if num % 2 == 0:\n        numbers.remove(num)\nprint(numbers)",
        hint: "Modifying a list while iterating causes elements to be skipped. Iterate over a copy instead.",
        solution: "# Solution 1: Iterate over copy\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nfor num in numbers[:]:  # Creates a copy\n    if num % 2 == 0:\n        numbers.remove(num)\nprint(numbers)\n\n# Solution 2: List comprehension (recommended)\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nnumbers = [n for n in numbers if n % 2 != 0]\nprint(numbers)",
        expectedOutput: "[1, 3, 5, 7, 9]\n[1, 3, 5, 7, 9]",
        difficulty: "hard",
      },
      {
        id: 5,
        title: "List Comprehension with Length",
        question: "Filter words that have more than 4 characters:",
        code: 'words = ["apple", "cat", "computer", "dog", "algorithm", "book", "programming"]\n# Expected: [\'apple\', \'computer\', \'algorithm\', \'programming\']',
        hint: "Use len() in your condition: [word for word in words if len(word) > 4]",
        solution: 'words = ["apple", "cat", "computer", "dog", "algorithm", "book", "programming"]\nlong_words = [w for w in words if len(w) > 4]\nprint(long_words)',
        expectedOutput: "['apple', 'computer', 'algorithm', 'programming']",
        difficulty: "medium",
      },
    ],
  },
  {
    id: "tuples",
    title: "Python Tuples",
    subtitle: "Ordered, Immutable Sequences",
    iconName: "tuples",
    color: "text-purple-400",
    colorBg: "bg-purple-500/10",
    description: "Tuples are ordered, immutable sequences. Once created, their contents cannot be modified. They are similar to lists but used for fixed data.",
    importance: "Tuples are used for fixed data that shouldn't change (like coordinates, database records). They're faster than lists and can be used as dictionary keys.",
    syntax: "# Creating a tuple\nmy_tuple = (1, 2, 3, 4, 5)\n\n# Single element (needs comma)\nsingle = (42,)\n\n# Tuple unpacking\na, b, c = (1, 2, 3)",
    examples: [
      {
        title: "Creating and Accessing Tuples",
        code: "point = (3, 4)\ncolors = (\"red\", \"green\", \"blue\")\n\n# Accessing (same as lists)\nprint(point[0])       # 3\nprint(colors[-1])    # blue\n\n# Slicing\nprint(colors[1:])     # ('green', 'blue')\n\n# Length\nprint(len(point))     # 2",
        explanation: "Tuples support the same indexing and slicing as lists, but cannot be modified.",
        expectedOutput: "3\nblue\n('green', 'blue')\n2",
      },
      {
        title: "Tuple Unpacking",
        code: "# Basic unpacking\nx, y = (10, 20)\nprint(f\"x={x}, y={y}\")\n\n# Multiple assignment\na, b, c = 1, 2, 3\n\n# Swap variables\na, b = b, a\n\n# Extended unpacking\nhead, *tail = [1, 2, 3, 4, 5]\nprint(f\"head={head}, tail={tail}\")",
        explanation: "Tuple unpacking allows you to assign multiple variables at once from a tuple or sequence.",
        expectedOutput: "x=10, y=20\nhead=1, tail=[2, 3, 4, 5]",
      },
      {
        title: "Nested Tuples",
        code: 'student = ("Ahmed", 85, ("Lahore", "Pakistan"))\n\n# Accessing nested elements\nprint(student[0])         # Ahmed\nprint(student[2][0])      # Lahore\n\n# Nested unpacking\nname, marks, (city, _) = student\nprint(f"{name} from {city} scored {marks}")',
        explanation: "Tuples can contain other tuples, lists, or any data type. Access nested elements with multiple indices.",
        expectedOutput: "Ahmed\nLahore\nAhmed from Lahore scored 85",
      },
      {
        title: "Tuple Methods",
        code: "data = (1, 2, 3, 2, 4, 2, 5)\n\n# count() - occurrences of value\nprint(data.count(2))       # 3\n\n# index() - first occurrence\nprint(data.index(4))       # 4\n\n# Membership test\nprint(3 in data)           # True\nprint(6 in data)           # False",
        explanation: "Tuples have only two methods (count and index) because they are immutable.",
        expectedOutput: "3\n4\nTrue\nFalse",
      },
    ],
    questions: [
      {
        id: 1,
        title: "Tuple Basics",
        question: "What is the output of the following:",
        code: "point = (5, 10, 15)\nprint(point[1])\nprint(point[-1])",
        hint: "Index 1 is the second element. -1 is the last element.",
        solution: "point = (5, 10, 15)\nprint(point[1])    # 10\nprint(point[-1])   # 15",
        expectedOutput: "10\n15",
        difficulty: "easy",
      },
      {
        id: 2,
        title: "Tuple Unpacking",
        question: "What values will x, y, z get?",
        code: "a, b, c = (100, 200, 300)\nx, y = a, b\nz = c\nprint(f\"x={x}, y={y}, z={z}\")",
        hint: "Unpacking assigns each element of the tuple to a variable in order.",
        solution: "a, b, c = (100, 200, 300)\nx, y = a, b\nz = c\nprint(f\"x={x}, y={y}, z={z}\")",
        expectedOutput: "x=100, y=200, z=300",
        difficulty: "easy",
      },
      {
        id: 3,
        title: "Single Element Tuple",
        question: "What type is single? How do you create it correctly?",
        code: "single = (42)\nprint(type(single))\n\nsingle_tuple = (42,)\nprint(type(single_tuple))",
        hint: "Without a trailing comma, (42) is just an integer in parentheses, not a tuple.",
        solution: "single = (42)\nprint(type(single))      # <class 'int'>\n\nsingle_tuple = (42,)\nprint(type(single_tuple))  # <class 'tuple'>",
        expectedOutput: "<class 'int'>\n<class 'tuple'>",
        difficulty: "medium",
      },
      {
        id: 4,
        title: "Nested Tuple Access",
        question: "What is the output?",
        code: 'data = (("A", "B"), ("C", "D"))\nprint(data[0][1])\nprint(data[1][0])',
        hint: "First index gets the inner tuple, second index gets the element.",
        solution: 'data = (("A", "B"), ("C", "D"))\nprint(data[0][1])   # B\nprint(data[1][0])  # C',
        expectedOutput: "B\nC",
        difficulty: "medium",
      },
      {
        id: 5,
        title: "Tuple Methods",
        question: "What will be the output?",
        code: "numbers = (1, 2, 3, 2, 4, 2, 5)\nprint(numbers.count(2))\nprint(numbers.index(3))",
        hint: "count() returns total occurrences. index() returns position of first occurrence.",
        solution: "numbers = (1, 2, 3, 2, 4, 2, 5)\nprint(numbers.count(2))   # 3 (appears at indices 1, 3, 5)\nprint(numbers.index(3))  # 2 (first occurrence)",
        expectedOutput: "3\n2",
        difficulty: "easy",
      },
    ],
  },
  {
    id: "dictionaries",
    title: "Python Dictionaries",
    subtitle: "Key-Value Data Structure",
    iconName: "dictionaries",
    color: "text-emerald-400",
    colorBg: "bg-emerald-500/10",
    description: "Dictionaries store data in key-value pairs. Keys must be unique and immutable (strings, numbers, tuples). Values can be any type.",
    importance: "Dictionaries provide O(1) lookup performance, making them ideal for fast data access. They're essential for representing structured data.",
    syntax: '# Creating a dictionary\nmy_dict = {"key1": "value1", "key2": "value2"}\n\n# Accessing\nprint(my_dict["key1"])\n\n# Safe access with default\nprint(my_dict.get("key3", "default"))',
    examples: [
      {
        title: "Creating and Accessing",
        code: 'student = {\n    "name": "Ahmed",\n    "age": 17,\n    "grade": "A",\n    "subjects": ["Math", "Physics"]\n}\n\n# Access values\nprint(student["name"])\nprint(student.get("height", "N/A"))\n\n# All keys and values\nprint(list(student.keys()))\nprint(list(student.values()))',
        explanation: "Use keys to access values. get() provides a safe default if key doesn't exist.",
        expectedOutput: "Ahmed\nN/A\n['name', 'age', 'grade', 'subjects']\n['Ahmed', 17, 'A', ['Math', 'Physics']]",
      },
      {
        title: "Modifying Dictionaries",
        code: 'data = {"a": 1, "b": 2}\n\n# Add or update\ndata["c"] = 3\ndata["a"] = 10\n\n# Update with another dict\ndata.update({"d": 4, "e": 5})\n\n# Remove\nremoved = data.pop("b")\n\n# Clear\ndata.clear()\n\nprint(data)',
        explanation: "Dictionaries are mutable. Add keys with assignment, remove with pop(), clear all with clear().",
        expectedOutput: "{}",
      },
      {
        title: "Iterating Over Dictionaries",
        code: 'student = {"name": "Ahmed", "age": 17, "grade": "A"}\n\n# Keys\nfor key in student:\n    print(key)\n\n# Key-value pairs\nfor key, value in student.items():\n    print(f"{key}: {value}")\n\n# Values only\nfor value in student.values():\n    print(value)',
        explanation: "Use items() to iterate over key-value pairs together.",
        expectedOutput: "name\nage\ngrade\nname: Ahmed\nage: 17\ngrade: A\nAhmed\n17\nA",
      },
      {
        title: "Dictionary Comprehension",
        code: "# Create dict from numbers\nsquares = {x: x**2 for x in range(5)}\nprint(squares)\n\n# Filter existing dict\nscores = {\"Ali\": 85, \"Sara\": 92, \"Ahmed\": 78}\npassed = {k: v for k, v in scores.items() if v >= 80}\nprint(passed)",
        explanation: "Dictionary comprehension creates dicts from iterables with optional filtering.",
        expectedOutput: "{0: 0, 1: 1, 2: 4, 3: 9, 4: 16}\n{'Ali': 85, 'Sara': 92}",
      },
    ],
    questions: [
      {
        id: 1,
        title: "Accessing Dictionary Values",
        question: "What is the output?",
        code: 'info = {"name": "Sara", "age": 18, "city": "Karachi"}\nprint(info["age"])\nprint(info.get("country", "Pakistan"))',
        hint: "Use square bracket notation for direct access. get() returns default if key missing.",
        solution: 'info = {"name": "Sara", "age": 18, "city": "Karachi"}\nprint(info["age"])                    # 18\nprint(info.get("country", "Pakistan"))  # Pakistan (default)',
        expectedOutput: "18\nPakistan",
        difficulty: "easy",
      },
      {
        id: 2,
        title: "Adding and Updating",
        question: "What will the dictionary contain after these operations?",
        code: 'd = {"a": 1, "b": 2}\nd["c"] = 3\nd["a"] = 10\nd.update({"d": 4})\nprint(d)',
        hint: "New keys are added, existing keys are updated.",
        solution: 'd = {"a": 1, "b": 2}\nd["c"] = 3        # Add new key\nd["a"] = 10       # Update existing\nd.update({"d": 4})  # Add another\nprint(d)',
        expectedOutput: "{'a': 10, 'b': 2, 'c': 3, 'd': 4}",
        difficulty: "medium",
      },
      {
        id: 3,
        title: "Dictionary Iteration",
        question: "What does this code print?",
        code: "data = {\"x\": 10, \"y\": 20, \"z\": 30}\ntotal = 0\nfor key in data:\n    total += data[key]\nprint(total)",
        hint: "Iterating over keys lets you access each value with data[key].",
        solution: 'data = {"x": 10, "y": 20, "z": 30}\ntotal = 0\nfor key in data:\n    total += data[key]\nprint(total)  # 10 + 20 + 30',
        expectedOutput: "60",
        difficulty: "easy",
      },
      {
        id: 4,
        title: "Dictionary Comprehension",
        question: "What does this create?",
        code: 'words = ["apple", "cat", "computer"]\nlengths = {word: len(word) for word in words}\nprint(lengths)',
        hint: "Dict comprehension: {key_expression: value_expression for item in iterable}",
        solution: 'words = ["apple", "cat", "computer"]\nlengths = {word: len(word) for word in words}\nprint(lengths)',
        expectedOutput: "{'apple': 5, 'cat': 3, 'computer': 8}",
        difficulty: "medium",
      },
      {
        id: 5,
        title: "Filtering with Comprehension",
        question: "Filter students with score >= 80:",
        code: 'scores = {"Ali": 85, "Sara": 92, "Ahmed": 78, "Fatima": 88}\n# Expected: {\'Ali\': 85, \'Sara\': 92, \'Fatima\': 88}',
        hint: "Use items() with a condition to filter key-value pairs.",
        solution: 'scores = {"Ali": 85, "Sara": 92, "Ahmed": 78, "Fatima": 88}\nresult = {k: v for k, v in scores.items() if v >= 80}\nprint(result)',
        expectedOutput: "{'Ali': 85, 'Sara': 92, 'Fatima': 88}",
        difficulty: "hard",
      },
    ],
  },
  {
    id: "sql",
    title: "SQL Queries",
    subtitle: "Database Operations",
    iconName: "sql",
    color: "text-cyan-400",
    colorBg: "bg-cyan-500/10",
    description: "SQL (Structured Query Language) is used to create, manage, and query relational databases. It's essential for storing and retrieving data.",
    importance: "SQL is required for HSSC-II Computer Science. Understanding database operations is crucial for any programming career.",
    syntax: "-- Create table\nCREATE TABLE students (\n    id INTEGER PRIMARY KEY,\n    name TEXT,\n    age INTEGER\n);\n\n-- Insert data\nINSERT INTO students VALUES (1, 'Ahmed', 17);",
    examples: [
      {
        title: "Creating Tables",
        code: "-- Create a student table\nCREATE TABLE students (\n    id INTEGER PRIMARY KEY,\n    name TEXT NOT NULL,\n    age INTEGER CHECK (age > 0),\n    grade TEXT DEFAULT 'C'\n);\n\n-- View table structure\n.schema students",
        explanation: "PRIMARY KEY uniquely identifies each row. NOT NULL prevents empty values. DEFAULT provides fallback.",
        expectedOutput: "Table created successfully",
      },
      {
        title: "INSERT Data",
        code: "-- Insert single row\nINSERT INTO students (name, age, grade)\nVALUES ('Ahmed', 17, 'A');\n\n-- Insert multiple rows\nINSERT INTO students (name, age, grade) VALUES\n    ('Sara', 18, 'B'),\n    ('Ali', 17, 'A'),\n    ('Fatima', 19, 'C');",
        explanation: "INSERT adds new rows. Specify column names to insert only certain fields.",
        expectedOutput: "Rows inserted successfully",
      },
      {
        title: "SELECT Queries",
        code: "-- All columns\nSELECT * FROM students;\n\n-- Specific columns\nSELECT name, grade FROM students;\n\n-- With condition\nSELECT name, age FROM students\nWHERE age > 17;\n\n-- Ordered results\nSELECT * FROM students\nORDER BY name ASC;",
        explanation: "WHERE filters rows. ORDER BY sorts results (ASC or DESC).",
        expectedOutput: "Query results displayed",
      },
      {
        title: "UPDATE and DELETE",
        code: "-- Update records\nUPDATE students\nSET grade = 'A+'\nWHERE name = 'Ahmed';\n\n-- Delete specific\nDELETE FROM students\nWHERE age < 17;\n\n-- Delete all\nDELETE FROM students;",
        explanation: "UPDATE modifies existing rows. DELETE removes rows. Always use WHERE with UPDATE/DELETE!",
        expectedOutput: "Records updated/deleted",
      },
      {
        title: "Aggregate Functions",
        code: "-- Count rows\nSELECT COUNT(*) FROM students;\n\n-- Sum and average\nSELECT AVG(age), SUM(age) FROM students;\n\n-- Group by\nSELECT grade, COUNT(*) as total\nFROM students\nGROUP BY grade;\n\n-- Having (group filter)\nSELECT grade, COUNT(*) as total\nFROM students\nGROUP BY grade\nHAVING total > 1;",
        explanation: "GROUP BY groups rows for aggregation. HAVING filters groups (WHERE filters rows).",
        expectedOutput: "Aggregated results displayed",
      },
    ],
    questions: [
      {
        id: 1,
        title: "CREATE TABLE",
        question: "Write SQL to create a table for books with: id (PRIMARY KEY), title (TEXT), author (TEXT), price (INTEGER).",
        hint: "PRIMARY KEY auto-increments by default in SQLite.",
        solution: "CREATE TABLE books (\n    id INTEGER PRIMARY KEY,\n    title TEXT NOT NULL,\n    author TEXT,\n    price INTEGER\n);",
        expectedOutput: "Table created: books",
        difficulty: "easy",
      },
      {
        id: 2,
        title: "INSERT Data",
        question: "Insert two books into the books table.",
        hint: "List column names, then multiple value sets.",
        solution: "INSERT INTO books (title, author, price) VALUES\n    ('Python Basics', 'Ali Khan', 650),\n    ('Database Design', 'Sara Ahmed', 850);",
        expectedOutput: "2 rows inserted",
        difficulty: "easy",
      },
      {
        id: 3,
        title: "SELECT with WHERE",
        question: "Select all books with price greater than 600, ordered by price descending.",
        hint: "Use WHERE for condition, ORDER BY for sorting (DESC for descending).",
        solution: "SELECT * FROM books\nWHERE price > 600\nORDER BY price DESC;",
        expectedOutput: "Books with price > 600 displayed",
        difficulty: "medium",
      },
      {
        id: 4,
        title: "UPDATE Statement",
        question: "Update the author of the book 'Python Basics' to 'Ali Khan'.",
        hint: "UPDATE sets new values, WHERE identifies which rows.",
        solution: "UPDATE books\nSET author = 'Ali Khan'\nWHERE title = 'Python Basics';",
        expectedOutput: "1 row updated",
        difficulty: "medium",
      },
      {
        id: 5,
        title: "GROUP BY with COUNT",
        question: "Count how many books each author has (show author and count).",
        hint: "GROUP BY groups rows, COUNT() counts in each group.",
        solution: "SELECT author, COUNT(*) AS book_count\nFROM books\nGROUP BY author;",
        expectedOutput: "Author and book count displayed",
        difficulty: "hard",
      },
    ],
  },
];

export const TOPIC_SLUGS = CODING_TOPICS.map((t) => t.id);

export function getTopicById(id: string): TopicData | undefined {
  return CODING_TOPICS.find((t) => t.id === id);
}
