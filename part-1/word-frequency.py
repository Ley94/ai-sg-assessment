import urllib.request
from typing import List, Tuple
import re
from collections import Counter
import heapq

URL = "https://www.gutenberg.org/cache/epub/16317/pg16317.txt"


def fetch_text(url: str) -> str:
    """
    Fetches text content from a given URL.
    """
    res = urllib.request.urlopen(url)
    return res.read().decode("utf-8")


def split_text(text: str) -> List[str]:
    """
    Converts text to lowercase,
    replaces non-alphanumeric characters with spaces,
    and splits it into words.
    """
    text = text.lower()
    text = re.sub(r"[^A-Za-z0-9\s]", " ", text)
    words = text.split()
    return words


def get_top_words(
    words: List[str], start_rank: int, end_rank: int
) -> List[Tuple[str, int]]:
    """
    Finds the most frequent words 
    and returns those ranked from start_rank to end_rank (1-based index) with their respective frequencies.
    """
    word_counts = Counter(words)

    # Use a max heap to efficiently extract top words (time complexity: O(n + klogn))
    max_heap = []
    for word, count in word_counts.items():
        max_heap.append((-count, word))  # Use negative count to implement a max heap because heapq is a min heap by default
    heapq.heapify(max_heap)

    # Remove words ranked before start_rank
    for _ in range(start_rank - 1):
        heapq.heappop(max_heap)

    res = []
    for _ in range(end_rank - start_rank):
        count, word = heapq.heappop(max_heap)
        res.append((word, -count))
    return res


if __name__ == "__main__":
    text = fetch_text(URL)
    words = split_text(text)
    top_words = get_top_words(words, 10, 20)
    print("Words ranked from 10th to 20th by frequency:")
    for word, freq in top_words:
        print(f"{word}: {freq}")
