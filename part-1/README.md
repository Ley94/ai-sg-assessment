# Word Frequency

## Project Description

This Python program fetches a [text file from Project Gutenberg](https://www.gutenberg.org/cache/epub/16317/pg16317.txt), processes its content, and prints the top 10th to 20th words by frequency.

## Assumptions and Constraints

- The program assumes words are defined as alphanumeric strings (letters and numbers).
- The program assumes words separated by non-alphanumeric characters (e.g., hyphens) are treated as separate words (e.g., 'breath-taking' is considered as two words: 'breath' and 'taking').
- The program treats text as case-insensitive (e.g., 'word' and 'Word' are considered the same).
- No third-party libraries (other than Python's standard library) are used.

## Features

- Fetches text from [this URL](https://www.gutenberg.org/cache/epub/16317/pg16317.txt).
- Tokenizes the text into words by:
  - Converting the text to lowercase.
  - Replacing non-alphanumeric characters with spaces.
  - Splitting the text into words by spaces.
- Uses a max heap for efficient ranking.

## Requirements

- Python 3.12.2 (compatible with Python 3.7+).
- No external libraries or dependencies are required—only Python's standard library is used.

## Usage

1. Clone the repository or download the program.
2. Run the program using:

```bash
python word_frequency.py
```

3. The output will display words ranked from 10th to 20th in order of frequency.

### Sample Output

```text
Words ranked from 10th to 20th by frequency:
you: 1498
for: 1364
as: 1219
not: 1200
be: 1191
he: 1107
with: 1043
his: 1041
are: 1003
i: 993
```

## Improvement

While the current tokenization process is simple and works well, more advanced techniques (such as those used in natural language processing (NLP) libraries like NLTK) could provide more accurate tokenization.

For example, regular expressions or NLP techniques could help handle edge cases, such as contractions, possessives, and other language nuances.
