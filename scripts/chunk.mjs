import { readFileSync, writeFileSync } from "node:fs";

// Function to split an array into chunks of a specific size
function splitIntoChunks(arr, chunkSize) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
}

// The JSON data (replace with your actual JSON content if needed)
const jsonData = JSON.parse(readFileSync("scripts/output.json"));

// Define the desired number of elements per chunk
const elementsPerChunk = 20; // Adjust this value as needed

// Split the JSON array into chunks
const chunks = splitIntoChunks(jsonData, elementsPerChunk);

// Process each chunk (write to new files, etc.)
chunks.forEach((chunk, index) => {
  // Replace 'chunk_ with your desired filename prefix
  const filename = `scripts/chunk_${index + 1}.json`;
  // console.log(`Chunk ${index + 1} data:`, chunk); // Example output
  // Write chunk data to file (implementation depends on your environment)
  writeFileSync(filename, JSON.stringify(chunk));
});
