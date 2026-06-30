interface LeetCodeStats {
    username: string;
    problemsSolved: number;
    contestRating: number;
    mainTag: string;
    tags: string[];
    url: string;
}

interface HackerRankStats {
    username: string,
    badges: {programmingLanguage: string, stars: number}[],
    tags: string[],
    url: string
}

export const LeetCode: LeetCodeStats = {
    username: "mrinmoyborah",
    problemsSolved: 300,
    contestRating: 1500,
    mainTag: "DSA",
    tags: ["Array", "Graph", "Dynamic Programming", "Trees"],
    url: "https://leetcode.com/u/mrinmoyborah/"
}

export const HackerRank: HackerRankStats = {
    username: "mrinmoyborah2611",
    badges: [{programmingLanguage: "C++", stars: 5}, {programmingLanguage: "Python", stars: 5}, {programmingLanguage: "SQL", stars: 5}],
    tags: ["C++", "Python", "JS", "SQL", "Problem Solving"],
    url: "https://www.hackerrank.com/profile/mrinmoyborah2611"
}
