class TrieNode {
    children: Record<string, TrieNode>;
    isEndOfWord: boolean;

    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    private root: TrieNode;
    constructor() {
        this.root = new TrieNode();
    }

    // Insert a word into the Trie
    insert(word: string) {
        let node = this.root;
        for (const char of word.toLowerCase()) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    // Search for exact word
    search(word: string) {
        const node = this._searchNode(word.toLowerCase());
        return !!node && node.isEndOfWord;
    }

    // Check if any words start with the given prefix
    startsWith(prefix: string) {
        return !!this._searchNode(prefix.toLowerCase());
    }

    // Return autocomplete suggestions for a prefix
    getWordsWithPrefix(prefix: string) {
        const node = this._searchNode(prefix.toLowerCase());
        const words: never[] = [];
        if (!node) return words;
        this._dfs(node, prefix.toLowerCase(), words);
        return words;
    }

    // Helper: search for node that ends the prefix
    _searchNode(prefix: any) {
        let node = this.root;
        for (const char of prefix) {
            if (!node.children[char]) return null;
            node = node.children[char];
        }
        return node;
    }

    // Helper: depth-first search from a given node
    _dfs(node: TrieNode, prefix: string, results: any[]) {
        if (node.isEndOfWord) {
            results.push(prefix);
        }
        for (const char in node.children) {
            this._dfs(node.children[char], prefix + char, results);
        }
    }
}

// Optional export
export default Trie
