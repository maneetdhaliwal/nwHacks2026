import { TestCase } from "@/lib/testRunner";

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  description: string;
  examples: string[];
  testCases: TestCase[];
  starterCode: string;
  aiConversation: { role: "ai" | "user"; content: string }[];
}

export const codingProblems: CodingProblem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: nums[0] + nums[1] = 2 + 7 = 9",
      "Input: nums = [3,2,4], target = 6\nOutput: [1,2]",
    ],
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], description: "Basic case" },
      { input: [[3, 2, 4], 6], expected: [1, 2], description: "Non-sequential indices" },
      { input: [[3, 3], 6], expected: [0, 1], description: "Duplicate numbers" },
    ],
    starterCode: `function solution(nums, target) {
  // Write your code here
  // Return the indices of the two numbers that add up to target
  
}`,
    aiConversation: [
      { role: "ai", content: "Hello! Welcome to your technical interview. I'm here to assess your problem-solving skills and coding abilities. Are you ready to begin?" },
      { role: "user", content: "Yes, I'm ready! Let's do this." },
      { role: "ai", content: "Great enthusiasm! Let's start with a classic problem. I'd like you to solve the Two Sum problem. Given an array of integers and a target sum, find two numbers that add up to the target. Can you explain your approach first?" },
      { role: "user", content: "I would use a hash map to store the complement of each number as I iterate through the array. For each number, I check if it exists in the map, which gives us O(n) time complexity." },
      { role: "ai", content: "Excellent explanation! You've correctly identified the optimal approach using a hash map. The O(n) time complexity is indeed better than the brute force O(n²) solution. Now, let's see you implement it. I'll open the coding sandbox for you." },
    ],
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "Strings",
    description: "Write a function that reverses a string. The input string is given as an array of characters. You must do this by modifying the input array in-place with O(1) extra memory.",
    examples: [
      "Input: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\nOutput: [\"o\",\"l\",\"l\",\"e\",\"h\"]",
      "Input: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\nOutput: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]",
    ],
    testCases: [
      { input: [[["h", "e", "l", "l", "o"]]], expected: ["o", "l", "l", "e", "h"], description: "Basic case" },
      { input: [[["H", "a", "n", "n", "a", "h"]]], expected: ["h", "a", "n", "n", "a", "H"], description: "Palindrome name" },
      { input: [[["a", "b"]]], expected: ["b", "a"], description: "Two characters" },
    ],
    starterCode: `function solution(s) {
  // Reverse the array in-place
  // Return the reversed array
  
}`,
    aiConversation: [
      { role: "ai", content: "Hello! Welcome to your technical interview. Today we'll be working on string manipulation. Are you ready?" },
      { role: "user", content: "Yes, I'm ready to go!" },
      { role: "ai", content: "Perfect! Your task is to reverse a string in-place. You're given an array of characters, and you need to reverse it using O(1) extra space. What's your approach?" },
      { role: "user", content: "I'd use a two-pointer technique. One pointer at the start, one at the end, and swap characters while moving towards the center." },
      { role: "ai", content: "That's exactly right! The two-pointer approach is elegant and efficient - O(n) time with O(1) space. Go ahead and implement it in the editor." },
    ],
  },
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "Strings",
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.",
    examples: [
      "Input: s = \"A man, a plan, a canal: Panama\"\nOutput: true\nExplanation: \"amanaplanacanalpanama\" is a palindrome.",
      "Input: s = \"race a car\"\nOutput: false\nExplanation: \"raceacar\" is not a palindrome.",
    ],
    testCases: [
      { input: ["A man, a plan, a canal: Panama"], expected: true, description: "Classic palindrome" },
      { input: ["race a car"], expected: false, description: "Not a palindrome" },
      { input: [" "], expected: true, description: "Empty/whitespace" },
      { input: ["Was it a car or a cat I saw?"], expected: true, description: "Question palindrome" },
    ],
    starterCode: `function solution(s) {
  // Check if the string is a valid palindrome
  // Ignore case and non-alphanumeric characters
  
}`,
    aiConversation: [
      { role: "ai", content: "Welcome! Let's work on a string problem today. Ready to begin?" },
      { role: "user", content: "Absolutely, let's do it!" },
      { role: "ai", content: "Great! I want you to determine if a string is a valid palindrome. Remember to ignore case and non-alphanumeric characters. How would you approach this?" },
      { role: "user", content: "First, I'd clean the string by removing non-alphanumeric characters and converting to lowercase. Then I'd check if it equals its reverse." },
      { role: "ai", content: "Good thinking! You could also use a two-pointer approach to avoid creating extra strings. Let's see your implementation." },
    ],
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    examples: [
      "Input: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.",
      "Input: nums = [1]\nOutput: 1\nExplanation: The subarray [1] has the largest sum 1.",
      "Input: nums = [5,4,-1,7,8]\nOutput: 23\nExplanation: The subarray [5,4,-1,7,8] has the largest sum 23.",
    ],
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, description: "Mixed positive/negative" },
      { input: [[1]], expected: 1, description: "Single element" },
      { input: [[5, 4, -1, 7, 8]], expected: 23, description: "Mostly positive" },
      { input: [[-1]], expected: -1, description: "Single negative" },
    ],
    starterCode: `function solution(nums) {
  // Find the contiguous subarray with the largest sum
  // Return the maximum sum
  
}`,
    aiConversation: [
      { role: "ai", content: "Hello! Today we'll tackle a dynamic programming classic. Ready for a medium difficulty problem?" },
      { role: "user", content: "Yes, bring it on!" },
      { role: "ai", content: "Excellent! The Maximum Subarray problem: find the contiguous subarray with the largest sum. This is a great problem for understanding Kadane's algorithm. What's your initial thought?" },
      { role: "user", content: "I think I'd use Kadane's algorithm - keep track of the current sum and reset it when it goes negative, while tracking the maximum sum seen so far." },
      { role: "ai", content: "Perfect! Kadane's algorithm gives us O(n) time complexity. The key insight is that a negative running sum will never help us. Implement it now." },
    ],
  },
  {
    id: "fizz-buzz",
    title: "Fizz Buzz",
    difficulty: "Easy",
    category: "Math",
    description: "Given an integer n, return a string array answer (1-indexed) where: answer[i] == \"FizzBuzz\" if i is divisible by 3 and 5, answer[i] == \"Fizz\" if i is divisible by 3, answer[i] == \"Buzz\" if i is divisible by 5, answer[i] == i (as a string) if none of the above conditions are true.",
    examples: [
      "Input: n = 3\nOutput: [\"1\",\"2\",\"Fizz\"]",
      "Input: n = 5\nOutput: [\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]",
      "Input: n = 15\nOutput: [\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\",\"Fizz\",\"7\",\"8\",\"Fizz\",\"Buzz\",\"11\",\"Fizz\",\"13\",\"14\",\"FizzBuzz\"]",
    ],
    testCases: [
      { input: [3], expected: ["1", "2", "Fizz"], description: "Up to 3" },
      { input: [5], expected: ["1", "2", "Fizz", "4", "Buzz"], description: "Up to 5" },
      { input: [15], expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"], description: "Up to 15" },
    ],
    starterCode: `function solution(n) {
  // Return an array of strings from 1 to n
  // Replace multiples of 3 with "Fizz", 5 with "Buzz", both with "FizzBuzz"
  
}`,
    aiConversation: [
      { role: "ai", content: "Welcome! Let's start with a classic warm-up problem. Ready?" },
      { role: "user", content: "Ready!" },
      { role: "ai", content: "Great! FizzBuzz - a simple but revealing problem. Print numbers 1 to n, but replace multiples of 3 with 'Fizz', 5 with 'Buzz', and both with 'FizzBuzz'. What's your approach?" },
      { role: "user", content: "I'll loop from 1 to n, check divisibility by 3 and 5 first, then by 3, then by 5, otherwise just the number." },
      { role: "ai", content: "Exactly! Order matters - check for both divisors first. Show me your implementation." },
    ],
  },
  {
    id: "merge-sorted-arrays",
    title: "Merge Sorted Array",
    difficulty: "Easy",
    category: "Arrays",
    description: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order. Merge nums2 into nums1 as one sorted array. The final sorted array should be returned (not stored inside one of the input arrays).",
    examples: [
      "Input: nums1 = [1,2,3], nums2 = [2,5,6]\nOutput: [1,2,2,3,5,6]",
      "Input: nums1 = [1], nums2 = []\nOutput: [1]",
    ],
    testCases: [
      { input: [[1, 2, 3], [2, 5, 6]], expected: [1, 2, 2, 3, 5, 6], description: "Basic merge" },
      { input: [[1], []], expected: [1], description: "Empty second array" },
      { input: [[], [1]], expected: [1], description: "Empty first array" },
      { input: [[4, 5, 6], [1, 2, 3]], expected: [1, 2, 3, 4, 5, 6], description: "Non-overlapping" },
    ],
    starterCode: `function solution(nums1, nums2) {
  // Merge two sorted arrays into one sorted array
  // Return the merged array
  
}`,
    aiConversation: [
      { role: "ai", content: "Hello! Ready for an array manipulation problem?" },
      { role: "user", content: "Yes, let's go!" },
      { role: "ai", content: "Perfect! Given two sorted arrays, merge them into a single sorted array. This is fundamental for understanding merge sort. Your approach?" },
      { role: "user", content: "I'd use two pointers, one for each array. Compare elements and add the smaller one to the result, then move that pointer forward." },
      { role: "ai", content: "Excellent! That's the merge operation from merge sort - O(n+m) time complexity. Don't forget to handle when one array is exhausted. Implement it!" },
    ],
  },
];

export const getDifficultyColor = (difficulty: CodingProblem["difficulty"]) => {
  switch (difficulty) {
    case "Easy":
      return "text-success";
    case "Medium":
      return "text-warning";
    case "Hard":
      return "text-destructive";
  }
};
